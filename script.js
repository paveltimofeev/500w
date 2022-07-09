let _defaultState = {
  seed: 20,
  window: 20
};

let state = {..._defaultState};

const info = document.getElementById('info');

const renderGrid = (itemsCount) => {

  const container = document.querySelector('.container');
  container.innerHTML = null;

  for (let i = 0; i < itemsCount; i++) {
    const item = document.createElement('div');
    item.style.opacity = 0.1;
    item.classList.add('item');
    item.setAttribute('id', i);
    container.appendChild(item);
  }
}

const renderGridItem = (id) => {
  
  const item = document.getElementById(`${id}`);
  if(!item) {
    return;
  }

  item.classList.add('item--done');
  const opacity = +item.style.opacity;
  if (opacity < 1) {
    item.style.opacity = opacity + .2;
    return true;
  } else {
    return false;
  }
}

function startEmulation () {

  const itemsCount = window.data.length;
  let iteration = 0;
  const interval = setInterval(() => {
    nextCard();
    const done = document.querySelectorAll('.item--done');
    info.innerText = `iteraion ${iteration}: ${done.length}/${itemsCount}`;
    iteration++;
    if (done.length === itemsCount) {
      clearInterval(interval);
      
      let totalOpacity = 0;
      let onceShownCnt = 0;
      let tooMuchCnt = 0;
      for (let i = 0; i < done.length; i++) {
        totalOpacity += +done[i].style.opacity;
        if (+done[i].style.opacity <= .2) {
          onceShownCnt++;
        }
        if (+done[i].style.opacity >= 1.4) {
          tooMuchCnt++;
        }
      }
      info.innerText += `. Avg density: ${totalOpacity / itemsCount}. Once: ${onceShownCnt}. Too much: ${tooMuchCnt}`;
    }
  }, 10);
}

const alg1 = () => {
  const id = Math.round(Math.random() * itemsCount);
  return id;
}

const alg2 = () => {
  
  const getId = () => {
    return Math.round(Math.random() * itemsCount);
  }
  
  const idLimit = 1 + Math.round(Math.random() * itemsCount);
  let id = getId();
  let attempt = 0;
  while (id > idLimit && attempt < 5) {
    id = getId();
    attempt++;
  }
  
  return id;
}

const alg3 = (seed, window, itemsCount) => {
  
  const getId = () => {
    
    if (Math.random() < .25 || seed > itemsCount - window) {
      return Math.round(Math.random() * seed);
    }
    if (Math.random() < .25) {
      return seed + Math.round(Math.random() * window) - window + 1;
    }
    
    return seed + Math.round(Math.random() * window);
  }
  
  return getId();
}

let lastIds = [];
const alg4 = (seed, window, itemsCount) => {

  const getId = () => {
    const op = seed % 4;
    const newCardId = Math.round(seed / 4);
    const gen1 = newCardId - Math.round(Math.random() * window);
    const gen2 = newCardId - Math.round(Math.random() * (window * 2));
    const gen3 = newCardId - Math.round(Math.random() * (window * 4));
    const gen4 = Math.round(Math.random() * (newCardId - window));

    switch (op) {
      case 0: // NEW
        return newCardId;
      case 1: // REPEAT NEW
        return gen1 >= 0 ? gen1 : newCardId;
      case 2: // REPEAT OLDER
        return gen2 >= 0 ? gen2 : gen1 >= 0 ? gen1 : newCardId;
      case 3: // REPEAT OLDEST
        return gen3 >= 0 ? gen3 : gen2 >= 0 ? gen2 : newCardId;
      case 4: // REPEAT OLDEST
        return gen4 >= 0 ? gen4 : gen3 >= 0 ? gen3 : newCardId;
      default:
          return 0;
      }
    }

    let id = getId();

    while(lastIds.indexOf(id) !== -1) {
      seed++;
      id = getId();
    }

    lastIds.push(id);
    if (lastIds.length > 3) {
      lastIds = lastIds.splice(0, 1);
    }

    return id;
}

