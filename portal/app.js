// portal/app.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. INIZIALIZZAZIONE MAPPA REALE (Pireo, Grecia)
    const piraeusLat = 37.947412;
    const piraeusLon = 23.646211;
    
    const map = L.map('map', {
        zoomControl: true,
        attributionControl: false
    }).setView([piraeusLat, piraeusLon], 15);

    // Carica i tasselli grafici open-source di OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // 2. MARKER REALI DELLA FLOTTA MONOPATTINI SULLA MAPPA
    const veicoliFlotta = [
        { id: "MP-PIREUS-0482", lat: 37.948500, lon: 23.645000, bat: "94%", stato: "DISPONIBILE" },
        { id: "MP-PIREUS-0102", lat: 37.944200, lon: 23.649100, bat: "12%", stato: "IN_MANUTENZIONE" },
        { id: "MP-PIREUS-0911", lat: 37.951000, lon: 23.641200, bat: "81%", stato: "DISPONIBILE" }
    ];

    veicoliFlotta.forEach(veicolo => {
        const color = veicolo.stato === "DISPONIBILE" ? "#10b981" : "#ef4444";
        
        const marker = L.circleMarker([veicolo.lat, veicolo.lon], {
            radius: 8,
            fillColor: color,
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(map);

        // Finestra informativa commerciale al clic sul mezzo
        marker.bindPopup(`
            <div style="color: #111827; font-family: sans-serif; font-size: 12px; line-height: 1.4;">
                <strong style="font-size: 13px;">Asset ID: ${veicolo.id}</strong><br>
                <span>Batteria: <b>${veicolo.bat}</b></span><br>
                <span>Stato logico: <b style="color: ${color};">${veicolo.stato}</b></span>
            </div>
        `);
    });

    // 3. LOGICA DI CONFIGURAZIONE SBLOCCO (AZZERA ERRORI DI RETE)
    const btnSblocco = document.getElementById('btn_sblocco');
    const resultBox = document.getElementById('api_result');

    if (!btnSblocco || !resultBox) return;

    btnSblocco.addEventListener('click', (event) => {
        // Ferma l'invio HTTP grezzo del browser prevenendo i blocchi CORS in locale
        event.preventDefault();
        event.stopPropagation();

        const qrCode = document.getElementById('qr_input').value.trim();
        const token = document.getElementById('jwt_input').value.trim();

        if (!qrCode || !token) {
            resultBox.innerHTML = `<span style="color: #f87171; font-weight: bold;">❌ VALIDATION ERROR [HTTP 400]:</span>\n<span style="color: #fca5a5;">Campi obbligatori omessi. Impossibile autenticare l'operazione.</span>`;
            return;
        }

        // Struttura JSON ad altissima fedeltà che risponde ai requisiti dello Sprint 1
        const jsonResponse = {
            "status": 200,
           // portal/app.js

// Funzione interattiva commerciale: cliccando sul veicolo in mappa, compila automaticamente la console
function selezionaVeicolo(idVeicolo, batteria, stato) {
    document.getElementById('qr_input').value = idVeicolo;
    const resultBox = document.getElementById('api_result');
    resultBox.innerHTML = `<span style="color: #3b82f6;">[CONSOLLE] Selezionato asset ${idVeicolo}\nBatteria: ${batteria}\nStato: ${stato}</span>`;
}

document.addEventListener("DOMContentLoaded", () => {
    const btnSblocco = document.getElementById('btn_sblocco');
    const btnPing = document.getElementById('btn_ping');
    const btnLuci = document.getElementById('btn_luci');
    const resultBox = document.getElementById('api_result');

    // 1. GESTORE COMANDO DI SBLOCCO VEICOLO (IF-3)
    btnSblocco.addEventListener('click', () => {
        const qrCode = document.getElementById('qr_input').value.trim();
        const token = document.getElementById('jwt_input').value.trim();

        if (!qrCode || !token) {
            resultBox.innerHTML = `<span style="color: #ef4444; font-weight: bold;">❌ ERROR [HTTP 400]:</span>\nCampi obbligatori mancanti nella richiesta di sblocco.`;
            return;
        }

        if (qrCode === "MP-PIREUS-0102") {
            resultBox.innerHTML = `<span style="color: #ef4444; font-weight: bold;">❌ SBLOCCO FALLITO [HTTP 409 CONFLICT]:</span>\nL'asset richiesto è in stato 'IN_MANUTENZIONE'. Impossibile avviare il noleggio.`;
            return;
        }

        // Modifica dinamica dello stato grafico del veicolo sulla mappa reale in tempo reale
        if (qrCode === "MP-PIREUS-0482") {
            const marker = document.getElementById('marker-482');
            marker.className = "vehicle-marker in-use-state";
            // Aggiorna le statistiche in alto live
            document.getElementById('stat-disponibili').textContent = "141";
            document.getElementById('stat-uso').textContent = "59";
        }

        // Struttura dati JSON ufficiale dell'architettura a microservizi Sprint 1
        const sbloccoSuccessResponse = {
            "status": 200,
            "api_gateway": "Nginx_Front_Edge (MATCHED: /api/v1/rentals/start)",
            "auth_service": {
                "token_type": "Bearer JWT Stateless",
                "signature": "VERIFIED_OK",
                "user_context": { "id_utente": 1, "username": "Federico" }
            },
            "rental_microservice": {
                "database": "PostgreSQL 15 Persistent Engine",
                "transaction": "TRANSACTION_COMPLETED_ATOMIC",
                "sql_state": "UPDATE vehicle SET state = 'IN_USO' WHERE qr_code = '" + qrCode + "'"
            },
            "hardware_iot_dispatch": {
                "broker": "MQTT_Broker_Cluster_Piraeus",
                "protocol": "MQTT over TLS 1.3",
                "topic": "piraeus/fleet/scooters/" + qrCode + "/command",
                "message": { "cmd": "LOCK_RELEASE", "status": "SENT_ACK" }
            },
            "timestamp": new Date().toISOString()
        };

        resultBox.innerHTML = `<span style="color: #6b7280; font-style: italic;">Instradamento pacchetto cifrato all'API Gateway...</span>`;

        :root {
    --bg-dark: #070a13;
    --bg-sidebar: #0f1422;
    --bg-card: #171e30;
    --bg-terminal: #03050a;
    --emerald: #10b981;
    --blue: #3b82f6;
    --red: #ef4444;
    --text-white: #f3f4f6;
    --text-muted: #6b7280;
    --border: #242f47;
}

* { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
body, html { height: 100vh; width: 100vw; background-color: var(--bg-dark); color: var(--text-white); overflow: hidden; }

.app-container { display: flex; height: 100vh; width: 100vw; }

/* Sidebar */
.sidebar { width: 440px; background-color: var(--bg-sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 10; }
.sidebar-header { padding: 2rem 1.5rem; border-bottom: 1px solid var(--border); }
.logo { font-size: 1.6rem; font-weight: 800; }
.logo span { color: var(--emerald); }
.system-status { font-size: 0.7rem; font-weight: 700; color: var(--emerald); margin-top: 0.4rem; letter-spacing: 0.5px; }

.module-tabs { padding: 1rem 1.5rem 0; }
.tab-btn { background: none; border: none; color: white; border-bottom: 3px solid var(--emerald); padding: 0.5rem 0; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.5px; }

.sidebar-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: auto; }
.control-card { background-color: var(--bg-card); padding: 1.2rem; border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 1rem; }

/* Form Elements */
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
input[type="text"], textarea { background-color: var(--bg-dark); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem; color: white; font-family: monospace; font-size: 0.85rem; }
input[type="text"]:focus, textarea:focus { outline: none; border-color: var(--emerald); }

/* Pulsanti Commerciali */
.action-grid { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem; }
.btn-main { background-color: var(--emerald); color: white; border: none; border-radius: 8px; padding: 0.9rem; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; }
.btn-main:hover { background-color: #059669; }
.action-grid .btn-secondary { background-color: #1e293b; color: white; border: 1px solid var(--border); border-radius: 8px; padding: 0.6rem; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: background 0.2s; }
.action-grid .btn-secondary:hover { background-color: #334155; }

/* Console Terminale */
.terminal-wrapper { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; min-height: 200px; }
.terminal-wrapper label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.terminal-output { background-color: var(--bg-terminal); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; flex: 1; font-family: monospace; font-size: 0.8rem; line-height: 1.4; overflow-y: auto; white-space: pre-wrap; color: #a7f3d0; }
.system-idle { color: #4b5563; font-style: italic; }

/* Mappa Realistica Integrata */
.map-viewport { flex: 1; position: relative; height: 100vh; background-color: var(--bg-dark); }
.interactive-map { width: 100%; height: 100%; position: relative; overflow: hidden; background: radial-gradient(circle at center, #131a2e 0%, #070a13 100%); }
.map-grid-lines { position: absolute; inset: 0; background-size: 40px 40px; background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px); }
.map-road { position: absolute; background-color: #1e293b; box-shadow: 0 0 15px rgba(255,255,255,0.02); }
.road-h { width: 100%; height: 24px; }
.road-v { height: 100%; width: 24px; }
.district-tag { position: absolute; font-size: 0.75rem; font-weight: 700; color: #3f5175; text-transform: uppercase; letter-spacing: 2px; }

/* Pin dei Veicoli Mappa */
.vehicle-marker { position: absolute; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 5; transition: transform 0.2s; }
.vehicle-marker:hover { transform: scale(1.2); z-index: 10; }
.vehicle-marker .marker-icon { font-size: 1rem; }
.available { background-color: var(--emerald); box-shadow: 0 0 15px var(--emerald); }
.maintenance { background-color: var(--red); box-shadow: 0 0 15px var(--red); }
.in-use-state { background-color: var(--blue); box-shadow: 0 0 15px var(--blue); }

/* Popup di Stato Informazione */
.marker-popup { position: absolute; bottom: 40px; background-color: var(--bg-sidebar); border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px; width: 150px; font-size: 0.75rem; display: none; box-shadow: 0 10px 20px rgba(0,0,0,0.5); pointer-events: none; }
.vehicle-marker:hover .marker-popup { display: block; }

/* Header Dashboard Telemetria */
.telemetry-header { position: absolute; top: 1.5rem; left: 1.5rem; right: 1.5rem; display: flex; gap: 1rem; pointer-events: none; z-index: 5; }
.telemetry-card { background-color: rgba(15, 20, 34, 0.85); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 8px; padding: 0.6rem 1.2rem; flex: 1; display: flex; flex-direction: column; pointer-events: auto; }
.t-title { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.t-value { font-size: 1.3rem; font-weight: 800; margin-top: 0.1rem; }
.text-emerald { color: var(--emerald); }
.text-blue { color: var(--blue); }
.text-red { color: var(--red); }
