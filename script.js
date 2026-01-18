// 1. Dark Mode Logic
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check if user previously chose dark mode
if(localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    if(body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        toggleBtn.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        toggleBtn.textContent = '🌙';
    }
});

// 2. Simple Alert for Forms (Simulating actions)
function simulateSubmit(event, message) {
    event.preventDefault(); // Stops page from reloading
    alert(message);
}