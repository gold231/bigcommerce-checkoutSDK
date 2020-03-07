import React, { Fragment } from 'react';
import styles from './customer.scss';
import customStyles from './../../../../config.json';
import Button from '../components/Button/button';
import EmailInput from '../components/EmailInput/email-input';
import NameInput from '../components/NameInput/name-input';
import PasswordInput from '../components/PasswordInput/password-input';
import Section from '../components/Section/section';
import LoginPanel from '../LoginPanel/login-panel';
import md5 from 'md5';

export default class Customer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            raw_password: '',
            password: '',
            completed: false
        };
    }

    componentDidMount() {
        let email = this.props.customer.isGuest ?
            this.props.customer.email :
            this.props.billingAddress.email;

        if (email && email !== this.state.email) {
            this.setState({ email });
        }
    }

    componentDidUpdate(prevProps) {
        this.props.onChange(this.state);
        // console.log('this.props.showSignIn',this.props.showSignUp)
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    guestCustomerEditToggleHandler() {
        if (this.state.email != '' && this.validateEmail(this.state.email)) {
            this.setState({ completed: !this.state.completed })
        }
    }

    render() {
        const linkStyles = {
          color: '#63c4bf'
        };

        const buttonStyles = {
            backgroundColor: customStyles['variations'][0]['settings']['color_primary']
        }

        // console.log('checkout_color_primary',customStyles['variations'][0]['settings']['checkout_color_primary'])
        // console.log('color_primary',customStyles['variations'][0]['settings']['color_primary'])
        let body = '';

        if (this.props.showSignIn) {
            body = <Fragment>
                        <div className={ styles.message}>Sign in to your Joyous Health account:</div>
                        <div className={ styles.customerEmailInputContainer }>
                            <EmailInput
                                    id={ 'signInEmail' }
                                    label={ 'Email Address' }
                                    value={ this.state.email }
                                    onChange={ ({ target }) => this.setState({ email: target.value }) } />
                            <PasswordInput
                                id={ 'password' }
                                label={ 'Password' }
                                value={ this.state.raw_password }
                                onChange={ ({ target }) => this.setState({ raw_password: target.value }) } />
                            <div className={ styles.actionContainer }>
                                Don't have an account? <a style={ linkStyles } onClick={ this.props.onSignUp }>Create an account</a> to continue.
                            </div>
                            <div className={ styles.signInControls}>
                                <Button buttonType='signIn' label="SIGN IN" onClick={ () => this.props.onSignInAction() } />
                                <Button buttonType='secondary' label="CANCEL" onClick={ () => this.props.onCancelSignIn() } />
                            </div>
                        </div>
                    </Fragment>;
        } else if (this.props.showSignUp) {
            body = <Fragment>
                        <div className={ styles.customerEmailInputContainer }>
                            <div className={ styles.actionContainer }>
                                Already have an account? <a style={ linkStyles } onClick={ this.props.onSignIn }>Sign in now</a>
                            </div>

                            <NameInput
                                id={ 'signInName' }
                                label={ 'Name' }
                                value={ this.state.name }
                                onChange={ ({ target }) => this.setState({ name: target.value }) } />
                            <EmailInput
                                id={ 'signInEmail' }
                                label={ 'Email Address' }
                                value={ this.state.email }
                                onChange={ ({ target }) => this.setState({ email: target.value }) } />
                            <PasswordInput
                                id={ 'password' }
                                label={ 'Password' }
                                value={ this.state.raw_password }
                                onChange={ ({ target }) => this.setState({ raw_password: target.value }) } />
                            <div className={ styles.signInControls}>
                                <Button buttonType='signIn' label="SIGN UP" onClick={ () => this.props.onSignUpAction() } />
                                <Button buttonType='secondary' label="CANCEL" onClick={ () => this.props.onCancelSignUp() } />
                            </div>
                        </div>
                       
                    </Fragment>;
        } else if (!this.state.completed) {
            body = <Fragment>
                { this.props.customer.isGuest &&
                    <Fragment>
                        <div className={ styles.guestEmailInputContainer }>
                            <p className={ styles.guestMessage}>Checking out as a <span>Guest</span>? You'll be able to save your details to create an account with us later.</p>
                            <div className={ styles.inputContainer }>
                                <EmailInput
                                    id={ 'guestEmail' }
                                    label={ 'Email Address' }
                                    value={ this.state.email }
                                    onChange={ ({ target }) => this.setState({ email: target.value }) } />
                                <Button style={ buttonStyles } buttonType='medium' label="CONTINUE AS GUEST" onClick={ () => this.guestCustomerEditToggleHandler() } />
                            </div>
                        </div>
                        <div className={ styles.actionContainer }>
                            Already have an account? <a style={ linkStyles } onClick={ this.props.onSignIn }>Sign in now</a>
                        </div>
                    </Fragment>
                }

                { !this.props.customer.isGuest &&
                    <div className={ styles.customerContainer }>
                        <div className={ styles.customerLabel }>
                            You are signed in as { this.props.customer.email }
                        </div>

                        <Button
                            label={ this.props.isSigningOut ? `Signing out...` : 'Sign Out' }
                            onClick={ this.props.onClick } />
                    </div>
                }
            </Fragment>;
        }
        return (
            <Section
                header={ 'Customer' }
                edit={ () => this.guestCustomerEditToggleHandler() }
                headerCenterContent={ this.state.email }
                completed= { this.state.completed }
                step={ this.props.step }
                body={ body }
                editButton={ true } />
        );
    }
}
