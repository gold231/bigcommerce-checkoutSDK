import React, { Fragment } from 'react';
import { find } from 'lodash';
import Dropdown from '../Dropdown/dropdown';
import SavedAddressesDropdown from '../SavedAddressesDropdown/savedAddressesDropdown';
import TextInput from '../TextInput/text-input';
import ProvinceInput from './ProvinceField/province-field';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import styles from './address.scss';

export default class Address extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.state={
            currentLat:0,
            currentLng: 0
        }
    }

    handleChange(address) {
        this.setState({ address:address });
    };

    componentDidMount() {
        this.postData('https://www.joyoushealth.com/testgeoip.php',{ })
        .then((data)=>this.setState({currentLat: data.lat, currentLng: data.lng}));

        // navigator.geolocation.getCurrentPosition((data)=> {
        //     console.log('success',data.coords.latitude,data.coords.longitude)
        //     this.setState({currentLat: data.coords.latitude, currentLng: data.coords.longitude})
        //     }, (error)=>{console.log('error',error)})
    }
    
    handleSelect(address) {
        geocodeByAddress(address)
        .then(results => {
            console.log('geocode address',results);
            let streetNumber='';
            let street='';
            let city='';
            let province='';
            let provinceCode='';
            let country='';
            let countryCode='';
            let postalCode='';

            results[0]['address_components'].map((component) => {
                console.log('component',component.types);
                
                if (component.types.indexOf('street_number') != -1) {
                    streetNumber=component.long_name;
                } else if (component.types.indexOf('route') != -1) {
                    street=component.long_name;
                } else if (component.types.indexOf('locality') != -1) {
                    city=component.long_name;
                } else if (component.types.indexOf('administrative_area_level_1') != -1) {
                    provinceCode=component.short_name;
                    province=component.long_name;
                } else if (component.types.indexOf('country') != -1) {
                    countryCode=component.short_name;
                    country=component.long_name;
                } else if (component.types.indexOf('postal_code') != -1) {
                    postalCode=component.long_name;
                    console.log('compoenent postal code', component)
                }
            })

            
            
            const address1 = streetNumber + ' ' + street;
            this.props.onChange('address1', address1);
            this.props.onChange('city', city);
            this.props.onChange('countryCode', countryCode);
            this.props.onChange('country', country);
            this.props.onChange('stateOrProvince', province);
            this.props.onChange('stateOrProvinceCode', provinceCode);
            
            this.props.onChange('postalCode', postalCode);

            })
        .catch(error => console.error(error));
    };

    removeProperty(obj, propertyName) {
        let { [propertyName]: _, ...result } = obj
        return result
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
    


    render() {
        const searchOptions = {
            location: new google.maps.LatLng(this.state.currentLat, this.state.currentLng),
            radius: 100000,
            types: ['address']
        }

        let transformedSavedAddresses = [];

        const originalSavedAddress = this.props.address;

        // this.props.savedAddresses && this.props.savedAddresses.map((originalSavedAddress) => {
            
            const label = originalSavedAddress.firstName + ' ' + originalSavedAddress.lastName + ' - ' + originalSavedAddress.address1 + ' ' + originalSavedAddress.city + ', ' + originalSavedAddress.stateOrProvince + ' ' + originalSavedAddress.country;

            const transformedSavedAddress1 = {
                id: originalSavedAddress.id,
                value: originalSavedAddress.id,
                label:label,
                address: originalSavedAddress
            };

            transformedSavedAddresses.push(transformedSavedAddress1);
            
        // });

        return (
            <Fragment>
                <SavedAddressesDropdown
                    id={ `${ this.props.name }SavedAddresses` }
                    value={ 0 }
                    onChange={ ( address ) => { this.props.onSavedAddressSelect(address.address); this.setState({address: address.address}) }}
                    options={ transformedSavedAddresses }
                    width={ 'full' } />

                <TextInput
                    id={ `${ this.props.name }FirstName` }
                    label={ 'First Name' }
                    value={ this.props.address.firstName }
                    onChange={ ({ target }) => this.props.onChange('firstName', target.value) }
                    width={ 'half' } />

                <TextInput
                    id={ `${ this.props.name }LastName` }
                    label={ 'Last Name' }
                    value={ this.props.address.lastName }
                    onChange={ ({ target }) => this.props.onChange('lastName', target.value) }
                    width={ 'half' } />

                <TextInput
                    id={ `${ this.props.name }Company` }
                    label={ 'Company Name' }
                    value={ this.props.address.company }
                    onChange={ ({ target }) => this.props.onChange('company', target.value) }
                    optional={ true }
                    width={ 'full' } />

                <TextInput
                    id={ `${ this.props.name }Phone` }
                    label={ 'Phone Number' }
                    optional={ true }
                    value={ this.props.address.phone }
                    onChange={ ({ target }) => this.props.onChange('phone', target.value) }
                    width={ 'twoThird' } />
                <div className={styles.container}>
                <label htmlFor="address1" className={ styles.label }>Address</label>
               
                <PlacesAutocomplete
                    value={(this.props.address && this.props.address.address1)? this.props.address.address1:'fds'}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                    searchOptions={searchOptions}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
                        const inputProps=this.removeProperty(getInputProps(), 'autoComplete');
                        
                        return (
                    
                    <div>
                        <input
                            {...inputProps}
                            className={styles.addressInput}   
                            id={ `${ this.props.name }AddressLine1` }
                            label={ 'Address' }
                            value={ this.props.address.address1 }
                            onChange={({ target }) => {this.props.onChange('address1', target.value); getInputProps().onChange(event)}}
                            autoComplete="random_text_to_disable_chrome_autofill"
                            // onChange={ ({ target }) => this.props.onChange('address1', target.value) }
                        />
                        <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                            const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                            return (
                            <div
                                {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                                })}
                            >
                                <span>{suggestion.description}</span>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    )}}
                </PlacesAutocomplete>
                </div>
                <TextInput
                    id={ `${ this.props.name }AddressLine2` }
                    label={ 'Apartment/Suite/Building' }
                    value={ this.props.address.address2 }
                    onChange={ ({ target }) => this.props.onChange('address2', target.value) }
                    optional={ true }
                    width={ 'full' } />

                <TextInput
                    id={ `${ this.props.name }City` }
                    label={ 'City' }
                    value={ this.props.address.city }
                    onChange={ ({ target }) => this.props.onChange('city', target.value) }
                    width={ 'half' } />

                <Dropdown
                    id={ `${ this.props.name }Country` }
                    label={ 'Country' }
                    value={ this.props.address.countryCode }
                    onChange={ ({ target }) => this.props.onChange('countryCode', target.value) }
                    options={ this.props.countries }
                    width={ 'full' } />

                <ProvinceInput
                    name={ this.props.name }
                    country={ find(this.props.countries, ({ code }) => code === this.props.address.countryCode) }
                    stateOrProvince={ this.props.address.stateOrProvince }
                    stateOrProvinceCode={ this.props.address.stateOrProvinceCode }
                    onChange={ ({ target }) => this.props.onChange('stateOrProvince', target.value) }
                    onCodeChange={ ({ target }) => this.props.onChange('stateOrProvinceCode', target.value) } />

                <TextInput
                    id={ `${ this.props.name }PostalCode` }
                    label={ 'Postal Code' }
                    value={ this.props.address.postalCode }
                    onChange={ ({ target }) => this.props.onChange('postalCode', target.value) }
                    width={ 'oneThird' } />

            </Fragment>
        );
    }
}