const alg5 = (seed, window, itemsCount) => {

  const getId = () => {
    const op = seed % 4;
    const gen0 = Math.round(seed / 4);
    const gen1 = gen0 - 7;
    const gen2 = gen0 - 21;
    const gen3 = gen0 - 51;
    const gen4 = Math.round(Math.random() * (gen0 - window));

    switch (op) {
      case 0: // NEW
        return gen0;
      case 1: // REPEAT NEW
        return gen1 >= 0 ? gen1 : gen0;
      case 2: // REPEAT OLDER
        return gen2 >= 0 ? gen2 : gen1 >= 0 ? gen1 : gen0;
      case 3: // REPEAT OLDEST
        return gen3 >= 0 ? gen3 : gen2 >= 0 ? gen2 : gen0;
      case 4: // REPEAT OLDEST
        return gen4 >= 0 ? gen4 : gen3 >= 0 ? gen3 : gen0;
      default:
          return 0;
      }
    }

    let id = getId();

    while(lastIds.indexOf(id) !== -1) {
      seed++;
      id = getId();
    }

    lastIds.push(id);
    if (lastIds.length > 9) {
      lastIds.splice(0, 1);
    }

    return id;
}

const playListeners = {};

function renderCard (card, selector, flipped) {

  const cardContailer = document.querySelector(selector);

  if (playListeners[selector]) {
    const oldPlay = cardContailer.querySelector('.play-btn');
    oldPlay.removeEventListener('click', playListeners[selector]);
    playListeners[selector] = null;
  }

  cardContailer.innerHTML = null;
  if(flipped) {
    cardContailer.classList.add('card--flipped');
  }

  const span1 = document.createElement('span');
  span1.classList.add('w');
  span1.innerText = card.w;
  cardContailer.appendChild(span1);

  const span2 = document.createElement('span');
  span2.classList.add('t');
  span2.innerText = card.t;
  cardContailer.appendChild(span2);

  const playButton = document.createElement('span');
  playButton.classList.add('play-btn');
  playButton.innerHTML = `&#9654;`;

  playListeners[selector] = (el) => {
    el.preventDefault();
    el.stopPropagation();
    play(card.w);
  };

  playButton.addEventListener('click', playListeners[selector]);
  cardContailer.appendChild(playButton);
}


function rendedInfo () {

  const seed = document.getElementById('seed');
  seed.innerText = `${state.seed}`;
  seed.style.width = `${state.seed / (window.data.length * 4) * 100}%`;
  info.innerText = `seed: ${state.seed}`;
}

function saveState () {
  window.localStorage.setItem('state', JSON.stringify(state));
}

function loadSavedState () {
  const stateStr = window.localStorage.getItem('state');
  try {
    state = JSON.parse(stateStr);
    if (!state) {
      resetSavedState();
    }
  }
  catch (err) {
    console.warn(err);
    resetSavedState();
  }
}

function resetSavedState () {
  state = {..._defaultState};
  saveState();
  rendedInfo();
}

function nextCard (selector, flipped) {

  const totalCards = window.data.length - 1;
  const id = alg5(state.seed, state.window, totalCards);
  
  state.seed++;

  if (id === undefined) {
    return;
  }

  changeCard(id, selector, flipped);
}

function prevCard (selector, flipped) {

  state.seed--;

  if (state.seed <= 0) {
    return;
  }

  const totalCards = window.data.length - 1;
  const id = alg5(state.seed, state.window, totalCards);

  if (id === undefined) {
    return;
  }

  changeCard(id, selector, flipped);
}

function changeCard (id, selector, flipped) {
  const card = window.data[id];

  renderCard(card, selector, flipped);
  renderGridItem(id);
  rendedInfo();
  saveState();
}

function flip (el) {
  el.classList.toggle('card--flipped');
}


function subscribeButtons () {

  document.querySelector('#next-btn').addEventListener('click', () => { 
    nextCard('#card1'); 
    nextCard('#card2'); 
    nextCard('#card3', true);
    nextCard('#card4', true);
  });
  document.querySelector('#prev-btn').addEventListener('click', () => { 
    prevCard('#card1'); 
    prevCard('#card2'); 
    prevCard('#card3', true);
    prevCard('#card4', true);
  });
  document.querySelector('#reset-btn').addEventListener('click', () => { resetSavedState(); });
  document.querySelector('#emu-btn').addEventListener('click', () => { startEmulation(); });
}

async function main () {

  subscribeButtons();
  loadSavedState();
  const rows = await loadData('500.json');
  renderGrid(rows.length);
  nextCard('#card1');
  nextCard('#card2');
  nextCard('#card3', true);
  nextCard('#card4', true);
}


main();
