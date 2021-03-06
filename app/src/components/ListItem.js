import React from 'react';
import './ListItem.css';
import play from '../speech';
import {Play} from "akar-icons";

class ListItem extends React.Component {

    async playHandler() {
        await play(this.props.w);
    }

    render() {
        return (
            <div className="list-item flex-between">
                <div className="flex-fill">
                    <span className="item-id">{ this.props.id }.</span>
                    <span className="item-w">{ this.props.w }</span>
                    <span className="item-t">{ this.props.t }</span>
                </div>
                <div>
                    <span className="play-btn"
                          onClick={() => { this.playHandler() }}>
                        <Play size={16}/>
                    </span>
                </div>
            </div>
        )
    }
}

export default ListItem;
