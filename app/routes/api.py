import os
import uuid
import base64
from flask import Blueprint, jsonify, request, current_app
from app.services import model_service

api_bp = Blueprint('api', __name__)

@api_bp.route('/predict', methods=['POST'])
def predict():
    """Endpoint to receive handwritten digit images (base64) and return model prediction."""
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'No image data provided'}), 400
        
    image_data = data['image']
    
    try:
        # Decode base64 image data
        if ',' in image_data:
            header, base64_str = image_data.split(',', 1)
        else:
            base64_str = image_data
            
        img_bytes = base64.b64decode(base64_str)
            
        # Run CNN prediction via the MNIST Model Service in-memory
        predicted_class, confidence, probabilities, elapsed_time = model_service.predict(img_bytes)
            
        # Check if input is blank
        if predicted_class is None:
            return jsonify({
                'status': 'error',
                'message': 'Input is blank or clear. Please provide a visible digit.'
            }), 400
            
        # Determine Top 3 Predictions
        top_3 = []
        sorted_indices = sorted(range(10), key=lambda k: probabilities[k], reverse=True)
        for i in sorted_indices[:3]:
            top_3.append({
                'digit': i,
                'probability': probabilities[i]
            })
            
        return jsonify({
            'status': 'success',
            'predicted_digit': predicted_class,
            'confidence': confidence,
            'prediction_time': elapsed_time,
            'top_3': top_3,
            'probabilities': probabilities
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Prediction engine failed: {str(e)}'
        }), 500

@api_bp.route('/model-info', methods=['GET'])
def model_info():
    """Endpoint returning status, architecture description, and performance metrics of the CNN model."""
    return jsonify({
        'status': 'success',
        'model_name': 'NeuroNine-CNN',
        'model_loaded': model_service.is_loaded,
        'dataset_loaded': model_service.dataset_loaded,
        'architecture': 'Convolutional Neural Network (CNN) - Sequential: Conv2D -> MaxPooling2D -> Conv2D -> MaxPooling2D -> Flatten -> Dense -> Dropout -> Dense',
        'dataset': 'MNIST (Modified National Institute of Standards and Technology)',
        'fallback_mode': model_service.fallback,
        'metrics': {
            'training_accuracy': model_service.accuracy,
            'test_accuracy': model_service.accuracy,
            'epochs': 3 if model_service.fallback else 3
        }
    })
