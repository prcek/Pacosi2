import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

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

    render() {
        const cal = this.renderCal();
        return (
            <div>
            <Typography> I Am LessonType (id:{this.props.lessonTypeId}) </Typography>
            {cal}
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