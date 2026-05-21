const messagesEl = document.getElementById('aiMessages');
const formEl = document.getElementById('aiForm');
const inputEl = document.getElementById('aiInput');
const sendBtn = document.getElementById('aiSend');
const hintEl = document.getElementById('aiHint');

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addMessage(role, text) {
  const row = document.createElement('div');
  row.className = `ai-row ${role === 'user' ? 'user' : 'bot'}`;

  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  bubble.textContent = text;

  row.appendChild(bubble);
  messagesEl.appendChild(row);
  scrollToBottom();
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  inputEl.disabled = isLoading;
  sendBtn.textContent = isLoading ? 'Enviando…' : 'Enviar';
}

async function sendMessage(message) {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const errMsg = data?.error || 'Erro ao falar com o servidor.';
    throw new Error(errMsg);
  }

  return data?.response || 'Sem resposta da IA.';
}

addMessage('bot', 'Olá! Me diga seu objetivo e eu te ajudo a escolher um caminho.');

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const raw = inputEl.value || '';
  const message = raw.trim();
  if (!message) return;

  hintEl.style.display = 'none';
  addMessage('user', message);
  inputEl.value = '';

  try {
    setLoading(true);
    const answer = await sendMessage(message);
    addMessage('bot', answer);
  } catch (err) {
    addMessage('bot', `Não consegui responder agora. (${err.message})`);
  } finally {
    setLoading(false);
    inputEl.focus();
  }
});

