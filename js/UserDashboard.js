document.addEventListener("DOMContentLoaded", () => {
    displayLoggedInUser();
    loadFurniture();
});

// ================== FURNITURE DATA ==================
const furnitureItems = [
    {
        id: "1",
        title: "Modern Sofa",
        description: "Comfortable 3-seat sofa for living rooms.",
        madeBy: "Taathith Furniture",
        measurement: "220cm x 90cm",
        price: "BD 120",
        image: "../assets/white-couch.jpg"
    },
    {
        id: "2",
        title: "Office Desk",
        description: "Wooden office desk suitable for home offices.",
        madeBy: "Taathith Office",
        measurement: "140cm x 60cm",
        price: "BD 75",
        image: "../assets/white-couch.jpg"
    },
    {
        id: "3",
        title: "Accent Chair",
        description: "Elegant chair for bedrooms and lounge areas.",
        madeBy: "Home Style Bahrain",
        measurement: "80cm x 75cm",
        price: "BD 45",
        image: "../assets/white-couch.jpg"
    }
];

// ================== USER WELCOME ==================
function displayLoggedInUser() {
    const username = sessionStorage.getItem("username") || "User";

    document.getElementById("welcome-name").textContent = `Welcome, ${username}`;
    document.getElementById("user-avatar").textContent = username.charAt(0).toUpperCase();

    const topAvatar = document.getElementById("top-avatar");
    if (topAvatar) {
        topAvatar.textContent = username.charAt(0).toUpperCase();
    }
}

// ================== LOAD FURNITURE ==================
function loadFurniture(items = furnitureItems) {
    const container = document.querySelector(".feeds");
    container.innerHTML = "";

    items.forEach(item => {
        container.innerHTML += `
            <div class="furniture-card" data-id="${item.id}">
                <div class="furniture-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>

                <div class="furniture-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>

                    <div class="furniture-details">
                        <p><b>Made by:</b> ${item.madeBy}</p>
                        <p><b>Measurement:</b> ${item.measurement}</p>
                        <p><b>Price:</b> ${item.price}</p>
                    </div>

                    <div class="actions">
                        <button class="buy-btn">Buy</button>
                        <button class="try-btn">Try</button>
                        <button class="fav-btn">♡ Save</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// ================== SEARCH ==================
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = furnitureItems.filter(item =>
        item.title.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value) ||
        item.madeBy.toLowerCase().includes(value)
    );

    loadFurniture(filtered);
});

// ================== CLICK EVENTS ==================
document.addEventListener("click", (e) => {
    const card = e.target.closest(".furniture-card");
    if (!card) return;

    const item = furnitureItems.find(f => f.id === card.dataset.id);

    if (!e.target.closest("button")) {
        localStorage.setItem("selectedFurniture", JSON.stringify(item));
        window.location.href = "ViewImage.html";
    }

    if (e.target.classList.contains("fav-btn")) {
        let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
        favourites.push(item);
        localStorage.setItem("favourites", JSON.stringify(favourites));
        alert("Saved to favourites.");
    }

    if (e.target.classList.contains("buy-btn")) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart.");
    }

    if (e.target.classList.contains("try-btn")) {
        alert("Camera try feature will be added later.");
    }
});