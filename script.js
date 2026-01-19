const marketsList = [
    "AUD/NZD (OTC)", "NZD/CHF (OTC)", "USD/ARS (OTC)", "GBP/NZD (OTC)", "USD/COP (OTC)",
    "USD/ZAR (OTC)", "USD/INR (OTC)", "USD/NGN (OTC)", "USD/PKR (OTC)", "CAD/CHF (OTC)",
    "USD/BDT (OTC)", "USD/MXN (OTC)", "USD/TRY (OTC)", "USD/EGP (OTC)", "USD/PHP (OTC)",
    "EUR/NZD (OTC)", "NZD/USD (OTC)", "USD/IDR (OTC)", "NZD/CAD (OTC)", "NZD/JPY (OTC)",
    "USD/BRL (OTC)", "USD/DZD (OTC)"
];

let signalHistory = [];

// --- Login & Server Connecting Logic ---
function checkLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const errorBox = document.getElementById('login-error');

    // Username: SYSTEAM, Password: Sureshot!! (Case-insensitive)
    if(user.toUpperCase() === "SYSTEAM" && pass.toLowerCase() === "sureshot!!") {
        errorBox.style.display = 'none';
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('loading-box').style.display = 'block';

        // 7 to 15 seconds random server connecting time
        let loadDuration = Math.floor(Math.random() * (15000 - 7000 + 1)) + 7000;
        
        setTimeout(() => {
            document.getElementById('loading-box').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, loadDuration);
    } else {
        errorBox.style.display = 'block';
    }
}

function checkSelection() {
    document.getElementById('genBtn').disabled = document.getElementById('marketSelect').value === "";
}

function startAnalysis() {
    const selected = document.getElementById('marketSelect').value;
    const analysisSection = document.getElementById('analysis-section');
    const signalDisplay = document.getElementById('signalDisplay');
    const popup = document.getElementById('market-popup');
    
    analysisSection.style.display = 'block';
    signalDisplay.style.display = 'none';

    let duration = Math.floor(Math.random() * (17000 - 8000 + 1)) + 8000;

    let interval;
    if(selected === "ALL") {
        interval = setInterval(() => {
            popup.innerText = marketsList[Math.floor(Math.random() * marketsList.length)];
        }, 300);
    } else {
        popup.innerText = selected;
    }

    setTimeout(() => {
        if(interval) clearInterval(interval);
        showSignal(selected);
    }, duration);
}

function showSignal(selected) {
    document.getElementById('analysis-section').style.display = 'none';
    document.getElementById('signalDisplay').style.display = 'block';

    let finalMarket;
    let timeStr;

    // --- Smart Market Rotation Logic ---
    function generateUniqueSignal() {
        let tempMarket;
        let tempTime;
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 50) {
            attempts++;
            tempMarket = (selected === "ALL") ? marketsList[Math.floor(Math.random() * marketsList.length)] : selected;

            let waitMin = Math.floor(Math.random() * (8 - 3 + 1)) + 3;
            let now = new Date();
            let utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
            let dhakaTime = new Date(utcTime + (3600000 * 6));
            dhakaTime.setMinutes(dhakaTime.getMinutes() + waitMin);
            tempTime = dhakaTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

            const isRepeatMarket = signalHistory.some(h => h.market === tempMarket);
            const isSameTime = signalHistory.some(h => h.time === tempTime);

            if (selected === "ALL") {
                // If it's a repeat within 3 trades, try again. After 3, just check time.
                if (!isRepeatMarket && !isSameTime) isUnique = true;
                else if (signalHistory.length >= 3 && !isSameTime) isUnique = true; 
            } else {
                if (!isSameTime) isUnique = true;
            }
            
            finalMarket = tempMarket;
            timeStr = tempTime;
        }

        signalHistory.push({ market: finalMarket, time: timeStr });
        if (signalHistory.length > 3) signalHistory.shift();
    }

    generateUniqueSignal();

    const isUp = Math.random() > 0.5;
    document.getElementById('signalOutput').innerText = `📊 MARKET: ${finalMarket}\n⏰ EXPIRY: 1 MIN 🕒 TIME: ${timeStr} (UTC +06:00)`;
    const dirElem = document.getElementById('directionText');
    dirElem.innerText = isUp ? "CALL (UP) ⬆️" : "PUT (DOWN) ⬇️";
    dirElem.style.color = isUp ? "#00ff88" : "#ff4d4d";
}

// --- Background Candle Animation ---
const canvas = document.getElementById('tradingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
let candles = [];
for(let i = 0; i < 40; i++) {
    candles.push({ x: i * 40, y: Math.random() * canvas.height, w: 10, h: Math.random() * 80 + 20, color: Math.random() > 0.5 ? "#00ff881a" : "#ff4d4d1a" });
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    candles.forEach(c => {
        ctx.fillStyle = c.color; ctx.fillRect(c.x, c.y, c.w, c.h);
        ctx.fillRect(c.x + 4, c.y - 10, 2, c.h + 20);
        c.x -= 0.5; if(c.x < -40) c.x = canvas.width + 40;
    });
    requestAnimationFrame(animate);
}
animate();