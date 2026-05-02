document.getElementById("payment-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;
    cart.forEach(item => {
        total += Number(String(item.price).replace("BD", "").trim()) || 0;
    });

    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

    orderHistory.push({
        date: new Date().toLocaleString(),
        total: `BD ${total}`,
        items: cart
    });

    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

    alert("Payment successful. Your order has been saved in history.");

    localStorage.removeItem("cart");
    window.location.href = "OrderHistory.html";
});