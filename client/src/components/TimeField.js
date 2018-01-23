import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'

import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Moment from 'moment';
import Lodash from 'lodash';


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    textfield: {
        margin: theme.spacing.unit
    }

});
  

class TimeField extends React.Component {


    getMenuItems() {
        const r = this.props.ranges.map(r=>{
            var items = []
            var c = Moment(r.begin);
            while (c.isBefore(r.end)) {
                items.push(c.toDate());
                c.add(this.props.rangeStep,'minutes');
            }
           return items;
        })
        return Lodash.flatten(r);
    }


    renderMenuItems() {
        return this.getMenuItems().map((i,IDX)=>{
            return (
                <MenuItem key={IDX} value={i.toISOString()}>{Moment(i).format('HH:mm')}</MenuItem>
            )
        })
    }
    renderTimeValue = (v) => {
        return v?Moment(v).format('HH:mm'):""
    }

    handleChange = (e) => {
       const v = e.target.value;
       const d = Moment(v).toDate();
       this.props.onChange({target:{value:d}}); 
    }

    render() {
        const { classes } = this.props;
        const mi = this.renderMenuItems();
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}>
                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Select
                    value={this.props.value.toISOString()}
                    onChange={this.handleChange}
                    input={<Input name={this.props.name} id={this.props.id}  style={{minWidth:50}}/>}
                    renderValue={this.renderTimeValue}
                >
                {mi}
                </Select>
            </FormControl>
        )
    }
}


TimeField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.objectOf(Moment),
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    ranges: PropTypes.arrayOf(PropTypes.shape({begin:PropTypes.objectOf(Date),end:PropTypes.objectOf(Date)})),
    rangeStep: PropTypes.number
};
  
TimeField.defaultProps = {
    autoFocus: false,
    name: "status",
    rangeStep: 30,
    ranges:[]
}


export default compose(
    withStyles(styles),
)(TimeField)