document.addEventListener("DOMContentLoaded", () => {
    loadFavourites();
    setupSearch();
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
    }, 1000);
}

function setupSearch() {
    const searchInput = document.getElementById("fav-search");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase();
        const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

        const filtered = favourites.filter(item =>
            item.title.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText) ||
            item.madeBy.toLowerCase().includes(searchText)
        );

        renderFavourites(filtered);
    });
}

function loadFavourites() {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    renderFavourites(favourites);
}

function renderFavourites(favourites) {
    const container = document.getElementById("favourites-container");

    if (!container) return;

    container.innerHTML = "";

    if (favourites.length === 0) {
        container.innerHTML = `
            <div class="empty-box">
                <h2>No favourite furniture found</h2>
                <p>Save furniture from the shop to view it here later.</p>
                <a href="UserDashboard.html">Back to Shopping</a>
            </div>
        `;
        return;
    }

    favourites.forEach((item, index) => {
        container.innerHTML += `
            <div class="fav-card" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}">
                <div class="fav-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <p><strong>Made by:</strong> ${item.madeBy}</p>
                    <p><strong>Measurement:</strong> ${item.measurement}</p>
                    <p class="price">${item.price}</p>

                    <div class="card-actions">
                        <button class="view-btn">View Details</button>
                        <button class="cart-btn">Add to Cart</button>
                        <button class="remove-btn">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
}

document.addEventListener("click", (event) => {
    const card = event.target.closest(".fav-card");
    if (!card) return;

    const itemId = card.dataset.id;
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    const item = favourites.find(f => f.id === itemId);

    if (!item) return;

    if (event.target.classList.contains("view-btn")) {
        localStorage.setItem("selectedFurniture", JSON.stringify(item));
        window.location.href = "ViewImage.html";
    }

    if (event.target.classList.contains("cart-btn")) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart.");
    }

    if (event.target.classList.contains("remove-btn")) {
        favourites = favourites.filter(f => f.id !== itemId);
        localStorage.setItem("favourites", JSON.stringify(favourites));
        loadFavourites();
    }
});