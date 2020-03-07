import React from 'react';
import InputContainer from '../InputContainer/input-container'
import styles from './savedAddressesDropdown.scss';
import Select from 'react-select'

export default class savedAddressesDropdown extends React.PureComponent {
    render() {

        // const options = [
        // { value: 'chocolate', label: 'Chocolate' },
        // { value: 'strawberry', label: 'Strawberry' },
        // { value: 'vanilla', label: 'Vanilla' }
        // ]

        return (
            <InputContainer
                id={ this.props.id }
                inline={ this.props.inline }
                label={ this.props.label }
                width={ this.props.width }
                body={
                    <Select options={ this.props.options } placeholder="Enter a new address" onChange={ (address) => this.props.onChange(address) } />
                    // <select
                    //     id={ this.props.id }
                    //     value={ this.props.value || '' }
                    //     onChange={ this.props.onChange }
                    //     className={ styles.select }>
                    //     { this.props.options.map((option) => (
                    //         <option
                    //             key={ option.code }
                    //             value={ option.code }>
                    //             { option.name }
                    //         </option>
                    //     ))}
                    // </select>
                } />
        );
    }
}
