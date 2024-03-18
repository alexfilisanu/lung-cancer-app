import numpy as np
import tensorflow as tf
from keras.preprocessing import image

# Load the saved models
loaded_model = tf.keras.models.load_model("CT_lung_cancer_model.keras")
case_labels = ['benign', 'malignant', 'normal']


# Function to preprocess the image
def preprocess_image(image_path, target_size=(224, 224)):
    img = image.load_img(image_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return tf.keras.applications.mobilenet_v2.preprocess_input(img_array)


# Function to predict the class of the image
def predict_image_class(image_path):
    preprocessed_img = preprocess_image(image_path)
    prediction = loaded_model.predict(preprocessed_img)
    print(prediction)
    predicted_class_index = np.argmax(prediction, axis=1)[0]
    return case_labels[predicted_class_index]


# Example usage:
image_path = '../../dataset/CT-lung-cancer/malignant/malignant-CT-187.jpg'
predicted_class = predict_image_class(image_path)
print("Predicted Class:", predicted_class)
