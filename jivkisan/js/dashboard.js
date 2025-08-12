let approvedOF = ["farmer1"];
const username = "farmer1";
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");
const messages = document.getElementById("messages");
const transactionHistory = document.getElementById("transactionList");
const userCount = document.getElementById("userCount");
const productCount = document.getElementById("productCount");
const profileUsername = document.getElementById("profileUsername");
const profileStatus = document.getElementById("profileStatus");
const notifications = document.getElementById("notifications");
const tips = document.getElementById("tips");
const weather = document.getElementById("weather");
const cropHealth = document.getElementById("cropHealth");
const profileImage = document.getElementById("profileImage");
let transactions = [];
let users = ["farmer1", "farmer2", "farmer3"];
let products = 4;

// Simulated location (e.g., India regions)
const locations = ["North India", "South India", "East India", "West India"];
let currentLocation = locations[Math.floor(Math.random() * locations.length)];

userCount.textContent = users.length;
productCount.textContent = products;

document.getElementById("statsChart").innerHTML = `
<chartjs>
{
    "type": "pie",
    "data": {
        "labels": ["Users", "Products"],
        "datasets": [{
            "data": [${users.length}, ${products}],
            "backgroundColor": ["#4CAF50", "#FF9800"]
        }]
    },
    "options": {
        "responsive": true,
        "plugins": {
            "legend": { "position": "top" },
            "title": { "display": true, "text": "Users vs Products" }
        }
    }
}
</chartjs>
`;

window.addEventListener("message", function(event) {
    if (event.data.type === "updateProductCount") {
        products += event.data.count;
        productCount.textContent = products;
        document.getElementById("statsChart").innerHTML = `
        <chartjs>
        {
            "type": "pie",
            "data": {
                "labels": ["Users", "Products"],
                "datasets": [{
                    "data": [${users.length}, ${products}],
                    "backgroundColor": ["#4CAF50", "#FF9800"]
                }]
            },
            "options": {
                "responsive": true,
                "plugins": {
                    "legend": { "position": "top" },
                    "title": { "display": true, "text": "Users vs Products" }
                }
            }
        }
        </chartjs>
        `;
    }
});

document.getElementById("ofApplicationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    if (!approvedOF.includes(username)) {
        approvedOF.push(username);
        alert("Congratulations! Your OF application has been approved. Access to the Blockchain Network is now enabled.");
        chatInput.disabled = false;
        sendButton.disabled = false;
        messages.innerHTML += `<p><strong>System:</strong> Welcome to the OF Blockchain Network!</p>`;
        profileStatus.textContent = "Organic Farmer";
        updateTips();
    } else {
        alert("You are already an approved OF farmer!");
    }
});

if (approvedOF.includes(username)) {
    chatInput.disabled = false;
    sendButton.disabled = false;
    messages.innerHTML += `<p><strong>System:</strong> Welcome to the OF Blockchain Network!</p>`;
    profileStatus.textContent = "Organic Farmer";
    updateTips();
}

document.getElementById("sendButton").addEventListener("click", function() {
    const message = chatInput.value;
    if (message && approvedOF.includes(username)) {
        messages.innerHTML += `<p><strong>${username}:</strong> ${message}</p>`;
        chatInput.value = "";
    }
});

function logTransaction(product, type, price) {
    const transaction = { time: new Date().toLocaleString(), type, product, price };
    transactions.push(transaction);
    updateTransactionHistory();
}

function updateTransactionHistory() {
    const filter = document.getElementById("filterType").value;
    let filteredTransactions = transactions;
    if (filter !== "all") {
        filteredTransactions = transactions.filter(t => t.type.toLowerCase() === filter);
    }
    transactionHistory.innerHTML = filteredTransactions.map(t => `<p>${t.time}: ${t.type} - ${t.product} for $${t.price}</p>`).join('');
}

