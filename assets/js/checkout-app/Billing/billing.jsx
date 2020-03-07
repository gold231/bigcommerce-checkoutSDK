import React, { Fragment } from 'react';
import Address from '../components/Address/address';
import RadioContainer from '../components/RadioContainer/radio-container';
import RadioInput from '../components/RadioInput/radio-input';
import Section from '../components/Section/section';
import Comment from '../components/Comment/comment';
import Button from '../components/Button/button';
import BillingAddressSummary from '../components/BillingAddressSummary/billing-address-summary';

export default class Billing extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            address: {},
            shippingAddress_billing: {}
            // sameAsShippingAddress: true,
        };
    }

    componentDidMount() {
        this.setState({ address: this.props.address || {} });
        this.setState({shippingAddress_billing: this.props.shippingAddress_billing || {} });
        // this.setState({ sameAsShippingAddress: this.props.sameAsShippingAddress });
    }

    componentDidUpdate() {
        this.props.onChange(this.state.address);
        // this.props.onSelect(this.state.sameAsShippingAddress);
        // console.log('this.state.sameAsShippingAddress',this.state.sameAsShippingAddress)
    }

    render() {
        return (
            <Section
                completed={ this.props.completed }
                active={ this.state.active }
                header={ 'Billing' }
                step={ this.props.step }
                editButton={ true }
                edit={ this.props.onEdit }
                body={
                    <Fragment>
                        {this.props.completed &&
                            <Fragment> 
                                { (
                                    this.props.sameAsShippingAddress === true 
                                ) &&
                                    <BillingAddressSummary 
                                        address={ this.props.shippingAddress_billing }
                                        selectedOption={ this.props.selectedOption }
                                        selectedOptionId={ this.props.selectedOptionId }
                                        options={ this.props.options } />
                                }
                                { (
                                    this.props.sameAsShippingAddress === false
                                ) &&
                                    <BillingAddressSummary 
                                    address={ this.state.address }
                                    selectedOption={ this.props.selectedOption }
                                    selectedOptionId={ this.props.selectedOptionId }
                                    options={ this.props.options } />
                                }
                            </Fragment>
                        }
                        {!this.props.completed &&
                            <Fragment>
                                { (
                                    this.props.sameAsShippingAddress === true && this.props.options 
                                ) &&
                                    <BillingAddressSummary 
                                        address={ this.props.shippingAddress_billing }
                                        selectedOption={ this.props.selectedOption }
                                        selectedOptionId={ this.props.selectedOptionId }
                                        options={ this.props.options } />
                                }
                                { (
                                    this.props.sameAsShippingAddress === false ||
                                    this.props.multishipping || !this.props.shippingSectionVisible
                                ) &&
                                    <Address
                                        name={ 'billing' }
                                        address={ this.state.address }
                                        countries={ this.props.countries }
                                        savedAddresses={ this.props.savedAddresses }
                                        onChange={ (fieldName, address) => this._onChange(fieldName, address) } />
                                }
                                { !this.props.shippingSectionVisible &&
                                    <Comment
                                        onChange={(target) => this.props.onUpdateComment(target) }
                                        customerMessage={ this.props.customerMessage }
                                        label="Order Comments"
                                    />
                                }
                                { (
                                    this.props.sameAsShippingAddress === false ||
                                    this.props.multishipping || !this.props.shippingSectionVisible
                                ) &&
                                    <Button buttonType='signIn' label="CONTINUE" onClick={ () => this.props.onBillingContinue() } />
                                }
                            </Fragment>
                        }
                    </Fragment>
                } />
        );
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
        const actualValue = (value === 'true');

        this.setState({ sameAsShippingAddress: actualValue });
    }
}
