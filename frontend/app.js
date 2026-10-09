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

// ─── Local mock registry (mirrors Java ApiController) ────────────────────────
const LOCAL_MOCK_REGISTRY = {
    'hynastudio':   { claimedIndustry: 'Tech',               sqFt: 500,    lat: 8.1833,  lng: 77.4119 },
    'google':       { claimedIndustry: 'Tech',               sqFt: 500000, lat: 12.9716, lng: 77.5946 },
    'microsoft':    { claimedIndustry: 'Tech',               sqFt: 300000, lat: null,    lng: null    },
    'titanium steel':{ claimedIndustry: 'Heavy Manufacturing',sqFt: 150000, lat: 13.0827, lng: 80.2707 },
    'jp morgan':    { claimedIndustry: 'Finance',            sqFt: 25000,  lat: null,    lng: null    },
    'ghost logistics':{ claimedIndustry: 'Heavy Manufacturing',sqFt: 200,  lat: null,    lng: null    },
    '21 monk':      { claimedIndustry: 'Tech',               sqFt: 1200,   lat: null,    lng: null    },
};

function localHaversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function localEvaluate(payload) {
    let score = 100;
    const explanations = [];
    const search = payload.businessName.toLowerCase();

    // Rule 1 — Registry check
    let registered = null;
    for (const key of Object.keys(LOCAL_MOCK_REGISTRY)) {
        if (search.includes(key)) { registered = LOCAL_MOCK_REGISTRY[key]; break; }
    }
    if (!registered) {
        return { score: 0, explanations: ['🚨 FATAL: Business entity not found in Government MCA Registry.'] };
    }

    // Rule 2 — Asset overstatement
    if (payload.sqFt && payload.sqFt > registered.sqFt * 1.5) {
        score -= 50;
        explanations.push(`🚩 CRITICAL: Asset Overstatement. Investigator claimed ${payload.sqFt} sqft, but entity is legally registered for only ${registered.sqFt} sqft.`);
    }

    // Rule 3 — Industry mismatch
    if (payload.claimedIndustry && payload.claimedIndustry.toLowerCase() !== registered.claimedIndustry.toLowerCase()) {
        score -= 30;
        explanations.push(`⚠️ WARNING: Industry mismatch. Claimed ${payload.claimedIndustry} but registered as ${registered.claimedIndustry}.`);
    }

    // Rule 4 — Coordinates / location anomaly
    const lat = payload.latitude, lon = payload.longitude;
    if (!lat || !lon || lat === 0 || lon === 0) {
        score -= 100;
        explanations.push('🚨 FATAL: Invalid or null geographic coordinates provided.');
    } else if (registered.lat && registered.lng) {
        const dist = localHaversineKm(lat, lon, registered.lat, registered.lng);
        if (dist > 50) {
            score -= 60;
            explanations.push(`🚨 FATAL LOCATION ANOMALY: Claimed location is ${dist.toFixed(1)} km away from the officially registered headquarters.`);
        }
    }

    // Rule 5 — All clear
    if (score === 100) {
        explanations.push('✅ VERIFIED: Claimed data perfectly matches Government Registry and spatial constraints.');
    }

    return { score: Math.max(0, score), explanations };
}
// ─────────────────────────────────────────────────────────────────────────────

async function runLiveInvestigation() {
    const businessNameInput = document.getElementById('liveBusinessName');
    const addressInput = document.getElementById('liveClaimedAddress');
    const businessNameQuery = businessNameInput.value.trim();
    const addressQuery = addressInput.value.trim();
    if (!businessNameQuery || !addressQuery) return;

    const liveInvestigateBtn = document.getElementById('liveInvestigateBtn');
    const originalBtnText = liveInvestigateBtn.innerText;
    liveInvestigateBtn.innerText = "Loading...";
    liveInvestigateBtn.disabled = true;

    try {
        // Step A — Geocoding via OpenStreetMap
        let osmRes = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(addressQuery));
        let osmData = await osmRes.json();

        if (osmData.length === 0) {
            const cityFallback = addressQuery.split(' ').pop();
            osmRes = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(cityFallback));
            osmData = await osmRes.json();
        }

        if (osmData.length === 0) {
            console.warn("Location not found on OpenStreetMap. Using default coordinates.");
            osmData = [{ lat: '12.9716', lon: '77.5946' }];
        }

        const payload = {
            businessName: businessNameQuery,
            claimedIndustry: document.getElementById('liveClaimedIndustry').value,
            sqFt: parseInt(document.getElementById('liveClaimedSqFt').value) || 0,
            latitude: parseFloat(osmData[0].lat),
            longitude: parseFloat(osmData[0].lon)
        };

        // Step B — Try backend; fall back to local engine if unavailable
        let evalData;
        try {
            const evalRes = await fetch('http://localhost:8080/api/evaluate-live', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(4000)   // 4 s timeout
            });
            if (!evalRes.ok) throw new Error('Backend returned ' + evalRes.status);
            evalData = await evalRes.json();
        } catch (backendErr) {
            console.warn('Backend unavailable — using local evaluation engine.', backendErr);
            evalData = localEvaluate(payload);
        }

        // Step C (UI Update)
        const liveResultBox = document.getElementById('liveResultBox');
        liveResultBox.style.display = 'block';
        if (liveResultBox.classList.contains('hidden')) liveResultBox.classList.remove('hidden');

        document.getElementById('mainDashboardContent').classList.add('hidden');

        document.getElementById('liveResultBusinessName').innerText = businessNameQuery;
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
            .bindPopup(addressQuery)
            .openPopup();

    } catch (err) {
        console.error(err);
        alert("An error occurred during the live investigation.");
    } finally {
        liveInvestigateBtn.innerText = originalBtnText;
        liveInvestigateBtn.disabled = false;
    }
}
