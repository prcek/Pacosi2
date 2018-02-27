import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
//import Lodash from 'lodash';


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    textfield: {
        margin: theme.spacing.unit
    }

});
  

const CurrentMassageRooms = gql`
  query MassageRooms {
    massageRooms{
        id, name, status, location {
          name
        }
    }     
  }
`;


class MassageRoomField extends React.Component {

    renderItems(items) {
        return /*Lodash.filter(items,{status:"ACTIVE"})*/items.map(item=> (
            <MenuItem key={item.id} value={item.id}><span>{item.name}</span>&nbsp;<em>{item.location.name}</em></MenuItem>
        )); 
    }

  
    render() {
        const items = !this.props.docs.massageRooms ?[]:this.renderItems(this.props.docs.massageRooms);
        const { classes } = this.props;
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}>
                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Select
                    value={this.props.value}
                    onChange={this.props.onChange}
                    input={<Input name={this.props.name} id={this.props.id} style={{minWidth:300}} />}
                >
                    {items}
                </Select>
            </FormControl>
        )
    }
}


MassageRoomField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string
};
  
MassageRoomField.defaultProps = {
    autoFocus: false
}


export default compose(
    withStyles(styles),
    graphql(CurrentMassageRooms,{
        name: "docs",
    }),
)(MassageRoomField)