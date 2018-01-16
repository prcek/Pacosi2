import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import MassageDaySlot from './MassageDaySlot';
import DateTimeView from './DateTimeView';
import TimeField from './TimeField';
import MassageRoomCal from './MassageRoomCal';
import Switch from 'material-ui/Switch';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');




const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    weekline: {
        display:'flex'
    },
    daycard: {
        
    }
});
  


class MassageRoom extends React.Component {
    state = {
        calendarStartDate: moment().startOf('week').toDate(),
        calendarDay: null,
        timeTest: new Date(),
        planMode: true
    }

    onPlanMode(val) {
        this.setState({planMode:val});
    }

    handleTimeTest = (d) => {
        this.setState({timeTest:d});
    }


    handleSelectDay = (d) => {
        this.setState({calendarDay:d});
    }

    handleCalMove = (d) => {
        this.setState({calendarStartDate:d});
    }



    renderDayDetail() {
        return (
            <div>
                <MassageDaySlot />
                <MassageDaySlot length={2}/>
                <MassageDaySlot />
                <MassageDaySlot length={4}/>
                <MassageDaySlot />
                <MassageDaySlot length={3}/>
                <MassageDaySlot length={2}/>
                <MassageDaySlot />
                <MassageDaySlot />
            </div>
        )
    }

    renderSettingsSwitch() {
        return (
            <FormGroup row>
                <FormControlLabel
                    control={<Switch checked={this.state.planMode} onChange={(e,c)=>this.onPlanMode(c)}/>}
                    label="Editace dne"
                />
            </FormGroup>
        )
    }


    renderTimeTest() {

        var ranges = [];
        for(var i=0; i<2; i++) {
            var m = moment().startOf('day').add(7+i*4,'hours');
            var m2 = moment(m).add(120,'minutes');
            ranges.push({begin:m.toDate(),end:m2.toDate()});
        }

        return (
            <TimeField label={"cas"} ranges={ranges} value={this.state.timeTest} onChange={(e)=>this.handleTimeTest(e.target.value)} />
        );
    }
 
    renderPlanEdit() {
        return (
            <div>
                {this.renderTimeTest()}
            </div>
        )
    }


    render() {
        const { classes } = this.props;
        const dd = this.renderDayDetail();
        return (
            <div className={classes.root}>

                <Grid container>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                       <MassageRoomCal massageRoomId={this.props.massageRoomId} begin={this.state.calendarStartDate} selected={this.state.calendarDay} onSelectDay={this.handleSelectDay} onMove={this.handleCalMove}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Toolbar >
                            <Typography> selected day:{this.state.calendarDay && <DateTimeView date={this.state.calendarDay}/>}</Typography>
                            {this.state.calendarDay && this.renderSettingsSwitch()}
                        </Toolbar>  
                        <Paper>
                           {dd}    
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Paper>
                            {this.state.planMode && this.renderPlanEdit()}       
                        </Paper>
                    </Grid>
                </Grid>


            <Typography type="caption"> 
                MassageRoom id:{this.props.massageRoomId}
                {this.state.currentDate && ", selected date: "+ moment(this.state.currentDate).format()} 
            </Typography>
            </div>
        )
    }
}


MassageRoom.propTypes = {
    classes: PropTypes.object.isRequired,
    massageRoomId: PropTypes.string.isRequired
};
  

export default compose(
    withStyles(styles)
)(MassageRoom)