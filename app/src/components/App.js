import './App.css';
import '../layout.css';
import AppLogic from "../AppLogic";
import ProgressBar from './ProgressBar';
import Card from './Card';
import ListItem from './ListItem';
import React from 'react';


const appLogic = new AppLogic();


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showList: false,
            progress: 10,
            progressLabel: 20,
            search: null,
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
        await appLogic.loadFile('500.json');

        this.nextCard();
    }

    reset () {
        appLogic.resetSavedState();
        this.nextCard();
    }

    prevCard () {
        this.setState({
            ...this.state,
            progress: appLogic.state.progress,
            progressLabel: appLogic.state.seed,
            cards1: appLogic.prevCard(),
            cards2: appLogic.prevCard(),
            cards3: appLogic.prevCard(),
            cards4: appLogic.prevCard(),
        });
    }

    nextCard () {
        this.setState({
            ...this.state,
            progress: appLogic.state.progress,
            progressLabel: appLogic.state.seed,
            cards1: appLogic.nextCard(),
            cards2: appLogic.nextCard(),
            cards3: appLogic.nextCard(),
            cards4: appLogic.nextCard(),
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
                    <ProgressBar value={this.state.progress} label={this.state.progressLabel}>
                    </ProgressBar>
                </header>
                <main className="pa-16 vertical-scroll">

                {this.state.showList !== true &&
                    <div>
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

                <footer className="pa-16">
                    <button onClick={() => { this.reset() }}>Reset</button>
                    <button onClick={() => { this.toggleList() }}>
                        { this.state.showList ? 'Cards' : 'List' }
                    </button>
                    <button className="flex-fill" onClick={() => { this.prevCard() }}>Back</button>
                    <button className="flex-fill" onClick={() => { this.nextCard() }}>Next</button>
                </footer>
            </div>
        );
    }
}

export default App;
