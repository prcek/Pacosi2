import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Tabs, { Tab } from 'material-ui/Tabs';
import AddIcon from 'material-ui-icons/Add';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },

});
  


class LessonType extends React.Component {

    renderCal() {
        return (
            <InfiniteCalendar 
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
            <Paper>
                <Tabs value={1} scrollable scrollButtons="auto">
                    <Tab label="Lekce 12:30, 2/10" />
                    <Tab label="Lekce 11:00, 0/11" />
                    <Tab label="Lekce 0:00, 11/10"/>
                    <Tab icon={<AddIcon/>} />
                </Tabs>
            </Paper>
        )
    }

    render() {
        const cal = this.renderCal();
        const lessons = this.renderLessons();
        return (
            <div>
            <Typography> I Am LessonType (id:{this.props.lessonTypeId}) </Typography>

            <Grid container>
                <Grid item xs={12} sm={5} md={4} lg={3}>
                    {cal}
                </Grid>
                <Grid item xs={12} sm={7} md={8} lg={9}>
                    {lessons}
                </Grid>
            </Grid>
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