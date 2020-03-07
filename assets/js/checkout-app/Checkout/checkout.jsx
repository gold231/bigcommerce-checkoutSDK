import React, { Fragment } from 'react';
import { formatMoney } from 'accounting';
import { createCheckoutService } from '@bigcommerce/checkout-sdk';
import Panel from '../components/Panel/panel';
import SubmitButton from '../components/SubmitButton/submit-button';
import Billing from '../Billing/billing';
import Cart from '../Cart/cart';
import Customer from '../Customer/customer';
import Payment from '../Payment/payment';
import Shipping from '../Shipping/shipping';
import Layout from './Layout/layout';
import LoadingState from './LoadingState/loading-state';
import styles from './checkout.scss';
import regeneratorRuntime from "regenerator-runtime";

// If you want to use the provided css
// import 'react-google-places-autocomplete/dist/assets/index.css';

export default class Checkout extends React.PureComponent {
    constructor(props) {
        super(props);

        this.service = createCheckoutService();

        this.state = {
            isPlacingOrder: false,
            showSignIn: false,
            showSignUp: false,
            currentActiveSection: 0,
            customerSectionCompleted: false,
            shippingSectionCompleted: false,
            paymentSectionCompleted: false,
            billingSectionCompleted: false,
            shippingSectionVisible: true,
            customerMessage: '',
            billingAddressSameAsShippingAddress: true,
            couponValue: '',
        };
    }

    componentDidMount() {
        Promise.all([
            this.service.loadCheckout(),
            this.service.loadShippingCountries(),
            this.service.loadShippingOptions(),
            this.service.loadBillingCountries(),
            this.service.loadPaymentMethods(),
        ]).then(() => {
            this.unsubscribe = this.service.subscribe((state) => {
                this.setState(state);
            });
        });
        
        //google maps
        const googleMapScript = document.createElement('script');

        googleMapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD7Q3N-PiEgcvyYMlkJ0k2Bl1rpG_eCh24&libraries=places';
        window.document.body.appendChild(googleMapScript);
        
        // const state = this.service.getState().data.getCheckout().customerMessage;
// console.log('this.service.getState().data.getCheckout().customerMessage',state)
        // this.setState({ customerMessage: this.service.getState().data.getCheckout().customerMessage })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidUpdate() {
        if (this.state.data.getCart().lineItems.physicalItems.length) {
            this.setState({ shippingSectionVisible: true })
        } else {
            this.setState({ shippingSectionVisible: false })
        }
    }

    customerSignInCancelHandler() {

    }

    customerSignInCancelHandler() {
        
    }

    async postData(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Accept': 'application/json',
        //   'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return await response.json(); // parses JSON response into native JavaScript objects
    }

    


    customerSignIn() {
        this.postData('https://www.joyoushealth.com/encpwd.php',{ raw_password:this.state.customer.raw_password })
          .then((data) => {
            let pass=data['password'];

            this.postData('https://www.joyoushealth.com/bccustomerlogin.php', { email: this.state.customer.email, password:pass })
              .then((data) => {
                if (data['message']=='success') {
              	// console.log('RESPONSE: SUCCESS')

                    this.setState({showSignIn:false});
                    // const state = await this.service.signInCustomer({ email: 'foo@bar.com', password: 'password123' });
                    (async () => {
                        const payload = {
                            email: this.state.customer.email,
                            password: pass
                        };

                        const state = await this.service.signInCustomer(payload)
                        .then((res) => {
                        })
                        
                       // console.log('res',state)

                        })();
                    
                } else {
	              	console.log('RESPONSE: FAIL', data)
                }
                // on success => log in the customer through SDK

                // on failure => show error message
            });
      
          });
    }

