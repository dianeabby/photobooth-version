document.addEventListener("DOMContentLoaded", function () {
    const photostrip = document.getElementById("falling-photostrip");
    const saveBtn = document.getElementById("saveBtn");
    const retakeBtn = document.getElementById("retakeBtn");
    const colorButtons = document.querySelectorAll(".color-btn");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Get stored images
    const photos = JSON.parse(localStorage.getItem("photoStrip"));

    const customTextInput = document.getElementById("custom-text");
    const textElement = document.createElement("p");
    textElement.classList.add("photostrip-text");
    photostrip.appendChild(textElement);

    // Always start with empty text
    customTextInput.value = "";
    textElement.innerText = "";
    localStorage.removeItem("customText");

    // Update preview text live
    customTextInput.addEventListener("input", () => {
        const text = customTextInput.value;
        textElement.innerText = text;
        localStorage.setItem("customText", text);
    });

    // Load photos
    if (photos) {
        photos.forEach(photo => {
            const img = document.createElement("img");
            img.src = photo;
            img.classList.add("photostrip-image");
            photostrip.appendChild(img);
        });
    }

    // Get selected color
    function getSelectedColor() {
        const selectedButton = document.querySelector(".color-btn.selected");
        return selectedButton ? window.getComputedStyle(selectedButton).backgroundColor : "white";
    }

    // Get selected filter
    function getSelectedFilter() {
        const selectedFilter = document.querySelector(".filter-btn.selected");
        return selectedFilter ? selectedFilter.getAttribute("data-filter") : "none";
    }

    // Get custom text (from input)
    function getCustomText() {
        return customTextInput.value.trim();
    }

    // Apply filter
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("selected"));
            const selectedFilter = button.getAttribute("data-filter");

            document.querySelectorAll(".photostrip-image").forEach(img => {
                img.style.filter = selectedFilter;
            });

            button.classList.add("selected");
        });
    });

    // Change frame color and text color accordingly
    colorButtons.forEach(button => {
        button.addEventListener("click", () => {
            colorButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");

            const selectedColor = window.getComputedStyle(button).backgroundColor;
            photostrip.style.backgroundColor = selectedColor;

            const isBlack = selectedColor === "rgb(0, 0, 0)" || selectedColor.toLowerCase() === "black";
            textElement.style.color = isBlack ? "white" : "black";
        });
    });

    // Retake button
    retakeBtn.addEventListener("click", () => {
        window.location.href = "camera.html";
    });

    // Save photostrip as image
    saveBtn.addEventListener("click", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const photoWidth = 320;
        const photoHeight = 250;
        const borderSize = 20;
        const extraBottomSpace = 100;

        const selectedColor = getSelectedColor();
        const selectedFilter = getSelectedFilter();
        const userText = getCustomText();

        canvas.width = photoWidth + borderSize * 2;
        canvas.height = (photoHeight * photos.length) + (borderSize * (photos.length + 1)) + extraBottomSpace;

        // Fill full canvas with frame color
        ctx.fillStyle = selectedColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let loadedImages = 0;

        photos.forEach((photo, index) => {
            const img = new Image();
            img.src = photo;
            img.onload = () => {
                ctx.filter = selectedFilter;
                ctx.drawImage(
                    img,
                    borderSize,
                    borderSize + index * (photoHeight + borderSize),
                    photoWidth,
                    photoHeight
                );

                loadedImages++;
                if (loadedImages === photos.length) {
                    // Bottom part of photostrip
                    ctx.filter = "none";
                    ctx.fillStyle = selectedColor;
                    ctx.fillRect(
                        0,
                        canvas.height - extraBottomSpace,
                        canvas.width,
                        extraBottomSpace
                    );

                    // Draw custom text only if not empty
                    if (userText !== "") {
                        const isBlack = selectedColor === "rgb(0, 0, 0)" || selectedColor.toLowerCase() === "black";
                        ctx.fillStyle = isBlack ? "white" : "black";
                        ctx.font = "bold 35px Caveat, sans-serif";
                        ctx.textAlign = "center";
                        ctx.fillText(userText, canvas.width / 2, canvas.height - extraBottomSpace / 2);
                    }

                    setTimeout(() => {
                        const link = document.createElement("a");
                        link.href = canvas.toDataURL("image/png");
                        link.download = "photostrip.png";
                        link.click();
                    }, 500);
                }
            };
        });
    });
});
