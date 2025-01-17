import os

import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.preprocessing import image
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

script_dir = os.path.dirname(__file__)
survey_model_path = os.path.join(script_dir, "survey-lung-cancer-detector", "survey_lung_cancer_model.pkl")
survey_model = joblib.load(survey_model_path)
CT_model_path = os.path.join(script_dir, "CT-lung-cancer-detector", "CT_lung_cancer_model_alexnet.keras")
CT_model = tf.keras.models.load_model(CT_model_path)

survey_case_labels = ['no-cancer', 'cancer']
CT_case_labels = ['benign', 'malignant', 'normal']


def survey_preprocess_data(data):
    transformed_data = {
        'GENDER': [data['gender']],
        'AGE': [float(data['age'])],
        'SMOKING': [data['yellowFingers']],
        'YELLOW_FINGERS': [data['yellowFingers']],
        'ANXIETY': [data['anxiety']],
        'PEER_PRESSURE': [data['peerPressure']],
        'CHRONIC_DISEASE': [data['chronicDisease']],
        'FATIGUE': [data['fatigue']],
        'ALLERGY': [data['allergy']],
        'WHEEZING': [data['wheezing']],
        'ALCOHOL_CONSUMING': [data['alcoholConsumption']],
        'COUGHING': [data['coughing']],
        'SHORTNESS_OF_BREATH': [data['shortnessOfBreath']],
        'SWALLOWING_DIFFICULTY': [data['swallowingDifficulty']],
        'CHEST_PAIN': [data['chestPain']]
    }

    df = pd.DataFrame(transformed_data)
    scaler = StandardScaler()
    df['AGE'] = scaler.fit_transform(df[['AGE']])

    return df


@app.route('/survey-predict', methods=['POST'])
def survey_predict():
    df = survey_preprocess_data(request.json)
    predictions = survey_model.predict(df)
    prediction_result = (predictions > 0.5).astype(int)
    prediction_label = survey_case_labels[prediction_result[0]]

    return jsonify({'prediction': prediction_label})


def preprocess_image(file):
    img = Image.open(file).convert('RGB')
    img_resize = img.resize((227, 227))
    img_array = image.img_to_array(img_resize)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array.astype('float32')

    # Subtract ImageNet mean for AlexNet preprocessing
    mean = np.array([123.68, 116.779, 103.939], dtype=np.float32)
    preprocessed_img = img_array - mean

    return preprocessed_img


@app.route('/CT-predict', methods=['POST'])
def ct_predict():
    image_file = request.files['image']
    preprocessed_img = preprocess_image(image_file)
    prediction = CT_model.predict(preprocessed_img)
    prediction_result = np.argmax(prediction, axis=1)[0]
    prediction_label = CT_case_labels[prediction_result]

    return jsonify({'prediction': prediction_label})


if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')
