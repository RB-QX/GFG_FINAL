from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import joblib
import numpy as np
import os

from utils.preprocess import preprocess_input

app = Flask(__name__)
CORS(app)

# Load model and scaler
MODEL_PATH = './model/cnn_lstm_model_4.h5'
SCALER_PATH = './scaler.pkl'

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ Model and scaler loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model or scaler: {e}")
    raise

# Label mapping
LABELS = [
    "Addictive disorder",
    "Anxiety disorder",
    "Healthy control",
    "Mood disorder",
    "Obsessive compulsive disorder",
    "Schizophrenia",
    "Trauma and stress related disorder"
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data or len(data) != 54:
            return jsonify({'error': 'Invalid input: 54 features required'}), 400

        input_data = [float(data[f'feature{i}']) for i in range(54)]
        input_processed = preprocess_input(input_data, scaler)

        predictions = model.predict(input_processed, verbose=0)
        predicted_index = int(np.argmax(predictions))
        predicted_label = LABELS[predicted_index]
        confidences = dict(zip(LABELS, predictions[0].tolist()))

        return jsonify({
            "prediction": predicted_label,
            "confidences": confidences
        })

    except ValueError:
        return jsonify({'error': 'Invalid input: All values must be numerical'}), 400
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': 'An error occurred during prediction'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
