import joblib
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from models.utils.plotting_utils import plot_age_distribution_by_gender, plot_lung_cancer_prevalence_by_gender, \
    plot_confusion_matrix

# Load data
df = pd.read_csv("../../dataset/survey-lung-cancer/survey-lung-cancer.csv")

# Visualize the data
plot_age_distribution_by_gender(df, 'plots')
plot_lung_cancer_prevalence_by_gender(df, 'plots')

# Preprocessing
scaler = StandardScaler()

# Map binary categorical variables directly to 0 and 1
df['GENDER'] = df['GENDER'].map({'M': 0, 'F': 1})
df['LUNG_CANCER'] = df['LUNG_CANCER'].map({'NO': 0, 'YES': 1})

# Scale numerical variables
df['AGE'] = scaler.fit_transform(df[['AGE']])

# Custom mapping for columns_to_transform
columns_to_transform = [col for col in df.columns if col not in ['AGE', 'GENDER', 'LUNG_CANCER']]
for col in columns_to_transform:
    df[col] = df[col].map({2: 1, 1: 0})

# Balance class distribution using SMOTE
X, Y = SMOTE().fit_resample(df.drop(columns=['LUNG_CANCER']), df['LUNG_CANCER'])

# Train-test split
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# Logistic Regression Model
logistic_model = LogisticRegression()

# Train the model
logistic_model.fit(X_train, Y_train)

# Save the model
joblib.dump(logistic_model, "survey_lung_cancer_model.pkl")

# Evaluate the model on test data
Y_pred = logistic_model.predict(X_test)
test_accuracy = accuracy_score(Y_test, Y_pred)
print("Accuracy of the Model:", "{:.1f}%".format(test_accuracy * 100))

# Confusion Matrix
cm = confusion_matrix(Y_test, Y_pred)

# Plot confusion matrix
plot_confusion_matrix(cm, ['No Lung Cancer', 'Lung Cancer'], save_path="plots")
