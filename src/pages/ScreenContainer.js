import React from 'react';
import HomePage from "./HomePage";
import App from "../components/App";


class ScreenContainer extends React.Component  {

    constructor(props) {
        super(props);

        this.state = {
            screen: 'HOME',
            param: null
        };
    }

    openHome() {
        this.setState({
            ...this.state,
            screen: 'HOME',
            param: null
        });
    }

    openCards(param) {
        this.setState({
            ...this.state,
            screen: 'CARDS',
            param: param
        });
    }

    render() {
        return (
            <>
                { this.state.screen === 'HOME' && <HomePage openCards={(param) => this.openCards(param) }/> }
                { this.state.screen === 'CARDS' && <App openHome={() => this.openHome() } param={this.state.param}/> }
            </>
        )
    }
}


export default ScreenContainer;
