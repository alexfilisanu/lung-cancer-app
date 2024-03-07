import numpy as np
import seaborn as sns
from matplotlib import pyplot as plt


def plot_accuracy(history):
    plt.plot(history.history['accuracy'])
    plt.plot(history.history['val_accuracy'])
    plt.title('Model accuracy')
    plt.ylabel('Accuracy')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper left')
    plt.show()


def plot_loss(history):
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title('Model loss')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper left')
    plt.show()


def plot_confusion_matrix(cm, case_labels):
    plt.figure(figsize=(8, 8))
    sns.heatmap(cm, annot=True, fmt='g', cmap='Blues', cbar=False)
    num_labels = len(case_labels)
    plt.xticks(ticks=np.arange(num_labels) + 0.5, labels=case_labels)
    plt.yticks(ticks=np.arange(num_labels) + 0.5, labels=case_labels)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.show()


def plot_image_batch(generator):
    label_map = {v: k for k, v in generator.class_indices.items()}  # Get mapping from numerical labels to string labels
    images, labels = next(generator)  # Get images and labels for one batch
    batch_size = len(images)
    num_rows = (batch_size + 3) // 4  # Calculate number of rows needed for 5 images per row
    plt.figure(figsize=(20, 4 * num_rows))  # Adjust figure size
    for i in range(batch_size):
        img = images[i]  # Get the image from the batch
        img = (img - img.min()) / (img.max() - img.min())  # Normalize pixel values
        plt.subplot(num_rows, 4, i + 1)  # Adjust subplot layout
        plt.imshow(img)
        plt.title(label_map[labels[i].argmax()])  # Use label encoder to get the string label
        plt.axis('off')
    plt.tight_layout()  # Adjust layout to prevent overlap
    plt.show()