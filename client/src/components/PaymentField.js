import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'

import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    textfield: {
        margin: theme.spacing.unit
    }

});
  

class PaymentField extends React.Component {


    render() {
        const { classes } = this.props;
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}>
                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Select
                    value={this.props.value}
                    onChange={this.props.onChange}
                    input={<Input name={this.props.name} id={this.props.id} style={{minWidth:150}}/>}
                >
                    <MenuItem value={"NOT_PAID"}>neplaceno</MenuItem>
                    <MenuItem value={"VOUCHER"}>dárkový poukaz</MenuItem>
                    <MenuItem value={"INVOICE"}>faktura</MenuItem>
                    <MenuItem value={"PAID"}>placeno</MenuItem>
                </Select>
            </FormControl>
        )
    }
}


PaymentField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string
};
  
PaymentField.defaultProps = {
    autoFocus: false,
    name: "payment"
}


export default compose(
    withStyles(styles),
)(PaymentField)