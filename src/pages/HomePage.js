import React from 'react';
import './HomePage.css'


class HomePage extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: null,
            sets: []
        };
    }

    fetchListOfSets () {
        this.setState({
            ...this.state,
            isLoading: false,
            err: null,
        });

        fetch('./sets/_list.json')
            .then(res => res.json())
            .then(data => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    sets: (data?.sets || []).filter(x => x.hidden !== true)
                });
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    err: err.message,
                    sets: []
                });
            });
    }

    componentDidMount() {
        this.fetchListOfSets();
    }

    render() {
        return (
                <div className="vertical h-100 pa-24">
                    <h1>Наборы</h1>
                    { this.state.sets && this.state.sets.map( (set, idx) =>

                        <a onClick={ () => this.props.openCards(set.path) }
                              key={idx}
                              className="set-card"
                              style={{backgroundImage: `url(${set.pic})`}}>
                            <div className="set-card-name">{ set.name }</div>
                        </a>
                    )}
                </div>
            );
    }
}


export default HomePage;
