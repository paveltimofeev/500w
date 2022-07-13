/**
 *
 */
class AppLogic {

    state = {
        seed: 20,
        progress: 0,
        window: 20
    };

    dataKey = '';
    data = [];
    dataName = '';

    async loadFile(url) {

        return fetch(url)
            .then(x => x.json())
            .then(data => {
                this.data = data?.cards || [];
                this.dataKey = url;
                this.dataName = data.name || 'Без названия';
                console.log('loaded', this.data.length);
                return this.data;
            })
            .catch(err => { console.log(err); });
    }

    startEmulation () {

        const info = document.getElementById('info');
        const itemsCount = this.data.length;
        let iteration = 0;
        const interval = setInterval(() => {
            this.nextCard();
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

    alg1(seed, window, itemsCount) {
        return Math.round(Math.random() * itemsCount);
    }

    alg2(seed, window, itemsCount) {

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

    alg3(seed, window, itemsCount) {

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

    lastIds = [];
    alg4(seed, window, itemsCount) {

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

        while(this.lastIds.indexOf(id) !== -1) {
            seed++;
            id = getId();
        }

        this.lastIds.push(id);
        if (this.lastIds.length > 3) {
            this.lastIds = this.lastIds.splice(0, 1);
        }

        return id;
    }

    alg5(seed, window, itemsCount) {

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

        while(this.lastIds.indexOf(id) !== -1) {
            seed++;
            id = getId();
        }

        this.lastIds.push(id);
        if (this.lastIds.length > 9) {
            this.lastIds.splice(0, 1);
        }

        return id;
    }

    getStorageKey() {
        return 'state-' + this.dataKey;
    }
    saveState () {
        window.localStorage.setItem(this.getStorageKey(), JSON.stringify(this.state));
    }

    loadSavedState () {
        const stateStr = window.localStorage.getItem(this.getStorageKey());
        try {
            this.state = JSON.parse(stateStr);
            if (!this.state) {
                this.resetSavedState();
            }
        }
        catch (err) {
            console.warn(err);
            this.resetSavedState();
        }
    }

    resetSavedState () {
        this.state = {
            seed: 20,
            progress: 0,
            window: 20
        };
        this.saveState();
    }

    nextCard () {

        const totalCards = this.data.length - 1;
        const id = this.alg5(this.state.seed, this.state.window, totalCards);

        this.state.seed++;

        if (id === undefined) {
            return;
        }

        return this.changeCard(id);
    }

    prevCard () {

        this.state.seed--;

        if (this.state.seed <= 0) {
            return;
        }

        const totalCards = this.data.length - 1;
        const id = this.alg5(this.state.seed, this.state.window, totalCards);

        if (id === undefined) {
            return;
        }

        return this.changeCard(id);
    }

    changeCard (id) {
        const card = this.data[id];
        this.state.progress = this.state.seed / (this.data.length * 4) * 100;
        this.saveState();
        return card;
    }
}


export default AppLogic;
