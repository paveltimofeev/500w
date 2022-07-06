function renderList () {

    const container = document.getElementById('list-container');
    window.data.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('list-item');
        const w = document.createElement('div');
        const t = document.createElement('div');
        const playButton = document.createElement('div');

        w.classList.add('word');
        t.classList.add('trans');
        playButton.classList.add('play');
        playButton.addEventListener('click', () => { play(item.w); });
        
        w.innerText = `${item.w}`;
        t.innerText = `${item.t}`;
        playButton.innerHTML = `&#9654;`;

        const wordContainer = document.createElement('div');
        wordContainer.appendChild(w);
        wordContainer.appendChild(t);
        div.appendChild(wordContainer);
        div.appendChild(playButton);
        container.appendChild(div);
    });
}

async function main () {
    const rows = await loadData('500.json');
    renderList();
}
  
  
main();