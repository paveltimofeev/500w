async function loadData (url) {

    return fetch(url)
        .then(x => x.json())
        .then(data => { 
            window.data = data; 
            return data;
        })
        .catch(err => { console.log(err); });
}
