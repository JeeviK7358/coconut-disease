
// ===============================
// COCONUT AI - SMART SCANNER
// ===============================

const cameraPreview = document.getElementById("cameraPreview");
const captureCanvas = document.getElementById("captureCanvas");

const startCameraButton = document.getElementById("startCameraButton");
const captureButton = document.getElementById("captureButton");

const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");

const cameraStatus = document.getElementById("cameraStatus");
const uploadStatus = document.getElementById("uploadStatus");

const scanButton = document.getElementById("scanButton");
const scanStatus = document.getElementById("scanStatus");

let cameraStream = null;
let selectedImage = null;
let autoScanTimer = null;
let isAnalyzing = false;
let autoScanEnabled = false;

const API_URL = "http://127.0.0.1:5000/predict";

// Initial demo threshold only.
// Validate this against real model performance before farm deployment.
const CONFIDENCE_THRESHOLD = 75;
const AUTO_SCAN_INTERVAL = 3000;


// ===============================
// UPDATE SCAN BUTTON
// ===============================

function updateScanButton() {
    scanButton.disabled = !selectedImage || isAnalyzing;

    if (selectedImage) {
        scanStatus.textContent =
            "Image ready! Click Scan Coconut Tree to analyse.";
    } else {
        scanStatus.textContent =
            "Capture a photo or upload an image to continue.";
    }
}


// ===============================
// START CAMERA
// ===============================

startCameraButton.addEventListener("click", async function () {
    try {
        if (cameraStream) {
            stopCamera();
            return;
        }

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {
            cameraStatus.textContent =
                "Camera unavailable. Open using localhost or HTTPS.";
            return;
        }

        cameraStatus.textContent =
            "Requesting camera permission...";

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        cameraPreview.srcObject = cameraStream;
        await cameraPreview.play();

        captureButton.disabled = false;

        startCameraButton.textContent = "Stop Camera";

        cameraStatus.textContent =
            "Camera active. Automatic AI monitoring started.";

        autoScanEnabled = true;

        // Begin periodic AI analysis.
        runAutomaticScan();

    } catch (error) {
        console.error("Camera error:", error);

        cameraStatus.textContent =
            "Camera access failed. Allow permission and try again.";

        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
    }
});


// ===============================
// STOP CAMERA AND AUTO SCAN
// ===============================

function stopCamera() {
    autoScanEnabled = false;

    if (autoScanTimer) {
        clearTimeout(autoScanTimer);
        autoScanTimer = null;
    }

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    cameraPreview.srcObject = null;
    captureButton.disabled = true;

    startCameraButton.textContent = "Start Camera";

    cameraStatus.textContent = "Camera stopped.";
}


// ===============================
// CAPTURE FRAME FROM CAMERA
// ===============================

function captureCameraFrame() {
    if (!cameraStream || cameraPreview.videoWidth === 0) {
        return null;
    }

    captureCanvas.width = cameraPreview.videoWidth;
    captureCanvas.height = cameraPreview.videoHeight;

    const context = captureCanvas.getContext("2d");

    context.drawImage(
        cameraPreview,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
    );

    return new Promise(resolve => {
        captureCanvas.toBlob(
            blob => resolve(blob),
            "image/jpeg",
            0.90
        );
    });
}


// ===============================
// SEND IMAGE TO FLASK AI
// ===============================

async function analyseImage(file) {
    const formData = new FormData();
    formData.append("image", file, file.name || "coconut.jpg");

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "AI prediction failed.");
    }

    if (
        typeof result.confidence !== "number" ||
        !Number.isFinite(result.confidence) ||
        !result.disease
    ) {
        throw new Error("Invalid response from AI server.");
    }

    return result;
}


// ===============================
// AUTOMATIC CAMERA SCANNING
// ===============================

