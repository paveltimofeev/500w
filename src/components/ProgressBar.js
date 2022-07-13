import './ProgressBar.css';

function ProgressBar (props) {
    return (
        <div className="progress-bar">
            <div className="bar" style={{'width': props.value + '%'}}>
                <span>{props.label}</span>
            </div>
        </div>
    );
}

export default ProgressBar;
