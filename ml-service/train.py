import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
from preprocess import extract_features, scale_features
import warnings

warnings.filterwarnings('ignore')

class MLModels:
    def __init__(self):
        self.linear_model = LinearRegression()
        self.decision_tree = DecisionTreeClassifier(max_depth=5, random_state=42)
        self.scaler = None
        self.feature_names = ['total_clicks', 'unique_sessions', 'mobile_ratio', 'click_velocity', 'daily_clicks', 'engagement']

    def train(self, click_stats, product_data):
        """
        Train ML models
        """
        try:
            X, y_demand, merged_data = extract_features(click_stats, product_data)

            if X is None:
                return False, "Failed to extract features"

            # Scale features
            X_scaled, self.scaler = scale_features(X)

            # Train linear regression for click prediction
            self.linear_model.fit(X_scaled, merged_data['total_clicks'])

            # Train decision tree for demand classification
            self.decision_tree.fit(X_scaled, y_demand)

            return True, "Models trained successfully"

        except Exception as e:
            print(f"Error in training: {e}")
            return False, str(e)

    def predict(self, X):
        """
        Make predictions
        """
        try:
            if self.scaler is None:
                return None, None, "Models not trained"

            X_scaled = self.scaler.transform(X)

            # Predict clicks
            predicted_clicks = self.linear_model.predict(X_scaled)

            # Predict demand level
            demand_predictions = self.decision_tree.predict(X_scaled)

            # Convert demand predictions to labels
            demand_labels = ['high' if pred == 1 else 'low' for pred in demand_predictions]

            return predicted_clicks, demand_labels, None

        except Exception as e:
            return None, None, str(e)


def detect_trends(merged_data):
    """
    Detect products with increasing trends
    """
    try:
        trends = []

        for idx, row in merged_data.iterrows():
            product_id = str(row['productId'])

            # Calculate trend score (0-100)
            if row['older_clicks'] > 0:
                trend_score = min(100, (row['recent_clicks'] / max(row['older_clicks'], 1)) * 50)
            else:
                trend_score = 50 if row['recent_clicks'] > 0 else 0

            trend_score = max(0, min(100, trend_score + row['click_velocity'] * 10))

            is_increasing = row['trend_direction'] == 1

            trends.append({
                'productId': product_id,
                'trendScore': float(trend_score),
                'isIncreasing': bool(is_increasing)
            })

        return trends

    except Exception as e:
        print(f"Error in detect_trends: {e}")
        return []


def generate_recommendations(merged_data, predicted_clicks, demand_labels):
    """
    Generate recommendations based on predictions
    """
    try:
        recommendations = []

        for idx, row in merged_data.iterrows():
            product_id = str(row['productId'])
            predicted = predicted_clicks[idx]
            demand = demand_labels[idx]
            current_clicks = row['total_clicks']

            # Generate recommendation
            if demand == 'high' and predicted > current_clicks * 1.5:
                recommendation = 'promote'
            elif demand == 'low' or predicted < current_clicks * 0.5:
                recommendation = 'discontinue'
            elif predicted > current_clicks * 1.2:
                recommendation = 'promote'
            else:
                recommendation = 'maintain'

            # Calculate confidence
            if demand == 'high':
                confidence = 0.85
            elif demand == 'low':
                confidence = 0.75
            else:
                confidence = 0.7

            recommendations.append({
                'productId': product_id,
                'predictedDemand': demand,
                'predictedClicks': int(predicted),
                'recommendation': recommendation,
                'confidence': confidence
            })

        return recommendations

    except Exception as e:
        print(f"Error in generate_recommendations: {e}")
        return []


if __name__ == '__main__':
    print("ML Models module loaded successfully")
