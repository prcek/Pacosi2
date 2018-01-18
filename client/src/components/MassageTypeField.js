import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag';
import Typography from 'material-ui/Typography';
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
  

const CurrentMassageTypes = gql`
  query MassageTypes {
    massageTypes {
      id
      name
      length
    }
  }
`;


class MassageTypeField extends React.Component {

    renderItems(items) {
        //const { classes } = this.props;
        return items.map(item=> (
            <MenuItem key={item.id} value={item.id}> <Typography>{item.name}&nbsp;<em>{item.length}</em></Typography></MenuItem>
        )); 
    }
    render() {
        const items = !this.props.docs.massageTypes ?[]:this.renderItems(this.props.docs.massageTypes);
        const { classes } = this.props;
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}>
                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Select
                    value={this.props.value}
                    onChange={this.props.onChange}
                    input={<Input name={this.props.name} id={this.props.id} style={{minWidth:200}} />}
                >
                    {items}
                </Select>
            </FormControl>
        )
    }
}


MassageTypeField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string
};
  
MassageTypeField.defaultProps = {
    autoFocus: false
}


export default compose(
    withStyles(styles),
    graphql(CurrentMassageTypes,{
        name: "docs",
    }),
)(MassageTypeField)