import React from 'react';
import InputContainer from '../InputContainer/input-container'
import Button from '../Button/button';
import styles from './coupon.scss';

export default class Coupon extends React.PureComponent {
    render() {
        
        let couponLabel='';

        if(this.props.coupons && this.props.coupons.length>0){
            couponLabel = <label
                            htmlFor={ this.props.id }
                            className={ styles.label }>
                            Coupons
                        </label>
        }

        return (
            <div className={ styles.couponContainer }>
                { couponLabel }
                <ul className={ styles.couponsList }>
                {
                    this.props.coupons.map( (coupon)=> {
                        if (coupon && coupon.id ) {
                            return <li id={ coupon['id'] }>{ coupon['displayName'] }</li>}    
                        }
                        )
                }
                </ul>
                <label
                    htmlFor={ this.props.id }
                    className={ styles.label }>
                    { this.props.label } { this.props.helpText && <span className={ styles.helpText }>({ this.props.helpText })</span> }
                </label>
                <div className={ styles.inputContainer }>
                    <input
                        type="text"
                        id={ this.props.id }
                        value={ this.props.couponValue || '' }
                        required
                        onChange={ (event) => this.props.onChange(event.target.value) }
                        className={ styles.input }
                    />
                    <Button buttonType="secondary" className={ styles.applyButton } onClick={()=> this.props.onclick() } label="Apply" />
                </div>
            </div>
        );
    }
}
