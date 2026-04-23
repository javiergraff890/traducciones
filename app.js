const terminoEl = document.getElementById('termino');
const estrellasEl = document.getElementById('estrellas');
const respuestaEl = document.getElementById('respuesta');
const pronunciacionEl = document.getElementById('pronunciacion');
const significadoEl = document.getElementById('significado');
const contextoEl = document.getElementById('contexto');
const actionsEl = document.getElementById('actions');
const resultadosEl = document.getElementById('resultados');
const btnReveal = document.getElementById('btnReveal');
const btnKnow = document.getElementById('btnKnow');
const btnDontKnow = document.getElementById('btnDontKnow');

let currentPalabra = null;

function renderEstrellas(peso) {
    const filled = peso || 0;
    let html = '';
    for (let i = 0; i < 5; i++) {
        html += '<span class="estrella ' + (i < filled ? 'filled' : 'empty') + '">★</span>';
    }
    estrellasEl.innerHTML = html;
}

async function getPalabra() {
    try {
        const res = await fetch('api/palabra.php');
        const data = await res.json();

        if (!res.ok) {
            terminoEl.textContent = data.error || 'Error';
            return;
        }

        currentPalabra = data;
        terminoEl.textContent = data.termino;
        renderEstrellas(data.peso);

        pronunciacionEl.textContent = data.pronunciacion;
        significadoEl.textContent = data.significado;
        contextoEl.textContent = data.contexto;

        respuestaEl.classList.add('hidden');
        resultadosEl.classList.add('hidden');
        actionsEl.classList.remove('hidden');
        btnReveal.style.display = 'block';
    } catch (err) {
        terminoEl.textContent = 'Error: ' + err.message;
    }
}

function reveal() {
    respuestaEl.classList.remove('hidden');
    actionsEl.classList.add('hidden');
    resultadosEl.classList.remove('hidden');
}

async function responder(sabia) {
    if (!currentPalabra) return;

    try {
        await fetch('api/responder.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: currentPalabra.id,
                resultado: sabia
            })
        });
    } catch (err) {
        // Ignore error, continue
    }

    terminoEl.classList.add('fade-out');
    
    setTimeout(() => {
        getPalabra();
        terminoEl.classList.remove('fade-out');
    }, 150);
}

btnReveal.addEventListener('click', reveal);
btnKnow.addEventListener('click', () => responder(true));
btnDontKnow.addEventListener('click', () => responder(false));

getPalabra();