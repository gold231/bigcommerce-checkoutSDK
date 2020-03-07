import React from 'react';
import styles from './section.scss';
import StepCounter from '../StepCounter/stepCounter';
import Button from '../Button/button';

export default class Section extends React.PureComponent {
    render() {
        let headerCenterContent = '';
        let editButton = '';
        let body = '';

        if (this.props.completed) {
            headerCenterContent=<div className={ styles.customerEmail }>{this.props.headerCenterContent}</div>;
            this.props.editButton? editButton=<Button buttonType="secondary" className={ styles.editButton } onClick={ () => this.props.edit() } label="Edit" /> : editButton=''
            body=<div className={ styles.body }>{ this.props.body }</div>;
        } else {
            body=<div className={ styles.body }>{ this.props.body }</div>;
        }

            return (
                <div className={ styles.section }>
                    <div className={ styles.headerContainer }>
                        
                        <StepCounter step={ this.props.step } completed={ this.props.completed }/>

                        <div className={ styles.headerContent }>
                            <div className={ styles.header }>
                                { this.props.header }
                            </div>
                            
                            { headerCenterContent }
                        </div>

                        { editButton }

                    </div>

                    { body }
                </div>
            );
    }
}
