// --- КОНФИГУРАЦИЯ ЗВУКА ---
const AUDIO_CONFIG = {
  music: "https://spectacular-teal-azokicb6n7.edgeone.app/Steam%20&%20Scribbles.mp3", // надёжная тестовая ссылка (можно заменить на свою)
  notification: "" // короткий звук уведомления
};

// Создаем аудио-объекты
const bgMusic = new Audio(AUDIO_CONFIG.music);
bgMusic.loop = true;
bgMusic.volume = 0.35;

const sfxNotif = new Audio(AUDIO_CONFIG.notification);
sfxNotif.volume = 0.6;

let musicStarted = false;
let isMusicPlaying = false;

// --- ДАННЫЕ ИГРЫ ---
const locations = [
  { name: "Старый город", bg: "https://i.postimg.cc/nc18sDg4/Stadtpark2.jpg", qDesc: "Пахнет свежей выпечкой.", action: "Купить хлеб", exp: 10 },
  { name: "Колизей", bg: "https://i.postimg.cc/bvW4XHD5/Colosseum-Rome.jpg", qDesc: "Величественные тени былого.", action: "Зарисовать арку", exp: 25 },
  { name: "Лазурный берег", bg: "https://i.postimg.cc/Z5qQCD6G/sight-pic-big-3189.jpg", qDesc: "Море сегодня неспокойно.", action: "Собрать камни", exp: 15 }
];

const npcs = [
  { 
    name: "Сакура", icon: "👘", text: "Kon'nichiwa! Поможешь мне собрать лепестки для церемонии?",
    options: [
      { text: "С радостью помогу!", res: "Благодарю! Это очень ценно.", reward: "🌸", exp: 40 },
      { text: "Извини, я просто проездом.", res: "Понимаю. Мирного пути.", reward: null, exp: 5 }
    ]
  },
  { 
    name: "Марко", icon: "🇮🇹", text: "Ciao! Мой дедушка потерял свой старый компас. Видел его?",
    options: [
      { text: "Я поищу его здесь.", res: "Ты настоящий друг! Удачи.", reward: "🧭", exp: 50 },
      { text: "У меня нет времени на поиски.", res: "Эх, молодежь всё спешит...", reward: null, exp: 0 }
    ]
  },
  { 
    name: "Жан", icon: "🎨", text: "Bonjour! Твой профиль идеален для моего эскиза. Постоишь минуту?",
    options: [
      { text: "Для искусства — конечно.", res: "Превосходно! Взмах кисти... готово!", reward: "🎨", exp: 35 },
      { text: "Я не люблю позировать.", res: "Жаль, такой свет пропадает.", reward: null, exp: 5 }
    ]
  }
];

let totalExp = 0;
let inv = [];

// --- ФУНКЦИИ ЗВУКА ---
function toggleMusic() {
  const btn = document.getElementById('music-btn');
  
  if (!musicStarted) {
    bgMusic.play().then(() => {
      musicStarted = true;
      isMusicPlaying = true;
      btn.textContent = "⏸️ Выключить музыку";
      console.log("✅ Фоновая музыка запущена");
    }).catch(err => {
      console.log("❌ Не удалось запустить музыку:", err);
      alert("Браузер блокирует автозапуск. Попробуйте ещё раз после клика по странице.");
    });
  } else {
    if (isMusicPlaying) {
      bgMusic.pause();
      btn.textContent = "▶️ Включить музыку";
      isMusicPlaying = false;
    } else {
      bgMusic.play();
      btn.textContent = "⏸️ Выключить музыку";
      isMusicPlaying = true;
    }
  }
}

function playNotif() {
  sfxNotif.currentTime = 0;
  sfxNotif.play().catch(() => {});
}

// --- ОСНОВНЫЕ ФУНКЦИИ ИГРЫ ---
function changeLocation(id) {
  playNotif(); // звук при смене локации
  
  const loc = locations[id];
  document.getElementById('npc-window').classList.add('hidden');
  
  document.getElementById('background-layer').style.backgroundImage = `url('${loc.bg}')`;
  document.getElementById('location-name').innerText = loc.name;
  document.getElementById('quest-desc').innerText = loc.qDesc;
  
  const btn = document.getElementById('action-btn');
  btn.classList.remove('hidden');
  btn.innerText = loc.action;
  btn.onclick = () => {
    playNotif();
    addExp(loc.exp);
    btn.classList.add('hidden');
    document.getElementById('quest-desc').innerText = "Вы изучили локацию.";
  };

  // Шанс встречи с NPC ~60%
  if (Math.random() > 0.4) {
    setTimeout(startDialogue, 800);
  }
}

function startDialogue() {
  playNotif();
  
  const npc = npcs[Math.floor(Math.random() * npcs.length)];
  const win = document.getElementById('npc-window');
  
  document.getElementById('npc-name').innerText = npc.name;
  document.getElementById('npc-icon').innerText = npc.icon;
  document.getElementById('npc-text').innerText = npc.text;
  
  const optBox = document.getElementById('dialog-options');
  optBox.innerHTML = '';

  npc.options.forEach(opt => {
    const b = document.createElement('button');
    b.className = 'dialog-btn';
    b.innerText = opt.text;
    b.onclick = () => {
      document.getElementById('npc-text').innerText = opt.res;
      optBox.innerHTML = '';
      if (opt.reward) addToInv(opt.reward);
      addExp(opt.exp);
      setTimeout(() => win.classList.add('hidden'), 2500);
    };
    optBox.appendChild(b);
  });
  
  win.classList.remove('hidden');
}

function addExp(v) {
  totalExp += v;
  document.getElementById('exp').innerText = totalExp;
}

function addToInv(item) {
  if (inv.length < 3) {
    inv.push(item);
    document.getElementById(`slot-${inv.length}`).innerText = item;
  } else {
    console.log("Инвентарь полон!");
  }
}

// Инициализация
window.onload = () => {
  changeLocation(0);
  
  // Кнопка музыки
  document.getElementById('music-btn').addEventListener('click', toggleMusic);
};
