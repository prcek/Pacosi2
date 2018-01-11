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
  

const CurrentLocations = gql`
  query Locations {
    locations {
      id
      name
    }
  }
`;


class LocationField extends React.Component {

    renderItems(locations) {
        //const { classes } = this.props;
        return locations.map(location=> (
            <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
        )); 
    }
    render() {
        const items = !this.props.docs.locations ?[]:this.renderItems(this.props.docs.locations);
        const { classes } = this.props;
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}>
                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Select
                    value={this.props.value}
                    onChange={this.props.onChange}
                    input={<Input name={this.props.name} id={this.props.id} style={{minWidth:100}} />}
                >
                    {items}
                </Select>
            </FormControl>
        )
    }
}


LocationField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string
};
  
LocationField.defaultProps = {
    autoFocus: false
}


export default compose(
    withStyles(styles),
    graphql(CurrentLocations,{
        name: "docs",
    }),
)(LocationField)