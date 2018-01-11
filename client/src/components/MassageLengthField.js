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
  

class MassageLengthField extends React.Component {


    render() {
        const { classes } = this.props;
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}>
                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Select
                    value={this.props.value}
                    onChange={this.props.onChange}
                    input={<Input name={this.props.name} id={this.props.id} style={{minWidth:100}} />}
                >
                    <MenuItem value={30}>30 minut</MenuItem>
                    <MenuItem value={60}>60 minut</MenuItem>
                    <MenuItem value={90}>90 minut</MenuItem>
                    <MenuItem value={120}>120 minut</MenuItem>
                </Select>
            </FormControl>
        )
    }
}


MassageLengthField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string
};
  
MassageLengthField.defaultProps = {
    autoFocus: false,
    name: "massagelength"
}


export default compose(
    withStyles(styles),
)(MassageLengthField)