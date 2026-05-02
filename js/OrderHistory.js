document.addEventListener("DOMContentLoaded", () => {
    loadOrderHistory();
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

function loadOrderHistory() {
    const container = document.getElementById("history-container");
    const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];

    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-box">
                <h2>No orders yet</h2>
                <p>Your completed purchases will appear here.</p>
                <a href="UserDashboard.html">Back to Shopping</a>
            </div>
        `;
        return;
    }

    orders.reverse().forEach((order, index) => {
        let itemsHtml = "";

        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <p><strong>Made by:</strong> ${item.madeBy}</p>
                        <p class="price">${item.price}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="order-card">
                <h2>Order #${orders.length - index}</h2>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Total:</strong> ${order.total}</p>
                ${itemsHtml}
            </div>
        `;
    });
}