    customerSignUp() {
        let that = this;
            this.postData('https://www.joyoushealth.com/bccustomersignup.php', { "name": this.state.customer.name, "email": this.state.customer.email, "raw_password":this.state.customer.raw_password })
              .then((data) => {
                // console.log('customer signup', data)
                if (data['message']=='success') {
                	// console.log('signup success', data);
                    that.setState({showSignUp:false});
                    that.customerSignIn();
                   
                    (async () => {
                        const payload = {
                            name: that.state.customer.name,
                            email: that.state.customer.email,
                            raw_password: that.state.customer.raw_password
                        };
                        
                        const state = await that.service.signInCustomer(payload)
                        .then((res) => {
                            
                        })
                    })();
                    
                } 
            });
    }

    confirmShippingAddress() {
        const firstName = this.state.shippingAddress.firstName;
        const lastName = this.state.shippingAddress.lastName;
        const company = this.state.shippingAddress.company;
        const address1 = this.state.shippingAddress.address1;
        const address2 = this.state.shippingAddress.address2;
        const city = this.state.shippingAddress.city;
        const stateOrProvince = this.state.shippingAddress.stateOrProvince;
        const stateOrProvinceCode = this.state.shippingAddress.stateOrProvinceCode;
        const postalCode = this.state.shippingAddress.postalCode;
        const country = this.state.shippingAddress.country;
        const phone = this.state.shippingAddress.phone;
        const countryCode = this.state.shippingAddress.countryCode;
        const shippingoption = $("input[name='shippingOptionundefined']:checked"). val();


        if (firstName=='' || lastName=='' || address1=='' || city=='' || stateOrProvinceCode=='' || postalCode=='' || countryCode=='' || shippingoption==undefined )  {
            alert('show error msg missing fields');
        } else {
            this.setState({ shippingSectionCompleted: true, currentActiveSection: ++this.state.currentActiveSection });
        }
    }

    confirmBillingAddress() {
        
        const firstName = this.state.billingAddress.firstName;
        const lastName = this.state.billingAddress.lastName;
        const company = this.state.billingAddress.company;
        const address1 = this.state.billingAddress.address1;
        const address2 = this.state.billingAddress.address2;
        const city = this.state.billingAddress.city;
        const stateOrProvince = this.state.billingAddress.stateOrProvince;
        const stateOrProvinceCode = this.state.billingAddress.stateOrProvinceCode;
        const postalCode = this.state.billingAddress.postalCode;
        const country = this.state.billingAddress.country;
        const phone = this.state.billingAddress.phone;
        const countryCode = this.state.billingAddress.countryCode;

        console.log('firstName',firstName)
        console.log('lastName',lastName)
        console.log('company',company)
        console.log('address1',address1)
        console.log('city',city)
        console.log('stateOrProvince',stateOrProvince)

        if (firstName=='' || lastName=='' || address1=='' || city=='' || stateOrProvinceCode=='' || postalCode=='' || countryCode=='' )  {
            alert('show error msg missing fields');
        } else {
            this.setState({ billingSectionCompleted: true, currentActiveSection: ++this.state.currentActiveSection });
        }
    }

    savedAddressSelectHandler(address) {
        console.log('savedAddressSelectHandler address',address)
    }

    updateComment(customerMessage) {
        this.setState({ customerMessage });
        this.service.updateCheckout({ customerMessage: customerMessage });
    }

    async validateCoupon(coupon) {
        // await this.state.data.getOrder()
        //             .then((res)=> console.log('res',res)
        //             )
        // this.setState({ couponValue: coupon });

        // console.log('validate coupon', coupon)
        // this.service.applyCoupon(coupon)
        //                     .then((data)=>{console.log('SUCCESS: COUPON VALID')})
        //                     .catch((error)=>{console.log('FAIL: COUPON NOT VALID',coupon)})

        

        // return this.state.data;
    }

    applyCoupon() {
        this.service.applyCoupon(this.state.couponValue)
            .then( (data)=>{ console.log('SUCCESS: COUPON VALID')} )
            .catch( (error)=>{ console.log('FAIL: COUPON NOT VALID',this.state.couponValue)})
    
    }

