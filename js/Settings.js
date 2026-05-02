document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    setupEvents();
    hideSplash();
});

function hideSplash() {
    const splashScreen = document.getElementById("splash-screen");

    if (!splashScreen) return;

    setTimeout(() => {
        splashScreen.classList.add("hidden");

        setTimeout(() => {
            splashScreen.style.display = "none";
        }, 600);
    }, 900);
}

function getUser() {
    return JSON.parse(sessionStorage.getItem("user")) || {
        username: "user",
        email: "user@taathith.com"
    };
}

function loadSettings() {
    const user = getUser();
    const settings = JSON.parse(localStorage.getItem("userSettings")) || {};

    const username = user.username || settings.username || "user";

    document.getElementById("welcome-name").textContent = `Welcome, ${username}`;
    document.getElementById("user-avatar").textContent = username.charAt(0).toUpperCase();

    document.getElementById("username").value = settings.username || user.username || "";
    document.getElementById("email").value = settings.email || user.email || "";
    document.getElementById("phone").value = settings.phone || "";
    document.getElementById("address").value = settings.address || "";

    document.getElementById("room-type").value = settings.roomType || "";
    document.getElementById("style-type").value = settings.styleType || "";
}

function setupEvents() {
    const settingsForm = document.getElementById("settings-form");
    const savePreferencesBtn = document.getElementById("save-preferences");
    const clearDataBtn = document.getElementById("clear-data");
    const logoutBtn = document.getElementById("logout-button");

    settingsForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const settings = JSON.parse(localStorage.getItem("userSettings")) || {};

        settings.username = document.getElementById("username").value.trim();
        settings.email = document.getElementById("email").value.trim();
        settings.phone = document.getElementById("phone").value.trim();
        settings.address = document.getElementById("address").value.trim();
        settings.roomType = document.getElementById("room-type").value;
        settings.styleType = document.getElementById("style-type").value;

        localStorage.setItem("userSettings", JSON.stringify(settings));
        sessionStorage.setItem("username", settings.username);

        const user = getUser();
        user.username = settings.username;
        user.email = settings.email;
        sessionStorage.setItem("user", JSON.stringify(user));

        alert("Settings saved successfully.");
        loadSettings();
    });

    savePreferencesBtn.addEventListener("click", () => {
        const settings = JSON.parse(localStorage.getItem("userSettings")) || {};

        settings.roomType = document.getElementById("room-type").value;
        settings.styleType = document.getElementById("style-type").value;

        localStorage.setItem("userSettings", JSON.stringify(settings));

        alert("Preferences saved successfully.");
    });

    clearDataBtn.addEventListener("click", () => {
        const confirmClear = confirm("Are you sure you want to clear your cart, favourites, and settings?");

        if (!confirmClear) return;

        localStorage.removeItem("cart");
        localStorage.removeItem("favourites");
        localStorage.removeItem("selectedFurniture");
        localStorage.removeItem("userSettings");

        alert("Your local data has been cleared.");
        loadSettings();
    });

    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (!confirmLogout) return;

        sessionStorage.clear();
        window.location.href = "login.html";
    });
}