let mapInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // Keep existing logic
    const viewLogin = document.getElementById('view-login');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewDetails = document.getElementById('view-details');
    const loginBtn = document.getElementById('login-btn');
    const closeDetailsBtn = document.getElementById('close-details-btn');

    if(loginBtn) {
        loginBtn.addEventListener('click', () => {
            if(viewLogin) viewLogin.classList.add('hidden');
            if(viewDashboard) viewDashboard.classList.remove('hidden');
        });
    }
    
    if(closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', () => {
            if(viewDetails) viewDetails.classList.add('hidden');
        });
    }

    // Live Investigation feature
    const liveSearchBtn = document.getElementById('liveSearchBtn');
    if(liveSearchBtn) {
        liveSearchBtn.addEventListener('click', runLiveInvestigation);
    }
});

async function runLiveInvestigation() {
    const liveSearchInput = document.getElementById('liveSearchInput');
    const query = liveSearchInput.value.trim();
    if (!query) return;

    const liveSearchBtn = document.getElementById('liveSearchBtn');
    const originalBtnText = liveSearchBtn.innerText;
    liveSearchBtn.innerText = "Loading...";
    liveSearchBtn.disabled = true;

    try {
        // Step A (Geocoding)
        const osmRes = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query)); 
        const osmData = await osmRes.json();

        if (osmData.length === 0) {
            alert("Real-world location not found. Try adding the city.");
            liveSearchBtn.innerText = originalBtnText;
            liveSearchBtn.disabled = false;
            return;
        }

        // Step B (Evaluate)
        const evalRes = await fetch('http://localhost:8080/api/evaluate-live', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ 
                businessName: query, 
                latitude: parseFloat(osmData[0].lat), 
                longitude: parseFloat(osmData[0].lon), 
                sqFt: 500, 
                claimedIndustry: "Tech" 
            }) 
        }); 
        const evalData = await evalRes.json();

        // Step C (UI Update)
        const liveResultBox = document.getElementById('liveResultBox');
        liveResultBox.style.display = 'block'; 
        if(liveResultBox.classList.contains('hidden')) liveResultBox.classList.remove('hidden');
        
        document.getElementById('liveBusinessName').innerText = query;
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

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);

        L.marker([osmData[0].lat, osmData[0].lon])
            .addTo(mapInstance)
            .bindPopup(osmData[0].display_name)
            .openPopup();
            
    } catch (err) {
        console.error(err);
        alert("An error occurred during the live investigation.");
    } finally {
        liveSearchBtn.innerText = originalBtnText;
        liveSearchBtn.disabled = false;
    }
}