async function runAutomaticScan() {
    if (!autoScanEnabled || !cameraStream) {
        return;
    }

    if (isAnalyzing) {
        autoScanTimer = setTimeout(
            runAutomaticScan,
            AUTO_SCAN_INTERVAL
        );
        return;
    }

    isAnalyzing = true;

    try {
        scanStatus.textContent =
            "AI is analysing the live camera frame...";

        const blob = await captureCameraFrame();

        if (!blob) {
            cameraStatus.textContent =
                "Waiting for camera frame...";
            return;
        }

        const frameFile = new File(
            [blob],
            "live-coconut.jpg",
            { type: "image/jpeg" }
        );

        const result = await analyseImage(frameFile);

        console.log("Automatic AI prediction:", result);

        scanStatus.textContent =
            "Detected: " + result.disease +
            " | Confidence: " + result.confidence + "%";

        if (result.confidence >= CONFIDENCE_THRESHOLD) {
            // Save the analysed frame, not a temporary preview URL.
            const imageData = await blobToDataURL(blob);

            sessionStorage.setItem(
                "coconutDisease",
                result.disease
            );

            sessionStorage.setItem(
                "coconutConfidence",
                String(result.confidence)
            );

            sessionStorage.setItem(
                "coconutImage",
                imageData
            );

            sessionStorage.setItem(
                "coconutAlertPending",
                "true"
            );

            autoScanEnabled = false;

            if (autoScanTimer) {
                clearTimeout(autoScanTimer);
                autoScanTimer = null;
            }

            window.location.href = "result.html";
            return;
        }

        cameraStatus.textContent =
            "Monitoring... Prediction is below the demo threshold.";

    } catch (error) {
        console.error("Automatic scan error:", error);

        scanStatus.textContent = error.message;
    } finally {
        isAnalyzing = false;

        if (autoScanEnabled && cameraStream) {
            autoScanTimer = setTimeout(
                runAutomaticScan,
                AUTO_SCAN_INTERVAL
            );
        }
    }
}


// ===============================
// BLOB TO DATA URL
// ===============================

function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(
            new Error("Could not save captured image.")
        );

        reader.readAsDataURL(blob);
    });
}


// ===============================
// MANUAL CAPTURE PHOTO
// ===============================

captureButton.addEventListener("click", async function () {
    const blob = await captureCameraFrame();

    if (!blob) {
        cameraStatus.textContent =
            "Camera is not ready. Please wait and try again.";
        return;
    }

    selectedImage = new File(
        [blob],
        "coconut-capture.jpg",
        { type: "image/jpeg" }
    );

    imagePreview.src = await blobToDataURL(blob);
    imagePreview.style.display = "block";

    uploadStatus.textContent =
        "Camera photo captured successfully!";

    updateScanButton();
});


// ===============================
// UPLOAD IMAGE
// ===============================

imageUpload.addEventListener("change", function () {
    const file = imageUpload.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        uploadStatus.textContent =
            "Please select a valid image.";

        return;
    }

    selectedImage = file;

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";

    uploadStatus.textContent =
        "Image uploaded: " + file.name;

    updateScanButton();
});


// ===============================
// MANUAL SCAN BUTTON
// ===============================

scanButton.addEventListener("click", async function () {
    if (!selectedImage || isAnalyzing) {
        return;
    }

    isAnalyzing = true;
    scanButton.disabled = true;

    scanStatus.textContent =
        "Analysing image with Coconut AI...";

    try {
        const result = await analyseImage(selectedImage);

        console.log("Manual AI prediction:", result);

        const imageData = await blobToDataURL(selectedImage);

        sessionStorage.setItem(
            "coconutDisease",
            result.disease
        );

        sessionStorage.setItem(
            "coconutConfidence",
            String(result.confidence)
        );

        sessionStorage.setItem(
            "coconutImage",
            imageData
        );

        sessionStorage.setItem(
            "coconutAlertPending",
            "true"
        );

        window.location.href = "result.html";

    } catch (error) {
        console.error("Manual prediction error:", error);

        scanStatus.textContent = error.message;

    } finally {
        isAnalyzing = false;
        scanButton.disabled = !selectedImage;
    }
});


// ===============================
// STOP CAMERA WHEN LEAVING PAGE
// ===============================

window.addEventListener("beforeunload", function () {
    autoScanEnabled = false;

    if (autoScanTimer) {
        clearTimeout(autoScanTimer);
    }

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
});


