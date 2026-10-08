document.addEventListener('DOMContentLoaded', () => {
    const viewLogin = document.getElementById('view-login');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewDetails = document.getElementById('view-details');
    const loginBtn = document.getElementById('login-btn');
    const closeDetailsBtn = document.getElementById('close-details-btn');

    loginBtn.addEventListener('click', () => {
        // Switch state to show dashboard
        viewLogin.classList.add('hidden');
        viewDashboard.classList.remove('hidden');
    });
    
    closeDetailsBtn.addEventListener('click', () => {
        viewDetails.classList.add('hidden');
    });
});
