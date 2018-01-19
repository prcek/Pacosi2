import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import ForwardIcon from 'material-ui-icons/FastForward';
import RewindIcon from 'material-ui-icons/FastRewind';
import {MassageDayCard, MassageDayCardHeader} from './MassageDayCard';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');


const MassageRoomDayInfos = gql`
  query MassageRoomDayInfos($massage_room_id: ID! $begin_date: Date! $end_date: Date!) {
    massageRoomDayInfos(massage_room_id:$massage_room_id, begin_date:$begin_date, end_date:$end_date) {
      date,status
    }
  }
`;



const styles = theme => ({
    root: {
      //marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    flex: {
        flex: 1,
    },
    toolbar: {
        minHeight:50
    },
    

    weekline: {
        display:'flex'
    },
    daycard: {
        
    }
});
  


class MassageRoomCal extends React.Component {

    handleSelectDay = (d) => {
        this.props.onSelectDay(moment(d).toDate());
    }

    handleNextWeek = () => {
        const d = moment(this.props.begin).add(7,'days').toDate();
        this.props.onMove(d);
    };
    handlePrevWeek = () => {
        const d = moment(this.props.begin).subtract(7,'days').toDate();
        this.props.onMove(d);
    };
    handleTodayWeek = () => {
        this.props.onMove(moment().startOf('week').toDate());
    };


    renderDayCard(d) {
        const { classes } = this.props;
        const s = this.props.selected && moment(d.date).isSame(this.props.selected,'day');
        var st = 0;
        //console.log(d.status)
        switch (d.status) {
            case 'OFF': st=0; break;
            case 'FREE': st=1; break;
            case 'BUSY': st=2; break;
            default:
        }
        return (
            <MassageDayCard className={classes.daycard} onClick={this.handleSelectDay} status={st} date={d.date} selected={s}/>
        );
    }
    renderWeek(weekNo) {
        const { classes } = this.props;
        if (!this.props.massageRoomDayInfos.massageRoomDayInfos) {
            return null;
        }
        const d0 = this.props.massageRoomDayInfos.massageRoomDayInfos[weekNo*7+0]
        const d1 = this.props.massageRoomDayInfos.massageRoomDayInfos[weekNo*7+1]
        const d2 = this.props.massageRoomDayInfos.massageRoomDayInfos[weekNo*7+2]
        const d3 = this.props.massageRoomDayInfos.massageRoomDayInfos[weekNo*7+3]
        const d4 = this.props.massageRoomDayInfos.massageRoomDayInfos[weekNo*7+4]
        return (
            <div className={classes.weekline}>
                {this.renderDayCard(d0)}
                {this.renderDayCard(d1)}
                {this.renderDayCard(d2)}
                {this.renderDayCard(d3)}
                {this.renderDayCard(d4)}
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


 


    render() {
        const { classes } = this.props;
        const weekH = this.renderWeekHeader();
        const week1 = this.renderWeek(0);
        const week2 = this.renderWeek(1);
        const week3 = this.renderWeek(2);
        const week4 = this.renderWeek(3);
        return (
            <div className={classes.root}>
                <Toolbar classes={{root:classes.toolbar}} >
                    <Button color={"primary"} onClick={this.handlePrevWeek}><RewindIcon/></Button>  
                    <Button color={"primary"} className={classes.flex} onClick={this.handleTodayWeek}>dnes</Button>
                    <Button color={"primary"} onClick={this.handleNextWeek}><ForwardIcon/></Button>  
                </Toolbar>
                <Paper>
                    {weekH}
                    {week1} {week2} {week3} {week4}      
                </Paper>
            </div>
        )
    }
}


MassageRoomCal.propTypes = {
    classes: PropTypes.object.isRequired,
    massageRoomId: PropTypes.string.isRequired,
    begin: PropTypes.objectOf(Date), 
    selected: PropTypes.objectOf(Date),
    onSelectDay: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired
};
  

export default compose(
    withStyles(styles),
    graphql(MassageRoomDayInfos,{
        name: "massageRoomDayInfos",
        options: ({massageRoomId,begin})=>({
            variables:{
                massage_room_id:massageRoomId,
                begin_date: moment(begin).format('YYYY-MM-DD'),
                end_date:moment(begin).add(27,'days').format('YYYY-MM-DD')
            }
        })
    }),
)(MassageRoomCal)