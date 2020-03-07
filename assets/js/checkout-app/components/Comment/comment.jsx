import React from 'react';
import InputContainer from '../InputContainer/input-container'
import styles from './comment.scss';

export default class Comment extends React.PureComponent {
    render() {
        return (
            <InputContainer
                id="3"
                label={ this.props.label }
                body={
                    <input
                        type="text"
                        id="3"
                        value={ this.props.customerMessage || '' }
                        onChange={ ({target})=>{console.log('target55',target.value);return this.props.onChange(target.value)} }
                        className={ styles.input } />
                } />
        );
    }
}
