import React, { Fragment } from 'react';
import styles from './billing-address-summary.scss';
import { formatMoney } from 'accounting';

export default class BillingAddressSummary extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            completed: false
        };
    }

    componentDidMount() {
        console.log('shipping summary mounted')
    }

    render() {
        // console.log('this.props.selectedOptionId',this.props.selectedOptionId)
        // console.log('this.props.options',this.props.options)
        const selectedOptionId = this.props.selectedOptionId;
        let selectedShippingOption = '';

        this.props.options.map((option) => {
            if (option['id'] == selectedOptionId) selectedShippingOption=option;
        });

        const billingDescription = selectedShippingOption.description;

        let address2 = this.props.address.address2;
        
        if (address2!='') address2 = ' - ' + address2;

        return(<div className={ styles.addressSummary }>
            <div>{ this.props.address.firstName }&nbsp;{ this.props.address.lastName }</div>
            <div>{ this.props.address.phone }</div>
            <div>{ this.props.address.address1 } {address2} </div>
            <div>{ this.props.address.city }, { this.props.address.stateOrProvince }, { this.props.address.postalCode }/{ this.props.address.country }</div>
            <div>{ billingDescription }</div>
        </div>)
    }
}
