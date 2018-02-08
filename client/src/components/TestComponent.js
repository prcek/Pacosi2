import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { findDOMNode } from 'react-dom'
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import CalendarIcon from 'material-ui-icons/Today';
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
      width: '200px',
    },
    textfield: {
        //margin: theme.spacing.unit
    },

});


class TestComponent extends React.Component {
 
    state = {
        focus:false,
        open:false,
        anchorEl:null,
        startDay: moment(),
        valueDay: null,
    }

    handleClick = () => {
        const { open } = this.state
        this.setState({
            open: !open,
            anchorEl: findDOMNode(this.input),
        })
    }

    handleFocus = () => {
        this.setState({
            focus:true,
            anchorEl: findDOMNode(this.input),
        })
    }
    handleBlur = () => {
        this.setState({
            focus:false,
            anchorEl:null,
        })
    }

    handleClose = () => {
        this.setState({open:false,anchorEl:null})
    }

    handleSelectDay = (d) => {
        this.setState({valueDay:d,open:false})
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
        var val = ""
        if (this.state.valueDay) {
            val = this.state.valueDay.format("LL");
        }
        return (
            <div> 
                <FormControl className={classes.textfield} 
                    ref={node => {
                        this.input = node;
                    }} 
                >
                    <InputLabel htmlFor={"div_id"}>Label</InputLabel>
                    
                    <Input 
                    onClick={this.handleClick}
                        onFocus={this.handleFocus} 
                        onBlur={this.handleBlur} 
                        name={"name"} 
                        id={"div_id"} 
                        value={val} 
                        style={{width:300}}  
                        inputProps={{readOnly:true}}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton >
                                    <CalendarIcon/>
                                 </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Popover 
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleClose}
                        anchorOrigin={{vertical:"bottom",horizontal:"left"}}
                    >
                    <div style={{width:300}}  > 
                        <Calendar 
                            startDay={this.state.startDay}
                            onForward={this.handleNextWeek} 
                            onBackward={this.handlePrevWeek}
                            onToday={this.handleTodayWeek}
                            onSelect={this.handleSelectDay}
                            selectedDay={this.state.valueDay}
                        /> 
                    </div>
                    </Popover>

                </FormControl>
                <TextField
                    id="name"
                    label="Name"
                    className={classes.textField}
                    value={"this.state.name"}
                />
            </div>
        )
    }
}




export default compose(
    withStyles(styles),
)(TestComponent)