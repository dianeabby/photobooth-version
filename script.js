document.addEventListener("DOMContentLoaded", function () {
    const coinSlot = document.getElementById("coin-slot");
    const curtain = document.getElementById("curtain");
    const coin = document.getElementById("coin");

    // Insert Coin and Open Curtain
    coinSlot.addEventListener("click", () => {
        // Step 1: Animate the coin moving into the slot
        coin.classList.add("insertCoin");

        // Step 2: Hide the coin completely after insertion animation
        setTimeout(() => {
            coin.style.display = "none";
        }, 800); // Coin disappears after 0.8s

        // Step 3: Move the curtain to the right after the coin is inserted
        setTimeout(() => {
            curtain.classList.add("openCurtain");
        }, 1000); // Curtain moves after 1s

        // Step 4: Delay page navigation until animations are done
        setTimeout(() => {
            window.location.href = "camera.html"; // Redirect to camera page
        }, 3000); // Redirects after 3 seconds
    });
});
