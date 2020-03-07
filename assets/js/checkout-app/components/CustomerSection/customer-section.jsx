import React from 'react';
import styles from './section.scss';
import StepCounter from '../StepCounter/stepCounter';
import Button from '../Button/button';

export default class Section extends React.PureComponent {
    render() {
        let customerEmail = '';
        let editButton = '';
        let customerSectionBody = '';

        if (this.props.completed) {
            customerEmail=<div className={ styles.customerEmail }>{this.props.customerEmail}</div>;
            this.props.editButton? editButton=<Button buttonType="secondary" className={ styles.editButton } onClick={ () => this.props.edit() } label="Edit" /> : editButton=''
        } else {
            customerSectionBody=<div className={ styles.body }>{ this.props.body }</div>;
        }

            return (
                <div className={ styles.section }>
                    <div className={ styles.headerContainer }>
                        
                        <StepCounter step="1" completed={ this.props.completed }/>

                        <div className={ styles.headerContent }>
                            <div className={ styles.header }>
                                Customer
                            </div>
                            
                            { customerEmail }
                        </div>
                        { editButton }

                    </div>

                    { customerSectionBody }
                </div>
            );
    }
}
