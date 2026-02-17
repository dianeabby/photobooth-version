document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("webcam");
    const captureBtn = document.getElementById("capture-btn");
    const countdownDisplay = document.getElementById("countdown");
    const flashEffect = document.getElementById("flash"); // Use the flash div inside the camera-frame


    
    let photosTaken = 0;
    let photoData = [];

    // Request Camera Permission After Page Load
    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                captureBtn.disabled = false;
                captureBtn.style.opacity = "1";
                captureBtn.style.cursor = "pointer";
            })
            .catch(error => {
                // Disable the capture button
                captureBtn.disabled = true;
                captureBtn.style.opacity = "0.4";
                captureBtn.style.cursor = "not-allowed";

                // Show a message on the page
                const errorMessage = document.createElement("p");
                errorMessage.innerText = "⚠️ Please allow camera access to take photos.";
                errorMessage.style.color = "red";
                errorMessage.style.fontWeight = "bold";
                errorMessage.style.marginTop = "20px";
                document.querySelector(".photobooth-camera").appendChild(errorMessage);

                console.error("Camera access denied or unavailable:", error);
            });
    }


    // Start camera when user reaches the page
    startCamera();

    // Capture 3 Photos with Countdown
    captureBtn.addEventListener("click", () => {
        takePhotoWithCountdown(3); // Start first countdown
    });

    function takePhotoWithCountdown(remainingPhotos) {
        if (remainingPhotos === 0) {
            // Ensure photos are stored before navigation
            setTimeout(() => {
                if (photoData.length === 3) { // Make sure all 3 photos are saved
                    localStorage.setItem("photoStrip", JSON.stringify(photoData));
                    window.location.href = "photostrip.html";
                } else {
                    alert("Error: Not all photos were captured. Please try again.");
                }
            }, 1500);
            return;
        }

        let countdown = 3;
        countdownDisplay.style.display = "block";
        countdownDisplay.innerText = countdown;

        let countdownInterval = setInterval(() => {
            countdown--;
            countdownDisplay.innerText = countdown;

            if (countdown === 0) {
                clearInterval(countdownInterval);
                countdownDisplay.style.display = "none";

                triggerFlash(); // Trigger flash effect

                // Capture photo
                setTimeout(() => {
                    capturePhoto();
                    takePhotoWithCountdown(remainingPhotos - 1);
                }, 500); // Small delay to match flash timing
            }
        }, 1000);
    }

    // Capture and Store Photo
    function capturePhoto() {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");

        photoData.push(imageData);
    }

    // Flash Effect
    function triggerFlash() {
        flashEffect.style.opacity = "1"; // Show flash
        setTimeout(() => {
            flashEffect.style.opacity = "0"; // Fade out flash
        }, 100); // 100ms duration for realistic flash effect
    }
});
