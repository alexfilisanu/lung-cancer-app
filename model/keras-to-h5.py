from keras.models import load_model

model = load_model('./Lung_Model.keras')
model.save('./Lung_Model.h5')
