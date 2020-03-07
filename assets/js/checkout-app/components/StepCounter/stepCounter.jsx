import React from 'react';
import styles from './stepCounter.scss';

export default class StepCounter extends React.PureComponent {
    render() {
    	let step = this.props.step;
    	
    	if (this.props.completed) {
    		step=<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>;
    	} 
    	
    	return(
    		<div className={ styles.stepCounter }>
                { step }
            </div>
    		);
    }
}
