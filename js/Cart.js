document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    setupSearch();
});

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getPriceNumber(priceText) {
    return Number(String(priceText).replace("BD", "").trim()) || 0;
}

function setupSearch() {
    const searchInput = document.getElementById("cart-search");

    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase();
        const cart = getCart();

        const filtered = cart.filter(item =>
            item.title.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText) ||
            item.madeBy.toLowerCase().includes(searchText)
        );

        renderCart(filtered);
    });
}

function loadCart() {
    renderCart(getCart());
}

function renderCart(cart) {
    const container = document.getElementById("cart-container");
    const totalElement = document.getElementById("cart-total");

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-box">
                <h2>Your cart is empty</h2>
                <p>Add furniture from the shop to continue.</p>
                <a href="UserDashboard.html">Back to Shopping</a>
            </div>
        `;

        totalElement.textContent = "BD 0";
        return;
    }

    let total = 0;

    cart.forEach((item) => {
        total += getPriceNumber(item.price);

        container.innerHTML += `
            <div class="cart-card" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}">

                <div class="cart-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <p><strong>Made by:</strong> ${item.madeBy}</p>
                    <p><strong>Measurement:</strong> ${item.measurement}</p>
                    <p class="price">${item.price}</p>

                    <div class="card-actions">
                        <button class="view-btn">View Details</button>
                        <button class="remove-btn">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    totalElement.textContent = `BD ${total}`;
}

document.addEventListener("click", (event) => {
    const card = event.target.closest(".cart-card");

    if (card) {
        const itemId = card.dataset.id;
        let cart = getCart();
        const item = cart.find(f => f.id === itemId);

        if (event.target.classList.contains("view-btn")) {
            localStorage.setItem("selectedFurniture", JSON.stringify(item));
            window.location.href = "ViewImage.html";
        }

        if (event.target.classList.contains("remove-btn")) {
            cart = cart.filter(f => f.id !== itemId);
            saveCart(cart);
            loadCart();
        }
    }

    if (event.target.id === "payment-btn") {
        const cart = getCart();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        window.location.href = "Payment.html";
    }
});