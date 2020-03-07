import React from 'react';
import styles from './checkbox-input.scss';

export default class CheckboxInput extends React.PureComponent {
    render() {
        return (
            <label className={ this.props.isLoading ? `${styles.container} ${styles.loadingState}` : styles.container }>
                <input
                    type="checkbox"
                    name={ this.props.name }
                    value={ this.props.value }
                    checked={ this.props.checked }
                    disabled={ this.props.isLoading }
                    onChange={ (event)=>this.props.onChange(event) }
                    className={ styles.input } />
                { this.props.label }
            </label>
        );
    }
}
