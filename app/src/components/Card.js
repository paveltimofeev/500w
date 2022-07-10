import React from 'react';
import './Card.css';
import play from "../speech";


class Card extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            flipped: props.flipped === 'true'
        };
    }

    flipCard () {
        this.setState({
            ...this.state,
            flipped: !this.state.flipped
        });
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
                    <div>
                        { this.props.word }
                    </div>
                    { this.props.example &&
                        <div className="e">
                            { this.props.example }
                        </div>
                    }
                </div>
                <span className="t">{ this.props.trans }</span>
                <span className="play-btn"
                      onClick={(e) => { this.playWord(e, this.props.word); }}>
                    &#9654;
                </span>
            </div>
        );
    }
}

export default Card;
