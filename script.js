// ==============================
// GET HTML ELEMENTS
// ==============================

const startButton = document.getElementById("startButton");

const homeButton = document.getElementById("homeButton");

const languageSelect = document.getElementById("languageSelect");


// ==============================
// HOME BUTTON EFFECT
// ==============================

homeButton.addEventListener("click", function () {

    homeButton.classList.remove("blink");

    void homeButton.offsetWidth;

    homeButton.classList.add("blink");

});


// ==============================
// START SCANNING
// =============================


startButton.addEventListener("click", function () {

    startButton.classList.add("blink");

    setTimeout(function () {

        window.location.href = "scanning.html";

    }, 350);

});





// ==============================
// LANGUAGE SETTING
// ==============================

languageSelect.addEventListener("change", function () {

    const selectedLanguage = languageSelect.value;

    if (selectedLanguage === "ta") {

        alert("தமிழ் மொழி விரைவில் முழுமையாக இணைக்கப்படும்.");

    }

    if (selectedLanguage === "en") {

        alert("English selected.");

    }

});