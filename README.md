coconut-disease

# CocoGuard – AI-Based Coconut Leaf Disease Detection System

## 1. Project Overview

CocoGuard is an AI-based web application designed to help coconut farmers identify possible diseases affecting coconut leaves. The main objective of this project is to make coconut disease detection easier and faster using Artificial Intelligence (AI), Machine Learning (ML), and image processing techniques.

The system allows users to capture or upload a coconut leaf image through a web interface. The image is sent to a Python-based backend, where a trained deep learning model analyzes it and predicts the possible disease along with a confidence score. The project also includes a separate leaf validation model intended to distinguish coconut leaves from other plant leaves and unrelated images.

CocoGuard aims to provide an accessible digital solution that can support farmers in identifying potential coconut leaf diseases and making informed decisions about further inspection and treatment.

## 2. Objectives

The primary objectives of CocoGuard are:

* To develop an AI-based coconut leaf disease detection system.
* To identify possible diseases from images of coconut leaves.
* To display the predicted disease and its confidence score.
* To validate input images before performing disease prediction.
* To provide a simple and user-friendly web interface.
* To display scanning results and related alerts.
* To explore SMS notifications for communicating important disease alerts to farmers.

## 3. Technologies Used

**Frontend:**

* HTML – Creates the structure of the web pages.
* CSS – Styles the interface and improves its visual appearance.
* JavaScript – Handles image selection, scanning interactions, API requests, and navigation between pages.

**Backend:**

* Python – Implements the backend logic and connects the web interface to the AI models.
* Flask – Provides API endpoints for image prediction.
* Flask-CORS – Enables communication between the frontend and backend running on different local origins.

**Artificial Intelligence and Machine Learning:**

* TensorFlow and Keras – Used to train and load deep learning models.
* MobileNetV2 – Used as the pretrained base architecture for the coconut leaf validation model.
* Image preprocessing – Resizes images and prepares them for model inference.

**Development Environment:**

* Visual Studio Code
* Windows operating system
* Python terminal for running and testing the application

## 4. Coconut Disease Classification Model

A trained deep learning model named `coconut_disease_model.keras` is used for coconut disease prediction. The model is stored in the `coconut-ai-model` directory and loaded by the Python backend.

The model is configured to classify images into the following five disease categories:

1. Bud Root Dropping
2. Bud Rot
3. Gray Leaf Spot
4. Leaf Rot
5. Stem Bleeding

When an image is submitted for prediction, the backend processes the image, resizes it to 224 × 224 pixels, converts it to RGB format, and passes it to the disease classification model. The model produces a prediction, which is converted into a disease label and confidence percentage.

The backend returns the prediction information to the frontend in JSON format.

## 5. Coconut Leaf Validation Model

A separate validation model, `coconut_leaf_validator.keras`, has been developed to check whether an input image resembles a coconut leaf before disease classification.

The validation model uses MobileNetV2 with pretrained ImageNet weights as its feature extraction base. A custom classification head was added to identify three classes:

* `coconut_leaf` – Images labeled as coconut leaves.
* `other_leaf` – Images of other types of leaves.
* `not_leaf` – Images that do not belong to the leaf category.

The model was trained using the existing image dataset stored in the `dataset/image_check` directory. Data augmentation techniques, including horizontal flipping, rotation, zoom, and small image shifts, were applied to help the model learn variations in the training images.

Class weights were also used to address differences in the number of training images across classes.

During training, the model achieved 100% training accuracy in its final epoch and 81.25% validation accuracy. However, the validation dataset contained only 16 images, so these figures do not establish reliable performance on new, real-world images. Further testing and a larger, representative dataset are required to evaluate its accuracy and reliability.

The validation model and its class mapping are saved as `coconut_leaf_validator.keras` and `leaf_validator_classes.json`.

## 6. System Architecture and Workflow

The CocoGuard application follows a frontend-backend architecture.

**Step 1: Image Input**

The user opens the scanning page and selects or captures an image for analysis.

**Step 2: Image Validation**

The image is submitted to the backend, where the coconut leaf validation model checks whether it belongs to the accepted input category. The intended behavior is to reject unrelated images and display the following message:

“This is not a coconut tree leaf. Please show a coconut tree leaf.”

**Step 3: Disease Prediction**

If the image passes validation, it is processed by the coconut disease classification model to predict one of the supported disease categories.

**Step 4: API Response**

The backend returns the predicted disease, confidence percentage, and a related message through the `/predict` API endpoint.

**Step 5: Result Display**

The frontend receives the response and displays the prediction on the result page. Session storage is used to transfer information such as the uploaded image, predicted disease, and confidence score between pages.

**Step 6: Alerts**

The project includes an alert page intended to present relevant information to users. SMS notifications to farmers are a planned extension and require integration with an SMS service provider.

## 7. Frontend Pages

The project includes the following main web pages and scripts:

* `index.html` – Main entry page of the website.
* `scanning.html` – Interface for scanning or submitting leaf images.
* `result.html` – Page intended to display the prediction result.
* `alert.html` – Page intended for displaying alerts.
* `style.css` – Common styling for the website.
* `script.js` – JavaScript functionality for the main interface.
* `scanning.js` – Handles scanning, image submission, API communication, and prediction-related interactions.

The scanning interface communicates with the backend using the local API address `http://127.0.0.1:5000/predict`. The backend is started by running `python app.py` from the `coconut-ai-model` directory.

## 8. Current Development Status

The following components have been developed:

* A frontend structure for the CocoGuard website.
* A Flask backend with an image prediction endpoint.
* A trained coconut disease classification model.
* A separate coconut leaf validation model.
* Image preprocessing and model inference logic.
* Frontend API requests for image prediction.
* Session storage for transferring prediction results between pages.
* A training script for the leaf validation model.

The leaf validation model has been trained and saved successfully. However, its ability to distinguish coconut leaves from other leaves and unrelated images still requires further testing. The complete image rejection workflow and its user-facing messages also need to be verified in the running application.

The result and alert pages have been created, but the entire user journey should be tested to ensure all pages and features work together correctly. Automatic SMS notifications have not yet been fully integrated with an external messaging service.

## 9. Future Enhancements

Future improvements may include:

* Increasing the size and diversity of the training dataset.
* Improving leaf validation accuracy and evaluating performance on unseen images.
* Testing the disease classification model under different lighting and background conditions.
* Improving error handling and user feedback.
* Displaying disease descriptions and recommended next steps.
* Integrating an SMS gateway to notify farmers when relevant alerts are generated.
* Testing the application on mobile devices.
* Deploying the website and backend to an accessible hosting platform.

## 10. Conclusion

CocoGuard is a developing AI-based coconut leaf disease detection project that combines a web interface, a Python backend, and deep learning models. It is designed to accept coconut leaf images, validate the input, predict possible disease categories, and display results to users.

The project establishes a foundation for applying AI to coconut crop monitoring. Additional dataset development, model evaluation, application testing, and integration work are necessary before the system can be considered reliable for practical agricultural use.
