import numpy as np

def preprocess_input(input_data, scaler):
    """
    Preprocess the input data:
    - Apply scaling (e.g., StandardScaler)
    - Reshape for model input (example: CNN-LSTM expects (1, 6, 9))
    """
    # Convert and scale
    scaled = scaler.transform([input_data])  # shape: (1, 54)

    # Reshape to (1, 6, 9) — adjust if your model expects differently
    reshaped = scaled.reshape(1, 6, 9)
    return reshaped
