import React, { Fragment } from 'react';
import { find } from 'lodash';
import Section from '../components/Section/section';
import ShippingToggle from './shipping-toggle';
import SingleShipping from './single-shipping'
import MultiShipping from './multi-shipping'
import RadioContainer from '../components/RadioContainer/radio-container';
import RadioInput from '../components/RadioInput/radio-input';
import CheckboxInput from '../components/CheckboxInput/checkbox-input';

export default class Shipping extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            multiShipping: (this.props.consignments || []).length > 1,
            active: this.props.currentActiveSection==1? true:false,
            sameAsShippingAddress: true,
        };

                this._onSelect = this._onSelect.bind(this)
        
    }

    componentDidMount() {
        this.setState({ sameAsShippingAddress: this.props.sameAsShippingAddress });
    }

    componentDidUpdate() {
        // this.props.onSelect(this.state.sameAsShippingAddress);
    }

    render() {
        return (
            <Section
            completed={ this.props.completed }
            active={ this.state.active }
            step={ this.props.step }
            header={ 'Shipping' }
            editButton={ true }
            edit={ this.props.onEdit }
            body={
                <Fragment>
                    {
                        this._hasSavedAddresses() &&
                        this._hasMultiplePhysicalItems() &&
                        <ShippingToggle
                            onChange={ (value) => this._toggleMultiShipping(value) }
                            multiShipping={ this.state.multiShipping } />
                    }
                    {
                        this.state.multiShipping ?
                        <MultiShipping
                            customer={ this.props.customer }
                            consignments={ this.props.consignments }
                            cart={ this.props.cart }
                            isUpdatingConsignment={ this.props.isUpdatingConsignment }
                            isCreatingConsignments={ this.props.isCreatingConsignments }
                            isSelectingShippingOption={ this.props.isSelectingShippingOption }
                            cart={ this.props.cart }
                            onConsignmentUpdate={ this.props.onConsignmentUpdate }
                        /> :
                        <SingleShipping
                            countries={ this.props.countries }
                            address={ this.props.address }
                            onAddressChange={ this.props.onAddressChange }
                            selectedOption={ this.selectedOption}
                            selectedOptionId={ this.props.selectedOptionId }
                            options={ this.props.options }
                            isUpdatingShippingAddress={ this.props.isUpdatingShippingAddress }
                            isSelectingShippingOption={ this.props.isSelectingShippingOption }
                            onSelect={ this.props.onShippingOptionChange }
                            onShippingContinue={ this.props.onShippingContinue }
                            completed={ this.props.completed }
                            savedAddresses={ this.props.savedAddresses }
                            onSavedAddressSelect= { this.props.onSavedAddressSelect }
                            onUpdateComment={ (target) => this.props.onUpdateComment(target) }
                            customerMessage={ this.props.customerMessage }
                        />
                    }
                    { !this.props.multishipping && this.props.shippingSectionVisible &&
                    <RadioContainer
                        label={ '' }
                        body={
                            <CheckboxInput
                                name={ 'sameAsShippingAddress' }
                                label={ 'My Billing address is the same as my Shipping address' }
                                value={ this.props.sameAsShippingAddress? 'true':'false' }
                                checked={ this.props.sameAsShippingAddress }
                                onChange={ ( event ) => {console.log('event',event.target.checked); this._onSelect(event.target.checked)} } />
                        } />
                    }
                </Fragment>
            } />
        );
    }

    _toggleMultiShipping(multiShipping) {
        this.setState({ multiShipping });
    }

    _hasSavedAddresses() {
        return this.props.customer.addresses &&
            this.props.customer.addresses.length > 1;
    }

    _hasMultiplePhysicalItems() {
        return this.props.cart.lineItems.physicalItems.length > 1;
    }

    _onChange(fieldName, value) {
        const address = Object.assign(
            {},
            this.state.address,
            { [fieldName]: value }
        );

        this.setState({ address: address });
    }

    _onSelect(value) {
        console.log('value',value)
        let actualValue = false;

        if (value=='checked') {
            actualValue=true;
        } 

        this.props.onSelect(value);
    }
}
