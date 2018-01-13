import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import ForwardIcon from 'material-ui-icons/FastForward';
import RewindIcon from 'material-ui-icons/FastRewind';
import SettingsIcon from 'material-ui-icons/Settings';
import {MassageDayCard, MassageDayCardHeader} from './MassageDayCard';
import MassageDaySlot from './MassageDaySlot';
import DateTimeView from './DateTimeView';
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
        calendarDay: null
    }

    handleSelectDay = (d) => {
        this.setState({calendarDay:d});
    }

    handleNextWeek = () => {
        const d = moment(this.state.calendarStartDate).add(7,'days').toDate();
        this.setState({calendarStartDate:d});
    };
    handlePrevWeek = () => {
        const d = moment(this.state.calendarStartDate).subtract(7,'days').toDate();
        this.setState({calendarStartDate:d});
    };
    handleTodayWeek = () => {
        this.setState({calendarStartDate: moment().startOf('week').toDate()})
    };


    renderDayCard(d,status) {
        const { classes } = this.props;
        const s = this.state.calendarDay && moment(d).isSame(this.state.calendarDay,'day');
        return (
            <MassageDayCard className={classes.daycard} onClick={this.handleSelectDay} status={status} date={d} selected={s}/>
        );
    }
    renderWeek(startDay) {
        const { classes } = this.props;
        const d = moment(startDay).startOf('week');
        return (
            <div className={classes.weekline}>
                {this.renderDayCard(d.toDate(),1)}
                {this.renderDayCard(d.add(1,'days').toDate(),1)}
                {this.renderDayCard(d.add(1,'days').toDate(),2)}
                {this.renderDayCard(d.add(1,'days').toDate(),1)}
                {this.renderDayCard(d.add(1,'days').toDate(),0)}
            </div>
        );
    }

    renderWeekHeader() {
        const { classes } = this.props;
        return (
            <div className={classes.weekline}>
               <MassageDayCardHeader label={"Po"}/>
               <MassageDayCardHeader label={"Út"}/>
               <MassageDayCardHeader label={"St"}/>
               <MassageDayCardHeader label={"Čt"}/>
               <MassageDayCardHeader label={"Pá"}/>
            </div>
        );
    }


    renderDayDetail() {
        return (
            <div>
                <MassageDaySlot />
                <MassageDaySlot length={2}/>
                <MassageDaySlot />
                <MassageDaySlot length={4}/>
                <MassageDaySlot />

            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const weekH = this.renderWeekHeader();
        const week1 = this.renderWeek(this.state.calendarStartDate);
        const week2 = this.renderWeek(moment(this.state.calendarStartDate).add(7,'days').toDate());
        const week3 = this.renderWeek(moment(this.state.calendarStartDate).add(14,'days').toDate());
        const week4 = this.renderWeek(moment(this.state.calendarStartDate).add(21,'days').toDate());
        const dd = this.renderDayDetail();
        return (
            <div className={classes.root}>

                <Grid container>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Toolbar >
                            <Button onClick={this.handlePrevWeek}><RewindIcon/></Button>  
                            <Button onClick={this.handleTodayWeek}>dnes</Button>
                            <Button onClick={this.handleNextWeek}><ForwardIcon/></Button>  
                        </Toolbar>
                        <Paper>
                            {weekH}
                            {week1} {week2} {week3} {week4}      
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Toolbar >
                            <Typography> selected day:{this.state.calendarDay && <DateTimeView date={this.state.calendarDay}/>}</Typography>
                            {this.state.calendarDay && <Button onClick={this.handleNextWeek}><SettingsIcon/></Button>}
                        </Toolbar>  
                        <Paper>
                           {dd}    
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Paper>
                            massage          
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