    render() {
        const { data, errors, statuses } = this.state;
        
        if (!data) {
            return (
                <Layout body={
                    <LoadingState />
                } />
            );
        }
        
        return (
            <Layout body={
                <Fragment>
                    <div className={ styles.body }>
                        <Panel body={
                            <form onSubmit={ (event) => this._submitOrder(event, data.getCustomer().isGuest) }>
                                <Customer
                                    customer={ data.getCustomer() }
                                    billingAddress={ data.getBillingAddress() }
                                    isSigningOut={ statuses.isSigningOut() }
                                    showSignIn={ this.state.showSignIn }
                                    showSignUp={ this.state.showSignUp }
                                    onClick={ () => this.service.signOutCustomer()
                                        .then(() => this.service.loadShippingOptions()) }
                                    onChange={ (customer) => this.setState({ customer }) }
                                    onSignInAction={ () => this.customerSignIn() }
                                    onSignUpAction={ () => this.customerSignUp() }
                                    onCancelSignIn={ () => this.setState({ showSignIn:false }) }
                                    onCancelSignUp={ () => this.setState({ showSignUp:false }) }
                                    onSignIn={ () => this.setState({ showSignIn: true, showSignUp: false }) }
                                    onSignUp={ () => this.setState({ showSignIn: false, showSignUp: true}) }
                                    currentActiveSection={ this.state.currentActiveSection }
                                    completed={ this.state.customerSectionCompleted }
                                    step="1"
                                />
                                {this.state.shippingSectionVisible &&
                                <Shipping
                                    currentActiveSection={ this.state.currentActiveSection }
                                    completed={ this.state.shippingSectionCompleted }
                                    customer={ data.getCustomer() }
                                    consignments={ data.getConsignments() }
                                    cart={ data.getCart() }
                                    isUpdatingConsignment={ statuses.isUpdatingConsignment }
                                    isCreatingConsignments={ statuses.isCreatingConsignments }
                                    isUpdatingShippingAddress={ statuses.isUpdatingShippingAddress }
                                    address={ data.getShippingAddress() }
                                    countries={ data.getShippingCountries() }
                                    options={ data.getShippingOptions() }
                                    selectedOption={ data.getSelectedShippingOption() ? data.getSelectedShippingOption() : '' }
                                    selectedOptionId={ data.getSelectedShippingOption() ? data.getSelectedShippingOption().id : '' }
                                    isSelectingShippingOption ={ statuses.isSelectingShippingOption }
                                    shippingSectionVisible= { this.state.shippingSectionVisible }
                                    onShippingOptionChange={ (optionId) => this.service.selectShippingOption(optionId) }
                                    onSelect ={ (billingAddressSameAsShippingAddress) => {console.log('billingAddressSameAsShippingAddress',billingAddressSameAsShippingAddress);this.setState({ billingAddressSameAsShippingAddress })}  }
                                    onConsignmentUpdate={ (consignment) => (
                                        consignment.id ?
                                            this.service.updateConsignment(consignment) :
                                            this.service.createConsignments([consignment])
                                        )
                                    }
                                    sameAsShippingAddress={
                                        (this.state.billingAddressSameAsShippingAddress === undefined) ||
                                        this.state.billingAddressSameAsShippingAddress
                                    }
                                    onAddressChange={ (shippingAddress) => {
                                        this.setState({ shippingAddress })
                                        this.service.updateShippingAddress(shippingAddress)
                                    }}
                                    multishipping={ (data.getConsignments() || []).length > 1 }
                                    onShippingContinue={ () => this.confirmShippingAddress() }
                                    onEdit={ () => this.setState({ shippingSectionCompleted: false, currentActiveSection: --this.state.currentActiveSection }) }
                                    step="2"
                                    savedAddresses={ data.getCustomer().addresses? data.getCustomer().addresses : [] }
                                    onSavedAddressSelect= { (address) => {
                                        this.setState({ address })
                                        this.service.updateShippingAddress(address)
                                    }}
                                    customerMessage={ this.state.customerMessage }
                                    onUpdateComment={ 
                                        (message) => {
                                            this.updateComment(message)
                                            this.setState({ customerMessage: message})
                                        }}
                                    />
                                }

                                <Billing
                                    currentActiveSection={ this.state.currentActiveSection }
                                    completed={ this.state.billingSectionCompleted }
                                    multishipping={ (data.getConsignments() || []).length > 1 }
                                    address={ data.getBillingAddress() }
                                    shippingAddress_billing={ data.getShippingAddress() }
                                    savedAddresses={ data.getCustomer().addresses? data.getCustomer().addresses : [] }
                                    onEdit={ () => this.setState({ billingSectionCompleted: false, currentActiveSection: --this.state.currentActiveSection }) }
                                    options={ data.getShippingOptions() }
                                    countries={ data.getBillingCountries() }
                                    shippingSectionVisible= { this.state.shippingSectionVisible }
                                    sameAsShippingAddress={
                                        (this.state.billingAddressSameAsShippingAddress === undefined) ||
                                        this.state.billingAddressSameAsShippingAddress
                                    }
                                    onChange ={ (billingAddress) => this.setState({ billingAddress }) }
                                    onSelect ={ (billingAddressSameAsShippingAddress) => this.setState({ billingAddressSameAsShippingAddress })  }
                                    onBillingContinue={ () => this.confirmBillingAddress()}
                                    step={ this.state.shippingSectionVisible? "3":"2" }
                                    customerMessage={ this.state.customerMessage }
                                    onUpdateComment={ 
                                        (message) => {
                                            this.updateComment(message)
                                            this.setState({ customerMessage: message})
                                        }}
                                    />
                                
                                <Payment
                                    currentActiveSection={ this.state.currentActiveSection }
                                    completed={ this.state.paymentSectionCompleted }
                                    errors={ errors.getSubmitOrderError() }
                                    methods={ data.getPaymentMethods() }
                                    onClick={ (name, gateway) => this.service.initializePayment({ methodId: name, gatewayId: gateway }) }
                                    onChange={ (payment) => this.setState({ payment }) }
                                    step={ this.state.shippingSectionVisible? "4":"3" } />
                                
                                <div className={ styles.actionContainer }>
                                    <SubmitButton
                                        label={ this._isPlacingOrder() ?
                                            'Placing your order...' :
                                            `Pay ${ formatMoney((data.getCheckout()).grandTotal) }`
                                        }
                                        isLoading={ this._isPlacingOrder() } />
                                </div>
                            </form>
                        } />
                    </div>

                    <div className={ styles.side }>
                        <Cart
                            checkout={ data.getCheckout() }
                            cartLink={ (data.getConfig()).links.cartLink }
                            couponValue={ this.state.couponValue }
                            coupons={ data.getCoupons() }
                            onCouponChange={ (couponValue)=> { this.setState({ couponValue }) }}
                            onCouponApply={ () => this.applyCoupon() }
                                            
                         />
                    </div>
                </Fragment>
            } />
        );
    }

    _isPlacingOrder() {
        const { statuses } = this.state;

        return this.state.isPlacingOrder && (
            statuses.isSigningIn() ||
            statuses.isUpdatingShippingAddress() ||
            statuses.isUpdatingBillingAddress() ||
            statuses.isSubmittingOrder()
        );
    }

    _submitOrder(event, isGuest) {
        let billingAddressPayload = this.state.billingAddressSameAsShippingAddress ?
            this.state.shippingAddress :
            this.state.billingAddress;

        billingAddressPayload = { ...billingAddressPayload, email: this.state.customer.email };

        let { payment } = this.state;

        this.setState({ isPlacingOrder: true });
        event.preventDefault();

        Promise.all([
            isGuest ? this.service.continueAsGuest(this.state.customer) : Promise.resolve(),
            this.service.updateBillingAddress(billingAddressPayload),
        ])
            .then(() => this.service.submitOrder({ payment }))
            .then(({ data }) => {
                window.location.href = data.getConfig().links.orderConfirmationLink;
            })
            .catch(() => this.setState({ isPlacingOrder: false }));
    }
}
