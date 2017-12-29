import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import 'react-infinite-calendar/styles.css';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Tabs, { Tab } from 'material-ui/Tabs';
import AddIcon from 'material-ui-icons/Add';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },

});
  


class LessonTabs extends React.Component {





    render() {
        return (
            <Tabs value={1} scrollable scrollButtons="auto">
                <Tab label="Lekce 12:30, 2/10" />
                <Tab label="Lekce 11:00, 0/11" />
                <Tab label="Lekce 0:00, 11/10"/>
                <Tab icon={<AddIcon/>} />
            </Tabs>
        )
    }
}

LessonTabs.propTypes = {
    classes: PropTypes.object.isRequired,
    lessonTypeId: PropTypes.string.isRequired,
    lessonDate: PropTypes.object
};
  

export default compose(
    withStyles(styles)
)(LessonTabs)