import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import Grid from 'material-ui/Grid';
import LessonTabs from './LessonTabs';
import Paper from 'material-ui/Paper';
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

});
  


class LessonType extends React.Component {

    state = {
        currentDate:null,
        editMode: false
    }

    calSelected(d) {
        this.setState({currentDate:d});
    }

    onEditMode(val) {
        this.setState({editMode:val});
    }

    renderCal() {
        return (
            <InfiniteCalendar 
                selected={null}
                onSelect={(d)=>this.calSelected(d)}
                width={"100%"}
                height={400}
                autoFocus={false} 
                displayOptions={{
                    showHeader: false
                }}
                locale={{
                    locale: require('date-fns/locale/cs'), 
                    weekStartsOn: 1,
                    weekdays: ["Ne","Po","Út","St","Čt","Pá","So"],
                    todayLabel: {
                        long: "Dnes",
                        short: "Dnes"
                    }
                }}
                theme={{
                    todayColor: '#3f51b5',
                    weekdayColor: '#3f51b5',
                    selectionColor: '#3f51b5',
                    floatingNav: {
                        background: '#3f51b5',
                        color: '#FFF',
                        chevron: '#FFF'
                      }
                }}
                
                />
        );
    }

    renderLessons() {
        return (
            <LessonTabs lessonTypeId={this.props.lessonTypeId} lessonDate={this.state.currentDate} editMode={this.state.editMode}/>
        )
    }

    renderSettings() {
        return (
            <FormGroup row>
                <FormControlLabel
                    control={<Switch checked={this.state.editMode} onChange={(e,c)=>this.onEditMode(c)}/>}
                    label="Editace lekcí"
                />
            </FormGroup>
        )
    }


    render() {
        const { classes } = this.props;
        const cal = this.renderCal();
        const lessons = this.renderLessons();
        const sets = this.renderSettings();
        return (
            <div className={classes.root}>
            <Grid container>
                <Grid item xs={12} sm={5} md={4} lg={3}>
                    <Paper>
                    {cal}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={7} md={8} lg={9}>
                {lessons}
                </Grid>
            </Grid>
            <Typography type="caption"> 
                {sets}
                LessonType id:{this.props.lessonTypeId}
                {this.state.currentDate && ", selected date: "+ moment(this.state.currentDate).format()} 
            </Typography>
           
            </div>
        )
    }
}


LessonType.propTypes = {
    classes: PropTypes.object.isRequired,
    lessonTypeId: PropTypes.string.isRequired
};
  

export default compose(
    withStyles(styles)
)(LessonType)