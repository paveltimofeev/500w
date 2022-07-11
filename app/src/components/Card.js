import React from 'react';
import './Card.css';
import play from "../speech";
import {BookOpen, ChevronHorizontal, LinkOut, MoreVerticalFill, Play} from "akar-icons";


class Card extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flipped: props.flipped === 'true',
            showButtons: false
        };
    }

    flipCard () {
        this.setState({
            ...this.state,
            flipped: !this.state.flipped
        });
    }

    toggleButtons (e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            ...this.state,
            showButtons: !this.state.showButtons
        })
    }

    prevPlayedWord = null;
    async playWord (e, word) {
        e.preventDefault();
        e.stopPropagation();

        const speed = this.prevPlayedWord !== word ? .8: .5;
        await play(word, 'es', 1, speed);
        this.prevPlayedWord = this.prevPlayedWord !== word ? word : null;
    }

    render() {
        return (
            <div className={this.state.flipped ? 'card card--flipped' : 'card'}
                 onClick={() => { this.flipCard(); }}>
                <div className="w">
                    <div>{ this.props.word }</div>
                    {this.props.example && <div className="e">{ this.props.example }</div>}
                </div>
                <div className="t">{ this.props.trans }</div>
                <div className={!this.state.showButtons ? 'play-btn' : 'play-btn play-btn--open'}>
                    <a href={'https://www.multitran.com/m.exe?l1=5&l2=2&s=' + this.props.word} target="_blank" rel="noopener noreferrer" className="btn--hidden">
                        <BookOpen size={20}/>
                        <span>Словарь</span>
                    </a>
                    <a href={'https://context.reverso.net/translation/spanish-russian/' + this.props.word} target="_blank" rel="noopener noreferrer" className="btn--hidden">
                        <LinkOut size={20}/>
                        <span>Примеры</span>
                    </a>
                    <span className="btn--hidden" onClick={(e) => { this.playWord(e, this.props.word); }}>
                        <Play size={20}/>
                        <span>Произн.</span>
                    </span>
                    <span className="btn--visible" onClick={(e) => { this.toggleButtons(e); }}><MoreVerticalFill size={20}/></span>
                </div>
            </div>
        );
    }
}

export default Card;
