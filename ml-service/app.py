import os
from flask import Flask, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
from main import MLPipeline
import threading
import time
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)

# ML Pipeline instance
ml_pipeline = MLPipeline()
last_run = None
run_interval = int(os.getenv('ML_RUN_INTERVAL', 3600))  # Default 1 hour

def run_ml_pipeline_background():
    """Run ML pipeline in background"""
    global last_run
    while True:
        try:
            ml_pipeline.run_pipeline()
            last_run = datetime.now()
            print(f"ML Pipeline ran at {last_run}")
        except Exception as e:
            print(f"Error in background pipeline: {e}")

        time.sleep(run_interval)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'lastRun': str(last_run),
        'runInterval': run_interval
    })

@app.route('/run', methods=['POST'])
def run_now():
    try:
        success = ml_pipeline.run_pipeline()
        return jsonify({
            'success': success,
            'message': 'ML Pipeline executed'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    # Start background thread
    bg_thread = threading.Thread(target=run_ml_pipeline_background, daemon=True)
    bg_thread.start()

    print("ML Service started")
    app.run(host='0.0.0.0', port=5001, debug=False)
