import os
import json
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
from preprocess import preprocess_click_data, preprocess_product_data
from train import MLModels, detect_trends, generate_recommendations

load_dotenv()

class MLPipeline:
    def __init__(self):
        self.mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
        self.db_name = os.getenv('DB_NAME', 'ecommerce-analytics')
        self.client = None
        self.db = None
        self.models = MLModels()

    def connect_mongodb(self):
        """Connect to MongoDB"""
        try:
            self.client = MongoClient(self.mongodb_uri)
            self.db = self.client[self.db_name]
            print("Connected to MongoDB")
            return True
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            return False

    def fetch_data(self):
        """Fetch data from MongoDB"""
        try:
            click_events = list(self.db['clickevents'].find())
            products = list(self.db['products'].find())

            print(f"Fetched {len(click_events)} click events and {len(products)} products")
            return click_events, products

        except Exception as e:
            print(f"Error fetching data: {e}")
            return [], []

    def run_pipeline(self):
        """Run the complete ML pipeline"""
        try:
            print("\n=== Starting ML Pipeline ===")

            # Connect to MongoDB
            if not self.connect_mongodb():
                return False

            # Fetch data
            click_events, products = self.fetch_data()

            if not click_events or not products:
                print("Insufficient data for ML pipeline")
                return False

            # Preprocess data
            print("Preprocessing data...")
            click_stats = preprocess_click_data(click_events)
            product_data = preprocess_product_data(products)

            if click_stats is None or product_data is None:
                print("Data preprocessing failed")
                return False

            # Train models
            print("Training ML models...")
            success, message = self.models.train(click_stats, product_data)
            if not success:
                print(f"Model training failed: {message}")
                return False

            # Make predictions
            print("Making predictions...")
            from preprocess import extract_features, scale_features
            X, y, merged = extract_features(click_stats, product_data)
            predicted_clicks, demand_labels, error = self.models.predict(X)

            if error:
                print(f"Prediction error: {error}")
                return False

            # Detect trends
            print("Detecting trends...")
            trends = detect_trends(merged)

            # Generate recommendations
            print("Generating recommendations...")
            recommendations = generate_recommendations(merged, predicted_clicks, demand_labels)

            # Store results in MongoDB
            print("Storing results in MongoDB...")
            self.store_results(recommendations, trends)

            print("=== ML Pipeline Completed Successfully ===\n")
            return True

        except Exception as e:
            print(f"Pipeline error: {e}")
            return False

    def store_results(self, recommendations, trends):
        """Store ML results in MongoDB"""
        try:
            ml_predictions_collection = self.db['mlpredictions']

            for i, rec in enumerate(recommendations):
                product_id = rec['productId']
                trend_info = next((t for t in trends if t['productId'] == product_id), {})

                prediction_doc = {
                    'productId': product_id,
                    'predictedDemand': rec['predictedDemand'],
                    'predictedClicks': rec['predictedClicks'],
                    'trendScore': trend_info.get('trendScore', 0),
                    'isIncreasing': trend_info.get('isIncreasing', False),
                    'recommendation': rec['recommendation'],
                    'confidence': rec['confidence'],
                    'generatedAt': datetime.now()
                }

                # Update or insert
                ml_predictions_collection.update_one(
                    {'productId': product_id},
                    {'$set': prediction_doc},
                    upsert=True
                )

            print(f"Stored {len(recommendations)} predictions in MongoDB")

        except Exception as e:
            print(f"Error storing results: {e}")

    def close_connection(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()


if __name__ == '__main__':
    pipeline = MLPipeline()
    pipeline.run_pipeline()
    pipeline.close_connection()
