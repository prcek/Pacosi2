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
import MassageDayCard from './MassageDayCard'
import DateTimeView from './DateTimeView'
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


    renderWeek(startDay) {
        const { classes } = this.props;
        const d = moment(startDay).startOf('week');
        return (
            <div className={classes.weekline}>
                <MassageDayCard className={classes.daycard} onClick={(d)=>this.handleSelectDay(d)} status={1} date={d.toDate()}/>
                <MassageDayCard className={classes.daycard} onClick={(d)=>this.handleSelectDay(d)} status={0} date={d.add(1,'days').toDate()}/>
                <MassageDayCard className={classes.daycard} onClick={(d)=>this.handleSelectDay(d)} status={2} date={d.add(1,'days').toDate()}/>
                <MassageDayCard className={classes.daycard} onClick={(d)=>this.handleSelectDay(d)} date={d.add(1,'days').toDate()}/>
                <MassageDayCard className={classes.daycard} onClick={(d)=>this.handleSelectDay(d)} date={d.add(1,'days').toDate()}/>
            </div>
        );
    }



    render() {
        const { classes } = this.props;
        const week1 = this.renderWeek(this.state.calendarStartDate)
        const week2 = this.renderWeek(moment(this.state.calendarStartDate).add(7,'days').toDate());
        const week3 = this.renderWeek(moment(this.state.calendarStartDate).add(14,'days').toDate());
        const week4 = this.renderWeek(moment(this.state.calendarStartDate).add(21,'days').toDate());
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
                            {week1} {week2} {week3} {week4}      
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Toolbar >
                            <Typography> selected day:{this.state.calendarDay && <DateTimeView date={this.state.calendarDay}/>}</Typography>
                            {this.state.calendarDay && <Button onClick={this.handleNextWeek}><SettingsIcon/></Button>}
                        </Toolbar>  
                        <Paper>
                           xxxx      
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