import './App.css';
import '../layout.css';
import AppLogic from "../AppLogic";
import ProgressBar from './ProgressBar';
import Card from './Card';
import ListItem from './ListItem';
import React from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Grid,
    ThreeLineHorizontal,
    SettingsHorizontal,
} from 'akar-icons';


const appLogic = new AppLogic();


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showList: false,
            showSettings: false,
            progress: 10,
            progressLabel: 20,
            search: null,
            noCards: false,
            cards1: {w: 'word1', t: 'trans1'},
            cards2: {w: 'word2', t: 'trans2'},
            cards3: {w: 'word3', t: 'trans3'},
            cards4: {w: 'word4', t: 'trans4'},
        };

        this.init();
    }

    async init () {

        console.log('>>> init');

        appLogic.loadSavedState();
        await appLogic.loadFile('500-o.json');

        this.nextCard();
    }

    settings () {

        this.setState({
            ...this.state,
            showSettings: !(this.state.showSettings || false)
        });
    }

    reset () {
        appLogic.resetSavedState();
        this.nextCard();
    }

    prevCard () {

        const cards1 = appLogic.prevCard();
        const cards2 = appLogic.prevCard();
        const cards3 = appLogic.prevCard();
        const cards4 = appLogic.prevCard();

        this.setState({
            ...this.state,
            progress: appLogic.state.progress,
            progressLabel: appLogic.state.seed,
            noCards: !cards1 || !cards2 || !cards3 || !cards4,
            cards1,
            cards2,
            cards3,
            cards4,
        });
    }

    nextCard () {

        const cards1 = appLogic.nextCard();
        const cards2 = appLogic.nextCard();
        const cards3 = appLogic.nextCard();
        const cards4 = appLogic.nextCard();

        this.setState({
            ...this.state,
            progress: appLogic.state.progress,
            progressLabel: appLogic.state.seed,
            noCards: !cards1 || !cards2 || !cards3 || !cards4,
            cards1,
            cards2,
            cards3,
            cards4,
        });
    }

    toggleList () {
        this.setState({
            ...this.state,
            search: null,
            showList: !(this.state.showList || false)
        });
    }

    search (e) {
        const search = (e.target.value || '').trim().toLowerCase();
        this.setState({
            ...this.state,
            search: search !== '' ? search : null
        })
    }

    render() {
        return (
            <div className="app-container h-100">
                <header className="mb-24">
                    <ProgressBar value={this.state.progress} label={this.state.progressLabel / 4}>
                    </ProgressBar>
                </header>
                <main className="pa-16 vertical-scroll">

                {this.state.showList !== true && this.state.noCards === false &&
                    <div className="px-16">
                        <h1 className="page-title">500 <span>самых важных слов</span></h1>

                        <Card word={this.state.cards1.w} trans={this.state.cards1.t} example={this.state.cards1.e}></Card>
                        <Card word={this.state.cards2.w} trans={this.state.cards2.t} example={this.state.cards2.e}></Card>
                        <Card word={this.state.cards3.w} trans={this.state.cards3.t} example={this.state.cards3.e} flipped="true"></Card>
                        <Card word={this.state.cards4.w} trans={this.state.cards4.t} example={this.state.cards4.e} flipped="true"></Card>
                    </div>
                }

                {this.state.showList === true &&
                    <div>
                        <div>
                            <input className="list-search" type="text" placeholder="поиск" onChange={(e) => { this.search(e); }}/>
                        </div>

                        {appLogic.data && appLogic.data.filter(x => this.state.search === null || x.w.toLowerCase().indexOf(this.state.search) >= 0).map( (card,idx) =>

                            <ListItem key={idx} id={card.id} w={card.w} t={card.t}></ListItem>
                        )}
                    </div>
                }

                </main>

                <div className={this.state.showSettings ? 'settings-panel settings-panel--open' : 'settings-panel'}>
                    <strong>Настройки</strong>
                    <p>
                        <button onClick={() => { this.reset() }}>Сбросить прогресс</button>
                    </p>
                </div>

                <footer>
                    <button onClick={() => { this.settings() }}>
                        <SettingsHorizontal/>
                    </button>
                    <button onClick={() => { this.toggleList() }}>
                        {!this.state.showList && <ThreeLineHorizontal/> }
                        {this.state.showList && <Grid/> }
                    </button>
                    <button onClick={() => { this.prevCard() }}>
                        <ChevronLeft/>
                    </button>
                    <button onClick={() => { this.nextCard() }}>
                        <ChevronRight/>
                    </button>
                </footer>
            </div>
        );
    }
}

export default App;
