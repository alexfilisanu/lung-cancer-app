import os
import numpy as np
import pandas as pd
import tensorflow as tf
from keras.preprocessing.image import ImageDataGenerator
from keras.utils import plot_model
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input, BatchNormalization
from tensorflow.keras.models import Model
from models.utils.plotting_utils import plot_confusion_matrix, plot_loss, plot_accuracy, plot_image_batch

# Define directory paths for the 3 cases
case_paths = [
    r'../../dataset/CT-lung-cancer/benign',
    r'../../dataset/CT-lung-cancer/malignant',
    r'../../dataset/CT-lung-cancer/normal'
]

# Define labels for the 3 cases
case_labels = ['benign', 'malignant', 'normal']

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
image_gen = ImageDataGenerator(preprocessing_function=tf.keras.applications.imagenet_utils.preprocess_input)
train_gen = image_gen.flow_from_dataframe(dataframe=pd.DataFrame({'paths': train_images, 'labels': train_labels}),
                                          x_col="paths", y_col="labels",
                                          target_size=(227, 227),
                                          color_mode='rgb',
                                          class_mode="categorical",
                                          batch_size=16,
                                          shuffle=True)
test_gen = image_gen.flow_from_dataframe(dataframe=pd.DataFrame({'paths': test_images, 'labels': test_labels}),
                                         x_col="paths", y_col="labels",
                                         target_size=(227, 227),
                                         color_mode='rgb',
                                         class_mode="categorical",
                                         batch_size=16,
                                         shuffle=False)

# Plotting a batch with labels
plot_image_batch(train_gen, save_path="plots")


# Define the AlexNet architecture
def create_alexnet_model(input_shape=(227, 227, 3), num_classes=3):
    inputs = Input(shape=input_shape)

    # First convolutional layer
    x = Conv2D(96, (11, 11), strides=4, activation='relu')(inputs)
    x = MaxPooling2D((3, 3), strides=2)(x)
    x = BatchNormalization()(x)

    # Second convolutional layer
    x = Conv2D(256, (5, 5), padding='same', activation='relu')(x)
    x = MaxPooling2D((3, 3), strides=2)(x)
    x = BatchNormalization()(x)

    # Third, fourth, and fifth convolutional layers
    x = Conv2D(384, (3, 3), padding='same', activation='relu')(x)
    x = Conv2D(384, (3, 3), padding='same', activation='relu')(x)
    x = Conv2D(256, (3, 3), padding='same', activation='relu')(x)
    x = MaxPooling2D((3, 3), strides=2)(x)
    x = BatchNormalization()(x)

    # Flatten and fully connected layers
    x = Flatten()(x)
    x = Dense(4096, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(4096, activation='relu')(x)
    x = Dropout(0.5)(x)
    outputs = Dense(num_classes, activation='softmax')(x)

    return Model(inputs, outputs)


# Create the AlexNet model
model = create_alexnet_model()

# Compile the model
model.compile(
    loss='categorical_crossentropy',
    optimizer=tf.keras.optimizers.legacy.SGD(learning_rate=0.001),
    metrics=['accuracy']
)

model.summary()
plot_model(model, to_file='plots/model_plot.png', show_shapes=True, show_layer_names=True)

# Train the model
history = model.fit(train_gen, epochs=10, validation_data=test_gen, verbose=1)

# Plot accuracy and loss
plot_accuracy(history, save_path="plots")
plot_loss(history, save_path="plots")

model.save("CT_lung_cancer_model_alexnet.keras")

# Evaluate the model
test_loss, test_accuracy = model.evaluate(test_gen, verbose=1)
print("Accuracy of the Model:", "{:.1f}%".format(test_accuracy * 100))

# Confusion Matrix
test_predictions = model.predict(test_gen)
test_pred_labels = np.argmax(test_predictions, axis=1)
cm = confusion_matrix(test_gen.classes, test_pred_labels)

# Plot Confusion Matrix
plot_confusion_matrix(cm, case_labels, save_path="plots")
