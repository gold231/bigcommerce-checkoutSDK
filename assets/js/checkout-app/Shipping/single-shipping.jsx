import React, { Fragment } from 'react';
import { debounce } from 'lodash';
import Address from '../components/Address/address';
import ShippingOptions from './shipping-options';
import Button from '../components/Button/button';
import ShippingAddressSummary from '../components/ShippingAddressSummary/shippingAddressSummary';
import Comment from '../components/Comment/comment';

export default class SingleShipping extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            address: {},
        };

        this._debouncedOnAddressChange = debounce(() => this.props.onAddressChange(this.state.address), 1000);
    }

    componentDidMount() {
        console.log('props',this.props)
        this.props.onAddressChange(this.props.address);
        this.setState({ address: this.props.address || {} });
    }

    componentDidUpdate() {
        // console.log('this.props.completed 2',this.props.completed)       
    }

    render() {
        return(
            <Fragment>
                {this.props.completed &&
                    <Fragment>
                        <ShippingAddressSummary 
                            address={ this.state.address }
                            selectedOption={ this.props.selectedOption }
                            selectedOptionId={ this.props.selectedOptionId }
                            options={ this.props.options } />
                    </Fragment>
                }

                {!this.props.completed && 
                    <Fragment>
                        <Address
                            name={ 'shipping' }
                            address={ this.state.address }
                            countries={ this.props.countries }
                            onChange={ (fieldName, address) => this._onChange(fieldName, address) }
                            savedAddresses={ this.props.savedAddresses }
                            onSavedAddressSelect= { (address) => { this.savedAddressSelectHandler(address) } } />
                        <Comment
                            onChange={(target) => this.props.onUpdateComment(target) }
                            customerMessage={ this.props.customerMessage }
                            label="Order Comments"
                        />
                        <ShippingOptions
                            options={ this.props.options }
                            selectedOption= {this.props.selectedOption }
                            selectedOptionId={ this.props.selectedOptionId }
                            isSelectingShippingOption={ this.props.isSelectingShippingOption() }
                            isUpdatingShippingAddress={ this.props.isUpdatingShippingAddress() }
                            onSelect={ this.props.onSelect }
                        />
                        <Button buttonType='signIn' label="CONTINUE" onClick={ () => this.props.onShippingContinue() } />
                    </Fragment>
                }
            </Fragment>
        )
    }

    savedAddressSelectHandler(address) {
        Object.keys(address).map((fieldName) => {
            const value = address[fieldName];

            this._onChange(fieldName, value)
        })
    }

    _onChange(fieldName, value) {
        console.log(fieldName, value)
        const address = Object.assign(
            {},
            this.state.address,
            { [fieldName]: value }
        );
        this.props.onAddressChange(address);
        this.setState({ address: address }, () => this._updateShippingAddress(fieldName));
    }

    _updateShippingAddress(fieldName) {
        if (this._shouldUpdateShippingAddress(fieldName)) {
            this._debouncedOnAddressChange();
        }
    }

    _isFormValid() {
        return this.state.address.firstName &&
            this.state.address.lastName &&
            this.state.address.address1 &&
            this.state.address.city &&
            this.state.address.postalCode &&
            (
                this.state.address.stateOrProvinceCode ||
                this.state.address.stateOrProvince
            ) &&
            this.state.address.countryCode &&
            this.state.address.phone;
    }

    _shouldUpdateShippingAddress(fieldName) {
        const shippingOptionUpdateFields = [
            'address1',
            'address2',
            'city',
            'postalCode',
            'stateOrProvince',
            'stateOrProvinceCode',
            'countryCode',
        ];

        if (!this._isFormValid()) {
            return false;
        }

        return (
            !this.props.options ||
            !this.props.options.length ||
            shippingOptionUpdateFields.includes(fieldName)
        );
    }
}
