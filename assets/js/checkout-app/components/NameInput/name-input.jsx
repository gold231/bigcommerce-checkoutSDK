import React from 'react';
import InputContainer from '../InputContainer/input-container'
import styles from './name-input.scss';

export default class NameInput extends React.PureComponent {
    render() {
        return (
            <InputContainer
                id={ this.props.id }
                label={ this.props.label }
                width={ this.props.width }
                body={
                    <input
                        type="text"
                        id={ this.props.id }
                        value={ this.props.value || '' }
                        required
                        onChange={ this.props.onChange }
                        className={ styles.input } />
                } />
        );
    }
}
