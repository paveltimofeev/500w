function renderList () {

    const container = document.getElementById('list-container');
    window.data.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('list-item');
        const w = document.createElement('div');
        const t = document.createElement('div');
        
        w.innerText = `${item.w}`;
        t.innerText = `${item.t}`;

        div.appendChild(w);
        div.appendChild(t);
        container.appendChild(div);
    });
}

async function main () {
    const rows = await loadData('500.json');
    renderList();
}
  
  
main();