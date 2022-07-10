import './ProgressBar.css';

function ProgressBar (props) {
    return (
        <div className="progress-bar">
            <div className="bar" style={{'width': props.value + '%'}}>
                {props.label}
            </div>
        </div>
    );
}

export default ProgressBar;
