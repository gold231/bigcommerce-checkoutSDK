import React from 'react';
import { formatMoney } from 'accounting';
import ItemLine from "./ItemLine/item-line";
import styles from './cart.scss';
import Coupon from '../components/Coupon/coupon';

export default class Cart extends React.PureComponent {
    render() {
        const itemsCountNumber = this.props.checkout.cart.lineItems['physicalItems'].length + this.props.checkout.cart.lineItems['digitalItems'].length;
        let itemsCount='';

        if (itemsCountNumber<2) {
             itemsCount = <div className={ styles.itemsCount }>1 Item</div>;
        } else {
             itemsCount = <div className={ styles.itemsCount }>{itemsCountNumber} Items</div>;
        }
        
        return (
            <div className={ styles.container }>
                <div className={ styles.cartContainer }>
                    <div className={ styles.cartHeaderContainer }>
                        <div className={ styles.cartHeader }>
                            Order Summary
                        </div>

                        <a href={ this.props.cartLink } className={ styles.cartAction }>
                            Edit Cart
                        </a>
                    </div>
                    <div className={ styles.cartItemsContainer }>
                    {itemsCount}
                    { ['physicalItems', 'digitalItems', 'giftCertificates'].map((keyType) => (
                        (this.props.checkout.cart.lineItems[keyType] || []).map((item) => (
                            <ItemLine
                                key={ item.id }
                                label={ `${ item.quantity } x ${ item.name }` }
                                amount={ formatMoney(item.extendedSalePrice) }
                                imageUrl={ item.imageUrl }
                                itemType={ keyType }/>
                        ))
                    )) }
                    </div>
                </div>

                <div className={ styles.orderSummaryContent }>
                    <ItemLine
                        label={ 'Subtotal' }
                        amount={ formatMoney(this.props.checkout.subtotal) } />

                    <ItemLine
                        label={ 'Shipping' }
                        amount={ formatMoney(this.props.checkout.shippingCostTotal) } />

                    <ItemLine
                        label={ 'Tax' }
                        amount={ formatMoney(this.props.checkout.taxTotal) } />
                    
                    <Coupon
                        couponValue={ this.props.couponValue }
                        coupons={ this.props.coupons }
                        label="Coupon/Gift Card"
                        width="fullWidth"
                        onChange={ (value)=>this.props.onCouponChange(value) }
                        onclick={ this.props.onCouponApply }
                    />
                </div>
                <div className={ styles.grandTotalContainer }>
                    <div className={ styles.grandTotalLabel }>
                        Total ({this.props.checkout.cart['currency']['code']})
                    </div>

                    <div className={ styles.grandTotalAmount }>
                        { formatMoney(this.props.checkout.grandTotal) }
                    </div>
                </div>
            </div>
        );
    }
}
