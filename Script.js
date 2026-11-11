const ex = [["Приседания", 180], ["Отжимания", 180], ["Подтягивания", 180], ["Пресс", 180], ["Планка", 180], ["Выпады", 180], ["Бёрпи", 180]];
let xp = +(localStorage.xp || 0), qc = +(localStorage.qc || 0), cur = 0, left = 0, timer = null, stream = null, lastFrame = null, noMove = 0;
document.getElementById('xp').textContent = xp;
document.getElementById('quests').textContent = qc;

function render() {
  document.getElementById('list').innerHTML = ex.map((e, i) => {
    const locked = i > cur, done = i < cur;
    return `<div class="card ${done ? 'done' : ''}">
    <b>${i + 1}. ${e[0]}</b> ${done ? '✅' : locked ? '🔒' : ''}<br>
    <span class="timer">${i === cur ? fmt(left) : fmt(e[1])}</span><br>
    <span class="${locked ? 'lock' : 'ok'}">${done ? 'Сделано' : locked ? 'Закрыто, сначала предыдущее' : 'Сейчас делаешь'}</span><br>
    <input type="checkbox" ${done ? 'checked' : ''} disabled> Галочка откроется только после таймера и камеры
    ${i === cur ? `<button onclick="startQuest()">НАЧАТЬ</button>` : ''}
    </div>`;
  }).join('');
}

function fmt(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, '0'); }

async function startQuest() {
  if (timer) return;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('cam').srcObject = stream;
  } catch (e) {
    alert("Разреши камеру, брат, без неё таймер не пойдёт
