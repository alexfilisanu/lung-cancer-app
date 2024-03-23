import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Load the saved model
loaded_model = joblib.load("survey_lung_cancer_model.pkl")

# Prepare the test data
test_data = {
    'GENDER': ['M'],
    'AGE': [69],
    'SMOKING': ['NO'],
    'YELLOW_FINGERS': ['YES'],
    'ANXIETY': ['YES'],
    'PEER_PRESSURE': ['NO'],
    'CHRONIC_DISEASE': ['NO'],
    'FATIGUE': ['YES'],
    'ALLERGY': ['NO'],
    'WHEEZING': ['YES'],
    'ALCOHOL_CONSUMING': ['YES'],
    'COUGHING': ['YES'],
    'SHORTNESS_OF_BREATH': ['YES'],
    'SWALLOWING_DIFFICULTY': ['YES'],
    'CHEST_PAIN': ['YES']
}

# Create a DataFrame from the test data
test_df = pd.DataFrame(test_data)

# Preprocess the test data similar to how you preprocessed your training data
scaler = StandardScaler()

# Map binary categorical variables directly to 0 and 1
test_df['GENDER'] = test_df['GENDER'].map({'M': 0, 'F': 1})

# Scale numerical variables
test_df['AGE'] = scaler.fit_transform(test_df[['AGE']])

# Custom mapping for columns_to_transform
columns_to_transform = [col for col in test_df.columns if col not in ['AGE', 'GENDER']]
for col in columns_to_transform:
    test_df[col] = test_df[col].map({'YES': 1, 'NO': 0})

# Predict on the preprocessed test data
case_labels = ['No Lung Cancer', 'Lung Cancer']
predictions = loaded_model.predict(test_df)
test_pred_labels = (predictions > 0.5).astype(int)
print(case_labels[test_pred_labels[0]])
