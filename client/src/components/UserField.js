import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag';
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
  

const CurrentUsers = gql`
  query Users {
    users {
      id
      name
      role
      status
    }
  }
`;


class UserField extends React.Component {

    renderItems(items) {
        return items.map(item=> (
            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        )); 
    }

  
    render() {
        const items = !this.props.docs.users ?[]:this.renderItems(this.props.docs.users);
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


UserField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string
};
  
UserField.defaultProps = {
    autoFocus: false
}


export default compose(
    withStyles(styles),
    graphql(CurrentUsers,{
        name: "docs",
    }),
)(UserField)