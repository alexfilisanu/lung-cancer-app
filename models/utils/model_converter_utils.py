from keras.models import load_model


def keras_to_h5(keras_model_path, h5_model_path):
    model = load_model(keras_model_path)
    model.save(h5_model_path)
