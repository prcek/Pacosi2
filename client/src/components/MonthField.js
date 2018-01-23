import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'

import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Lodash from 'lodash';

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
require("moment/min/locales.min");
moment.locale('cs');

const styles = theme => ({
    root: {
      //marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    textfield: {
        margin: theme.spacing.unit
    }

});
  

class MonthField extends React.Component {


    getMenuItems() {
        const months = Lodash.reverse(Array.from(moment.range(this.props.minMonth,this.props.maxMonth).by("month")));
        return months;
    }


    renderMenuItems() {
        return this.getMenuItems().map((i,IDX)=>{
            return (
                <MenuItem key={IDX} value={i.toISOString()}>{Moment(i).format('MMMM YYYY')}</MenuItem>
            )
        })
    }
    renderMonthValue = (v) => {
        return v?Moment(v).format('MMMM YYYY'):""
    }

    handleChange = (e) => {
       const v = e.target.value;
       const d = Moment(v).toISOString();
       this.props.onChange({target:{value:d}}); 
    }

    render() {
        const { classes } = this.props;
        const mi = this.renderMenuItems();
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}>
                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Select
                    value={this.props.value}
                    onChange={this.handleChange}
                    input={<Input name={this.props.name} id={this.props.id} style={{minWidth:150}}  />}
                    renderValue={this.renderMonthValue}
                >
                {mi}
                </Select>
            </FormControl>
        )
    }
}


MonthField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    minMonth: PropTypes.objectOf(Moment),
    maxMonth: PropTypes.objectOf(Moment)
};
  
MonthField.defaultProps = {
    autoFocus: false,
    name: "month",
    minMonth: moment().startOf('year').subtract(2,"years"),
    maxMonth: moment().startOf('month')//.add(2,"months")
}


export default compose(
    withStyles(styles),
)(MonthField)