function updateTips() {
    const month = new Date().getMonth();
    if (profileStatus.textContent === "Organic Farmer") {
        if (month >= 5 && month <= 7) { // June to August
            tips.innerHTML = "<p><strong>Tip:</strong> Focus on monsoon crops like rice; ensure proper drainage!</p>";
        } else if (month >= 0 && month <= 2) { // January to March
            tips.innerHTML = "<p><strong>Tip:</strong> Plant winter vegetables like carrots with organic mulch!</p>";
        } else {
            tips.innerHTML = "<p><strong>Tip:</strong> Prepare soil for the next season with natural compost!</p>";
        }
    } else {
        tips.innerHTML = "<p><strong>Tip:</strong> Consider transitioning to organic farming for sustainable yields!</p>";
    }
}

// Market trend notifications from agmarknet via data.gov.in API
const apiKey = '579b464db66ec23bdd000001f20be647d0824a5859155f1868ba6fe0'; // Replace with your data.gov.in API key
let marketData = []; // To store fetched data

async function fetchMarketTrends() {
    try {
        const response = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=10000`);
        const data = await response.json();
        marketData = data.records || [];
        filterCrops();
    } catch (error) {
        console.error('Error fetching market data:', error);
        notifications.innerHTML = '<p>Error loading market trends. Please check API key or connection.</p>';
    }
}

function filterCrops() {
    const searchTerm = document.getElementById("cropSearch").value.toLowerCase();
    const filteredData = marketData.filter(record => record.commodity.toLowerCase().includes(searchTerm));

    // Group by commodity to get latest entry for each (to show at least 50 unique)
    const cropPrices = {};
    filteredData.sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date)); // Sort by latest date
    filteredData.forEach(record => {
        const crop = record.commodity;
        if (!cropPrices[crop]) {
            cropPrices[crop] = { date: record.arrival_date, min: parseFloat(record.min_price), max: parseFloat(record.max_price), modal: parseFloat(record.modal_price), mandi: record.market };
        }
    });

    let html = '';
    const uniqueCrops = Object.keys(cropPrices).slice(0, 100); // Show up to 100 to ensure min 50
    uniqueCrops.forEach(crop => {
        const { date, min, max, modal, mandi } = cropPrices[crop];
        html += `<p><strong>${crop} Trend (${date}):</strong> Modal: Rs. ${modal.toFixed(2)} (Min: Rs. ${min.toFixed(2)}, Max: Rs. ${max.toFixed(2)}), Mandi: ${mandi}</p>`;
    });
    notifications.innerHTML = html || '<p>No data found for the search term.</p>';
}

fetchMarketTrends(); // Initial fetch
setInterval(fetchMarketTrends, 3600000); // Update every hour

// Simulated location-based weather updates
setInterval(() => {
    const conditions = ["Sunny", "Rainy", "Cloudy"];
    const temp = Math.floor(Math.random() * 35) + 15; // 15°C to 50°C
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    weather.innerHTML = `<p><strong>Weather (${currentLocation}):</strong> ${randomCondition}, ${temp}°C</p>`;
    updateCropHealth(randomCondition, temp);
}, 15000);

function updateCropHealth(condition, temp) {
    let healthStatus = "";
    if (condition === "Rainy" && temp > 30) {
        healthStatus = "<p><strong>Alert:</strong> Risk of waterlogging for crops! Check drainage.</p>";
    } else if (condition === "Sunny" && temp > 40) {
        healthStatus = "<p><strong>Alert:</strong> High heat risk! Provide shade or irrigation.</p>";
    } else {
        healthStatus = "<p><strong>Status:</strong> Crops are healthy under current conditions.</p>";
    }
    cropHealth.innerHTML = healthStatus;
}

function editProfile() {
    document.getElementById("editProfileForm").style.display = "block";
}

document.getElementById("editProfileForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const newUsername = document.getElementById("editUsername").value;
    const profilePhoto = document.getElementById("profilePhoto").files[0];
    if (newUsername) {
        profileUsername.textContent = newUsername;
        if (profilePhoto) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
                profileImage.style.display = "block";
            };
            reader.readAsDataURL(profilePhoto);
        }
        alert(`Profile updated! New username: ${newUsername} (Simulated)`);
        cancelEdit();
        updateTips();
    }
});

function cancelEdit() {
    document.getElementById("editProfileForm").style.display = "none";
    document.getElementById("editProfileForm").reset();
}

function logout() {
    alert("Logged out successfully! (Simulated)");
    window.location.href = "login.html";
}