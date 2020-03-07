import React from 'react';
import styles from './checkbox-container.scss';

export default class CheckboxContainer extends React.PureComponent {
    render() {
        return (
            <div className={ styles.container }>
                <div className={ styles.label }>
                    { this.props.label }
                </div>

                { this.props.body }
            </div>
        );
    }
}
