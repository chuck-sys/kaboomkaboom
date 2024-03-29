/** Java hash function */
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Add a day to the given Date object, returning a new Date object.
function addDayTo(t) {
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  return new Date(t.valueOf() + dayInMilliseconds);
}

// Set exploding time to 2130 on the current day.
function getExplodeTime() {
  let t = new Date();
  t.setHours(21, 30, 0);
  return t;
}

// 1. english with spaces
// 2. english without spaces
// 3. actual chinese
// 4. actual chinese no spaces
const HASHED_SECRETS = [1679872187, 449120043, -2073388383, 1913777981];
const IMG_FAR = 'bomb-far.png';
const IMG_NEAR = 'bomb-near.png';
const IMG_ERROR = 'bomb-placeholder.png';
const IMG_NOBOMB = 'no-bomb.png';
const BEEP_FILE = 'beep.ogg';
const EXPLODE_FILE = 'explosion.mp3';
const EXPLODE_TIME = getExplodeTime();

// Enum: 'far-away' or 'near'
let appState = 'far-away';
let timer = null;

// Load bg image based on appState var
function loadBgImage() {
  if (appState === 'far-away') {
    document.getElementById('imgBomb').src = IMG_FAR;
  } else if (appState === 'near') {
    document.getElementById('imgBomb').src = IMG_NEAR;
  } else {
    document.getElementById('imgBomb').src = IMG_ERROR;
  }
}

function makeTimeString(hours, minutes, seconds) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getRemainingTime(diffMS) {
  const seconds = Math.floor(diffMS / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) - hours * 60;
  return makeTimeString(hours, minutes, seconds % 60);
}

function beep() {
  let a = new Audio(BEEP_FILE);
  a.play();
}

function explode() {
  let a = new Audio(EXPLODE_FILE);
  a.play();
}

function tick() {
  const diffMS = EXPLODE_TIME - (new Date());
  // Lose condition check
  if (diffMS <= 0) {
    explode();
    clearInterval(timer);
    appState = 'lost';
    document.getElementById('imgBomb').src = IMG_NOBOMB;
  } else {
    beep();
    document.getElementById('timer').innerHTML = '還有 ' + getRemainingTime(diffMS);
  }
}

function onClickBomb() {
  if (appState === 'won' || appState === 'lost') {
    return;
  }

  if (appState === 'far-away') {
    appState = 'near';
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('passcode').classList.remove('hidden');
  } else {
    appState = 'far-away';
    document.getElementById('timer').classList.remove('hidden');
    document.getElementById('passcode').classList.add('hidden');
  }

  loadBgImage();
}

function init() {
  timer = setInterval(tick, 1000);
  loadBgImage();
}

function checkPasscode() {
  if (appState === 'won' || appState === 'lost') {
    return;
  }

  const text = document.getElementById('passcode').value;
  for (let secret of HASHED_SECRETS) {
    if (text.hashCode() === secret) {
      clearInterval(timer);
      document.getElementById('timer').classList.remove('hidden');
      document.getElementById('timer').innerHTML = 'Bomb defused. You win!';
      document.getElementById('passcode').classList.add('hidden');
      document.getElementById('imgBomb').src = IMG_NOBOMB;
      appState = 'won';
      return;
    }
  }
}

init();
