from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load your trained model
model = tf.keras.models.load_model("food7_model.h5")

# Class labels in the same order used during training
class_names = ['donuts', 'omelette', 'pizza', 'ramen', 'steak', 'waffles', 'ice_cream']

def preprocess_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).resize((128, 128)).convert('RGB')
    img = np.array(img) / 255.0
    return np.expand_dims(img, axis=0)

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files['image']
    image_data = file.read()
    processed = preprocess_image(image_data)
    predictions = model.predict(processed)[0]
    class_index = np.argmax(predictions)
    confidence = float(predictions[class_index])
    return jsonify({
        "class": class_names[class_index],
        "confidence": round(confidence, 3)
    })

if __name__ == "__main__":
    app.run(debug=True)
