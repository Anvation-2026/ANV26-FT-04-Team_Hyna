let mapInstance = null;

// Enforce login — splash is the entry point
if (!sessionStorage.getItem('geotrust_session')) {
    window.location.href = 'splash.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Session management / Sign out
    const topLoginBtn = document.getElementById('btn-login-toggle');
    if (topLoginBtn) {
        topLoginBtn.innerText = "Sign Out";
        topLoginBtn.addEventListener('click', () => {
            sessionStorage.removeItem('geotrust_session');
            window.location.href = 'login.html';
        });
    }

    // Keep existing logic
    const viewLogin = document.getElementById('view-login');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewDetails = document.getElementById('view-details');
    const loginBtn = document.getElementById('login-btn');
    const closeDetailsBtn = document.getElementById('close-details-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (viewLogin) viewLogin.classList.add('hidden');
            if (viewDashboard) viewDashboard.classList.remove('hidden');
        });
    }

    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', () => {
            if (viewDetails) viewDetails.classList.add('hidden');
        });
    }

    // Live Investigation feature
    const liveInvestigateBtn = document.getElementById('liveInvestigateBtn');
    if (liveInvestigateBtn) {
        liveInvestigateBtn.addEventListener('click', runLiveInvestigation);
    }

    const clearLiveSearchBtn = document.getElementById('clearLiveSearchBtn');
    if (clearLiveSearchBtn) {
        clearLiveSearchBtn.addEventListener('click', () => {
            document.getElementById('liveResultBox').classList.add('hidden');
            document.getElementById('liveResultBox').style.display = 'none';
            document.getElementById('mainDashboardContent').classList.remove('hidden');
            document.getElementById('liveBusinessName').value = '';
            document.getElementById('liveClaimedSqFt').value = '';
        });
    }
});

async function runLiveInvestigation() {
    const liveBusinessNameInput = document.getElementById('liveBusinessName');
    const query = liveBusinessNameInput.value.trim();
    if (!query) return;

    const liveInvestigateBtn = document.getElementById('liveInvestigateBtn');
    const originalBtnText = liveInvestigateBtn.innerText;
    liveInvestigateBtn.innerText = "Loading...";
    liveInvestigateBtn.disabled = true;

    try {
        // Step A (Geocoding)
        let osmRes = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query));
        let osmData = await osmRes.json();

        // Fallback: If exact query fails, try searching just the last word (usually the city)
        if (osmData.length === 0) {
            const words = query.split(' ');
            const cityFallback = words[words.length - 1];
            osmRes = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(cityFallback));
            osmData = await osmRes.json();
        }

        if (osmData.length === 0) {
            console.warn("Location not found on OpenStreetMap. Using default coordinates for mock demonstration.");
            osmData = [{ lat: '12.9716', lon: '77.5946', display_name: 'Default Mock Location, Bengaluru' }];
        }

        // Step B (Evaluate)
        const payload = {
            businessName: query,
            claimedIndustry: document.getElementById('liveClaimedIndustry').value,
            sqFt: parseInt(document.getElementById('liveClaimedSqFt').value) || 0,
            latitude: parseFloat(osmData[0].lat),
            longitude: parseFloat(osmData[0].lon)
        };
        const evalRes = await fetch('http://localhost:8080/api/evaluate-live', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const evalData = await evalRes.json();

        // Step C (UI Update)
        const liveResultBox = document.getElementById('liveResultBox');
        liveResultBox.style.display = 'block';
        if (liveResultBox.classList.contains('hidden')) liveResultBox.classList.remove('hidden');

        document.getElementById('mainDashboardContent').classList.add('hidden');

        document.getElementById('liveResultBusinessName').innerText = query;
        document.getElementById('liveScore').innerText = 'Score: ' + evalData.score;

        const explanationsList = document.getElementById('liveExplanations');
        explanationsList.innerHTML = '';
        if (evalData.explanations && evalData.explanations.length > 0) {
            evalData.explanations.forEach(exp => {
                const li = document.createElement('li');
                li.innerText = exp;
                explanationsList.appendChild(li);
            });
        }

        // Step D (Leaflet Map)
        if (mapInstance !== null) {
            mapInstance.remove();
        }

        mapInstance = L.map('map-container').setView([osmData[0].lat, osmData[0].lon], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '©️ OpenStreetMap contributors' }).addTo(mapInstance);

        L.marker([osmData[0].lat, osmData[0].lon])
            .addTo(mapInstance)
            .bindPopup(osmData[0].display_name)
            .openPopup();

    } catch (err) {
        console.error(err);
        alert("An error occurred during the live investigation.");
    } finally {
        liveInvestigateBtn.innerText = originalBtnText;
        liveInvestigateBtn.disabled = false;
    }
}
