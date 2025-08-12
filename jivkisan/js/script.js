function openTab(tabName) {
    var i, tabContent, tabs;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

document.getElementById("signinForm").addEventListener("submit", function(event) {
    event.preventDefault();
    window.location.href = "dashboard.html";
});

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Sign Up successful! (Simulated)");
    window.location.href = "dashboard.html";
});