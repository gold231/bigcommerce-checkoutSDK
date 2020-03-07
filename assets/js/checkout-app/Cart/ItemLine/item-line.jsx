import React from 'react';
import styles from './item-line.scss';

export default class ItemLine extends React.PureComponent {
    render() {
        let itemType = '';

        switch (this.props.itemType) {
            case 'physicalItems':
                itemType='Physical Item';
                break;
            
            case 'digitalItems':
                itemType='Digital Item';
                break;
        
            default:
                break;
                itemType='';
        }

        return (
            <div className={ styles.container }>
                <div className={ styles.labelContainer }>
                    { this.props.imageUrl &&
                        <img
                            src={ this.props.imageUrl }
                            className={ styles.image }/>
                    }
                    <div className={ styles.itemInfoContainer}>
                        <div className={ styles.label }>
                            <div> { this.props.label } </div>
                        </div>
                        <div className={ styles.itemType }>
                            <div> { itemType } </div>
                        </div>
                    </div>
                </div>

                <div className={ styles.amount }>
                    { this.props.amount }
                </div>
            </div>
        );
    }
}
