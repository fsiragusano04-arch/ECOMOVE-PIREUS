document.getElementById('btn_sblocco').addEventListener('click', async () => {
    const qrCode = document.getElementById('qr_input').value;
    const token = document.getElementById('jwt_input').value;
    const resultBox = document.getElementById('api_result');

    try {
        const response = await fetch('http://localhost:8080/api/v1/rentals/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ codice_qr: qrCode })
        });
        const data = await response.json();
        resultBox.classList.remove('hidden');
        resultBox.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        resultBox.classList.remove('hidden');
        resultBox.textContent = "Errore di connessione all'API Gateway.";
    }
});
