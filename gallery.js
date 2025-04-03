document.addEventListener("DOMContentLoaded", function () {
    // Select all img in slider track
    const images = document.querySelectorAll(".slider-track img");

    const track = document.querySelector(".slider-track");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.querySelector("nav");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupTitle = document.getElementById("popupTitle");
    const popupDescription = document.getElementById("popupDescription");
    const closePopup = document.getElementById("closePopup");

    let isPaused = false;
    let isDragging = false;
    let startX, scrollLeft;
    let scrollSpeed = 0.5; 

    // Open popup with  image
    images.forEach(img => {
        img.addEventListener("click", function () {
            const title = img.getAttribute("data-title") || "Untitled";
            const description = img.getAttribute("data-description") || "No description";

            popupImg.src = img.src;
            popupTitle.textContent = title;
            popupDescription.textContent = description;
            popup.classList.add("active");
        });
    });

    //  close popup
    if (closePopup) {
        closePopup.addEventListener("click", function () {
            popup.classList.remove("active");
        });
    }

    // close Popup when clicking outside image
    if (popup) {
        popup.addEventListener("click", function (event) {
            if (event.target === popup) {
                popup.classList.remove("active");
            }
        });
    }

    // mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
            menuToggle.classList.toggle("active");
            menuToggle.innerHTML = navMenu.classList.contains("active") ? "⛒" : "☰";
        });

        document.addEventListener("click", function (event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.innerHTML = "☰";
            }
        });
    }

    // auto-scroll and custom Scroll 
    if (track) {
        // stop auto-scroll animation on hover
        track.addEventListener("mouseenter", () => {
            isPaused = true;
            track.style.animationPlayState = "paused";
        });

        track.addEventListener("mouseleave", () => {
            if (!isDragging) {
                isPaused = false;
                track.style.animationPlayState = "running";
            }
        });

        // user-controlled scrolling 
        track.addEventListener("mousedown", (e) => {
            isDragging = true;
            isPaused = true;
            track.style.animationPlayState = "paused";

            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            track.style.cursor = "grabbing";
        });

        track.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; 
            track.scrollLeft = scrollLeft - walk;
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            track.style.cursor = "grab";
            setTimeout(() => {
                if (!isDragging) {
                    isPaused = false;
                    track.style.animationPlayState = "running";
                }
            }, 1000);
        });

        track.addEventListener("mouseleave", () => {
            isDragging = false;
            track.style.cursor = "grab";
        });

        // infinite Loop 
        function cloneImages() {
            const firstSet = track.innerHTML;
            track.innerHTML += firstSet; 
        }

        cloneImages(); 

        //  reset for infinite Loop
        function checkScroll() {
            const halfWidth = track.scrollWidth / 2;
            if (track.scrollLeft >= halfWidth) {
                track.scrollLeft -= halfWidth; 
            }
        }

        // auto-scroll
        function autoScroll() {
            if (!isPaused && !isDragging) {
                track.scrollLeft += scrollSpeed;
                checkScroll();
            }
            requestAnimationFrame(autoScroll);
        }

        autoScroll(); 
    }
});
