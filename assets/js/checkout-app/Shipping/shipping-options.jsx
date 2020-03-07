import React, { Fragment } from 'react';
import { formatMoney } from 'accounting';
import EmptyState from './EmptyState/empty-state';
import RadioContainer from '../components/RadioContainer/radio-container';
import RadioInput from '../components/RadioInput/radio-input';

export default class ShippingOptions extends React.PureComponent {
    render() {
        return (
            <RadioContainer
                label={ 'Shipping Option' }
                body={
                    <Fragment>
                        { this.props.isUpdatingShippingAddress &&
                            <EmptyState
                                body={ 'Loading shipping options...' }
                                isLoading={ true } />
                        }
                        {
                            !this.props.isUpdatingShippingAddress &&
                            (!this.props.options || !this.props.options.length) &&
                            <EmptyState
                                body={ 'Please enter a shipping address in order to see shipping options.' }
                                isLoading={ false } />
                        }
                        {
                            !this.props.isUpdatingShippingAddress && this.props.options && this.props.options.length>0 && (this.props.options).map(option => (
                            <RadioInput
                                key={ option.id }
                                name={ 'shippingOption' + this.props.consignmentId }
                                value={ option.id }
                                checked={ this.props.selectedOptionId === option.id }
                                label={ `${ option.description } - ${ formatMoney(option.cost) }` }
                                isLoading={ this.props.isSelectingShippingOption || this.props.isUpdatingShippingAddress }
                                onChange={ () => this.props.onSelect(option.id) } />
                        )) }
                    </Fragment>
                } />
            );
        }
    }
