import React from 'react';
import styles from './button.scss';
import classNames from 'classnames';

export default class Button extends React.PureComponent {
    render() {
        return (
            <button
                type="button"
                disabled={ this.props.isLoading }
                onClick={ this.props.onClick }
                className={ classNames(styles.button, styles[this.props.isLoading ? `${styles.loadingState}` : styles.button], styles[this.props.buttonType]) }
                >
                { this.props.label }
            </button>
        );
    }
}
