const productList = document.getElementById("productList");

document.getElementById("sellAllForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productImage = document.getElementById("productImage").value;
    const newProduct = `<div class="product"><img src="${productImage}" alt="${productName}"> ${productName} - $${productPrice} <button onclick="buyProduct('${productName}', ${productPrice})">Buy</button></div>`;
    productList.innerHTML += newProduct;
    alert(`Selling ${productName} at $${productPrice} with image ${productImage} submitted! (Simulated)`);
    window.parent.postMessage({ type: "updateProductCount", count: 1 }, "*");
    window.parent.logTransaction(productName, "Sale", productPrice);
});

function buyProduct(product, price) {
    alert(`${product} bought! (Simulated)`);
    window.parent.logTransaction(product, "Purchase", price);
}