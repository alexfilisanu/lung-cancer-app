import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app, origins=['http://127.0.0.1:4200'])


def predict_lung_cancer(data):
    model = joblib.load("survey_lung_cancer_model.pkl")
    df = pd.DataFrame(data)
    scaler = StandardScaler()
    df['AGE'] = scaler.fit_transform(df[['AGE']])

    predictions = model.predict(df)
    prediction_result = (predictions > 0.5).astype(int)

    return prediction_result


def preprocess_data(data):
    return {
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


@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    data = preprocess_data(request.json)
    predictions = predict_lung_cancer(data)
    case_labels = ['No Lung Cancer', 'Lung Cancer']
    prediction_label = case_labels[predictions[0]]
    return jsonify({'prediction': prediction_label})


if __name__ == '__main__':
    app.run(debug=True, port=3100)
