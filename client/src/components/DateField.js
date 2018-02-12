import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'


import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { findDOMNode } from 'react-dom'
import Popover from 'material-ui/Popover';
import CalendarIcon from 'material-ui-icons/Today';
import ClearIcon from 'material-ui-icons/Clear';
import IconButton from 'material-ui/IconButton';
import Calendar from './Calendar';
import Moment from 'moment';
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
require("moment/min/locales.min");
moment.locale('cs');


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    textfield: {
        margin: theme.spacing.unit
    },
    iconbutton: {
        width:'30px'
    }

});
  

class DateField extends React.Component {

    state = {
        open:false,
        anchorEl:null,
        startDay: moment(),
    }

    handleSelectDay = (d) => {
        this.props.onChange(d.format("YYYY-MM-DD"));
        this.setState({open:false})
    }

    handleClear = () => {
        this.props.onChange(null);
    }
    handleClick = () => {
        const { open } = this.state
        const val = this.props.value?moment(this.props.value):null;
        if (!open) {
            this.setState({
                open: true,
                startDay: val?val:moment(),
                anchorEl: findDOMNode(this.input),
            })
        } else {
            this.setState({
                open: false,
            })
        }

    }


    handleClose = () => {
        this.setState({open:false,anchorEl:null})
    }


    handleNextWeek = () => {
        const d = moment(this.state.startDay).add(7,'days').toDate();
        this.setState({startDay:d});
    };
    handlePrevWeek = () => {
        const d = moment(this.state.startDay).subtract(7,'days').toDate();
        this.setState({startDay:d});
    };
    handleTodayWeek = () => {
        const d = moment().startOf('week');
        this.setState({startDay:d});
    };


 

    render() {
        const { classes } = this.props;
        const val = this.props.value?moment(this.props.value):null;
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}
                ref={node => {
                    this.input = node;
                }} 
            >

                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Input 
                    name={this.props.name} 
                    id={this.props.id} 
                    value={val?val.format("LL"):""} 
                    style={{width:280}}  
                    inputProps={{readOnly:true,onClick:this.handleClick}}
                    endAdornment={
                        <InputAdornment position="end">
                            {val && (
                                <IconButton className={classes.iconbutton} onClick={this.handleClear}>
                                    <ClearIcon/>
                                </IconButton>
                            )}
                            <IconButton  className={classes.iconbutton} onClick={this.handleClick}>
                               <CalendarIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Popover style={{width:280}}
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleClose}
                        anchorOrigin={{vertical:"bottom",horizontal:"left"}}
                        disableRestoreFocus
                >
                    <Calendar 
                        startDay={this.state.startDay}
                        onForward={this.handleNextWeek} 
                        onBackward={this.handlePrevWeek}
                        onToday={this.handleTodayWeek}
                        onSelect={this.handleSelectDay}
                        selectedDay={val}
                    /> 
                </Popover>


           
            </FormControl>
        )
    }
}


DateField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string
};
  
DateField.defaultProps = {
    autoFocus: false,
    name: "date",
    id:"datefield",
    label:"Datum"
}


export default compose(
    withStyles(styles),
)(DateField)