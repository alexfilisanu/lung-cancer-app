import os

import numpy as np
import pandas as pd
import tensorflow as tf
from keras.preprocessing.image import ImageDataGenerator
from keras.utils import plot_model
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from tensorflow import keras

from utils.plotting_utils import plot_accuracy, plot_loss, plot_confusion_matrix, plot_image_batch

# Define directory paths for the 2 cases
case_paths = [
    r'../dataset/images/diseased',
    r'../dataset/images/normal'
]

# Define labels for the 2 cases
case_labels = ['Diseased', 'Normal']
# Initialize lists to store file paths and labels
paths = []
labels = []

# Iterate through directories and collect file paths and labels
for label, path in zip(case_labels, case_paths):
    for filename in os.listdir(path):
        filepath = os.path.join(path, filename)
        paths.append(filepath)
        labels.append(label)

# Create a DataFrame with file paths and labels
lung_df = pd.DataFrame({'paths': paths, 'labels': labels})

# Display value counts of labels
print(lung_df["labels"].value_counts())

# Split the data into training and testing sets
train_images, test_images, train_labels, test_labels = train_test_split(lung_df['paths'], lung_df['labels'],
                                                                        test_size=0.2, random_state=42)

# Set up image data generators
image_gen = ImageDataGenerator(preprocessing_function=tf.keras.applications.mobilenet_v2.preprocess_input)
train_gen = image_gen.flow_from_dataframe(dataframe=pd.DataFrame({'paths': train_images, 'labels': train_labels}),
                                          x_col="paths", y_col="labels",
                                          target_size=(244, 244),
                                          color_mode='rgb',
                                          class_mode="categorical",
                                          batch_size=5,
                                          shuffle=True)
test_gen = image_gen.flow_from_dataframe(dataframe=pd.DataFrame({'paths': test_images, 'labels': test_labels}),
                                         x_col="paths", y_col="labels",
                                         target_size=(244, 244),
                                         color_mode='rgb',
                                         class_mode="categorical",
                                         batch_size=5,
                                         shuffle=False)

# Plotting a batch with labels
plot_image_batch(train_gen)

model = keras.models.Sequential([
    keras.layers.Conv2D(filters=128, kernel_size=(8, 8), strides=(3, 3), activation='relu', input_shape=(224, 224, 3)),
    keras.layers.BatchNormalization(),

    keras.layers.Conv2D(filters=256, kernel_size=(5, 5), strides=(1, 1), activation='relu', padding="same"),
    keras.layers.BatchNormalization(),
    keras.layers.MaxPool2D(pool_size=(3, 3)),

    keras.layers.Conv2D(filters=256, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding="same"),
    keras.layers.BatchNormalization(),
    keras.layers.Conv2D(filters=256, kernel_size=(1, 1), strides=(1, 1), activation='relu', padding="same"),
    keras.layers.BatchNormalization(),
    keras.layers.Conv2D(filters=256, kernel_size=(1, 1), strides=(1, 1), activation='relu', padding="same"),
    keras.layers.BatchNormalization(),

    keras.layers.Conv2D(filters=512, kernel_size=(3, 3), activation='relu', padding="same"),
    keras.layers.BatchNormalization(),
    keras.layers.MaxPool2D(pool_size=(2, 2)),

    keras.layers.Conv2D(filters=512, kernel_size=(3, 3), activation='relu', padding="same"),
    keras.layers.BatchNormalization(),

    keras.layers.Conv2D(filters=512, kernel_size=(3, 3), activation='relu', padding="same"),
    keras.layers.BatchNormalization(),

    keras.layers.MaxPool2D(pool_size=(2, 2)),

    keras.layers.Conv2D(filters=512, kernel_size=(3, 3), activation='relu', padding="same"),
    keras.layers.BatchNormalization(),

    keras.layers.MaxPool2D(pool_size=(2, 2)),

    keras.layers.Flatten(),
    keras.layers.Dense(1024, activation='relu'),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(1024, activation='relu'),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(2, activation='softmax')
])

model.compile(
    loss='categorical_crossentropy',
    optimizer=tf.keras.optimizers.legacy.SGD(learning_rate=0.001),
    metrics=['accuracy']
)

model.summary()
plot_model(model, to_file='model_plot.png', show_shapes=True, show_layer_names=True)

# Train the model
history = model.fit(train_gen, epochs=8, validation_data=test_gen, verbose=1)

# Plot accuracy and loss
plot_accuracy(history)
plot_loss(history)

model.save("Lung_Model.keras")

# Evaluate the model
test_loss, test_accuracy = model.evaluate(test_gen, verbose=1)
print("Accuracy of the Model:", "{:.1f}%".format(test_accuracy * 100))

# Confusion Matrix
test_predictions = model.predict(test_gen)
test_pred_labels = np.argmax(test_predictions, axis=1)
cm = confusion_matrix(test_gen.classes, test_pred_labels)

# Plot Confusion Matrix
plot_confusion_matrix(cm, case_labels)
