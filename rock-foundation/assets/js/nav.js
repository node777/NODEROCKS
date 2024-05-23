function Togleside() {
    const sidebar = document.querySelector(".overlay");
    const toggleBtn = document.getElementById("toggle_btn");

    sidebar.classList.toggle("show_nav");
    document.body.classList.toggle("overflow-hidden");
    document.body.classList.toggle("overflow-auto");
    document.body.classList.toggle("vh-100");

    // Update the text of the toggle button
    if (sidebar.classList.contains("show_nav")) {
        toggleBtn.textContent = "Close Menu";
        document.body.style.overflow = 'hidden'; // Disable page scrolling
    } else {
        toggleBtn.textContent = "Menu";
        document.body.style.overflow = ''; // Re-enable page scrolling
    }
}

function hideNav() {
    const sidebar = document.querySelector(".overlay");
    const toggleBtn = document.getElementById("toggle_btn");

    sidebar.classList.remove("show_nav");
    document.body.classList.add("overflow-auto");
    document.body.classList.remove("overflow-hidden");
    document.body.classList.remove("vh-100");
    document.body.style.overflow = ''; // Re-enable page scrolling
    toggleBtn.textContent = "Menu"; // Reset the text to "Menu" when hiding the menu
}