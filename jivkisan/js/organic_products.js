const approvedOF = ["farmer1"];
const username = "farmer1";
const productList = document.getElementById("productList");

if (approvedOF.includes(username)) {
    document.getElementById("sellButton").disabled = false;
}

document.getElementById("sellOrganicForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productImage = document.getElementById("productImage").value;
    if (approvedOF.includes(username)) {
        const newProduct = `<div class="product"><img src="${productImage}" alt="${productName}"> ${productName} - $${productPrice} <button onclick="buyProduct('${productName}', ${productPrice})">Buy</button></div>`;
        productList.innerHTML += newProduct;
        alert(`Selling ${productName} at $${productPrice} with image ${productImage} submitted! (Simulated)`);
        window.parent.postMessage({ type: "updateProductCount", count: 1 }, "*");
    } else {
        alert("Only OF farmers can sell organic products!");
    }
    document.getElementById("sellOrganicForm").reset();
});

function buyProduct(product, price) {
    alert(`${product} bought! (Simulated)`);
    window.parent.logTransaction(product, "Purchase", price);
}