import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
import warnings

warnings.filterwarnings('ignore')

def preprocess_click_data(click_events_data):
    """
    Preprocess raw click event data into features for ML model
    """
    try:
        if not click_events_data:
            return None

        df = pd.DataFrame(click_events_data)
        df['timestamp'] = pd.to_datetime(df['timestamp'])

        # Group by product and aggregate
        product_stats = df.groupby('productId').agg({
            'timestamp': ['count', 'min', 'max'],
            'sessionId': 'nunique',
            'device': lambda x: (x == 'mobile').sum() / len(x)
        }).reset_index()

        product_stats.columns = ['productId', 'total_clicks', 'first_click', 'last_click', 'unique_sessions', 'mobile_ratio']

        # Calculate trend (clicks in last 7 days vs before)
        seven_days_ago = datetime.now() - timedelta(days=7)
        recent_clicks = df[df['timestamp'] >= seven_days_ago].groupby('productId').size()
        older_clicks = df[df['timestamp'] < seven_days_ago].groupby('productId').size()

        product_stats['recent_clicks'] = product_stats['productId'].map(recent_clicks).fillna(0)
        product_stats['older_clicks'] = product_stats['productId'].map(older_clicks).fillna(0)
        product_stats['trend_direction'] = (product_stats['recent_clicks'] > product_stats['older_clicks']).astype(int)

        # Calculate click velocity
        product_stats['duration_days'] = (product_stats['last_click'] - product_stats['first_click']).dt.total_seconds() / (24 * 3600)
        product_stats['click_velocity'] = product_stats['total_clicks'] / (product_stats['duration_days'] + 1)

        return product_stats

    except Exception as e:
        print(f"Error in preprocess_click_data: {e}")
        return None


def preprocess_product_data(products_data):
    """
    Preprocess product data for features
    """
    try:
        if not products_data:
            return None

        df = pd.DataFrame(products_data)
        df['ctr'] = df.apply(lambda x: x['clicks'] / max(x['impressions'], 1), axis=1)

        return df[['_id', 'title', 'category', 'clicks', 'impressions', 'ctr']]

    except Exception as e:
        print(f"Error in preprocess_product_data: {e}")
        return None


def extract_features(click_stats, product_data):
    """
    Extract features for ML models
    """
    try:
        if click_stats is None or product_data is None:
            return None

        # Merge data
        merged = click_stats.merge(
            product_data[['_id', 'category', 'ctr']],
            left_on='productId',
            right_on='_id',
            how='left'
        )

        # Feature engineering
        merged['daily_clicks'] = merged['total_clicks'] / (merged['duration_days'] + 1)
        merged['engagement'] = merged['unique_sessions'] / (merged['total_clicks'] + 1)

        # Select features for modeling
        feature_cols = ['total_clicks', 'unique_sessions', 'mobile_ratio', 'click_velocity', 'daily_clicks', 'engagement']
        X = merged[feature_cols].fillna(0)
        y_demand = (merged['total_clicks'] > merged['total_clicks'].median()).astype(int)

        return X, y_demand, merged

    except Exception as e:
        print(f"Error in extract_features: {e}")
        return None, None, None


def scale_features(X):
    """
    Standardize features
    """
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    return X_scaled, scaler


if __name__ == '__main__':
    print("Preprocessing module loaded successfully")
