import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Paper from 'material-ui/Paper';
import Calendar from './Calendar';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');


const LessonTypeDayInfos = gql`
  query LessonTypeDayInfos($lesson_type_id: ID! $begin_date: Date! $end_date: Date!) {
    lessonTypeDayInfos(lesson_type_id:$lesson_type_id, begin_date:$begin_date, end_date:$end_date)  {
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
  


class LessonTypeCal extends React.Component {

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
        this.props.onSelectDay(moment().toDate());
    };




    getDaysInfo() {
        if (!this.props.lessonTypeDayInfos.lessonTypeDayInfos) {
            return [];
        }
        return this.props.lessonTypeDayInfos.lessonTypeDayInfos.filter(di=>{
            return (di.status !=='OFF')
        }).map(di=>{
            let st = 0;
            switch (di.status) {
                case 'OFF': st=0; break;
                case 'FREE': st=1; break;
                case 'BUSY': st=2; break;
                default:
            }
            return {day:moment(di.date),colorIndex:st}
        })
        
    }


    render() {
        const { classes } = this.props;
        const  daysInfo = this.getDaysInfo();
        console.log(daysInfo)
        return (
            <Paper className={classes.root}>
                <Calendar 
                    startDay={moment(this.props.begin)} 
                    onForward={this.handleNextWeek} 
                    onBackward={this.handlePrevWeek}
                    onToday={this.handleTodayWeek}
                    onSelect={this.handleSelectDay}
                    daysInfo={daysInfo}
                    selectedDay={moment(this.props.selected)}
                />
            </Paper>
        )
    }
}


LessonTypeCal.propTypes = {
    classes: PropTypes.object.isRequired,
    lesson_type_id: PropTypes.string.isRequired,
    begin: PropTypes.objectOf(Date), 
    selected: PropTypes.objectOf(Date),
    onSelectDay: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired
};
  

export default compose(
    withStyles(styles),
    graphql(LessonTypeDayInfos,{
        name: "lessonTypeDayInfos",
        options: ({lesson_type_id,begin})=>({
            variables:{
                lesson_type_id:lesson_type_id,
                begin_date: moment(begin).format('YYYY-MM-DD'),
                end_date:moment(begin).add(8,'weeks').format('YYYY-MM-DD')
            }, fetchPolicy:"cache-and-network"
        })
    }),
)(LessonTypeCal)