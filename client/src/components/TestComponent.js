import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { findDOMNode } from 'react-dom'
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
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
      width: '200px',
    },
    textfield: {
        //margin: theme.spacing.unit
    },
    iconbutton: {
        width: '30px'
    }

});


class TestComponent extends React.Component {
 
    state = {
        open:false,
        anchorEl:null,
        startDay: moment(),
        valueDay: null,
    }

    handleClear = () => {
        this.setState({valueDay:null})
    }
    handleClick = () => {
        const { open , valueDay} = this.state

        if (!open) {
            this.setState({
                open: true,
                startDay: valueDay?valueDay:moment(),
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
                <span> xxxxx </span>
                <FormControl className={classes.textfield} 
                    ref={node => {
                        this.input = node;
                    }} 
                >
                    <InputLabel htmlFor={"div_id"}>Label</InputLabel>
                    
                    <Input 
                        //onClick={this.handleClick}
                        name={"name"} 
                        id={"div_id"} 
                        value={val} 
                        style={{width:280}}  
                        inputProps={{readOnly:true,onClick:this.handleClick}}
                        endAdornment={
                            <InputAdornment position="end">
                                {this.state.valueDay && (
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
                    <Popover 
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleClose}
                        anchorOrigin={{vertical:"bottom",horizontal:"left"}}
                    >
                    <div style={{width:280}}  > 
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