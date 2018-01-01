import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import DateTimeView from './DateTimeView';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');



const LessonInfo = gql`
  query LessonInfo($lesson_id: ID!) {
    lessonInfo(id:$lesson_id) {
        id,datetime,capacity
        lesson_type {
            name
            location {
              name
            }
        }
    }
  }
`;




const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        width: '100%',
        overflowX: 'auto',
        paddingLeft: theme.spacing.unit*3,
        paddingRight: theme.spacing.unit*3,
      },
      
      container: {
          display: 'flex',
          flexWrap: 'wrap',
      },
  
      field: {
          marginRight: theme.spacing.unit*3
      }
      
});
  


class LessonTabEdit extends React.Component {

  
    render() {
        const { classes } = this.props;
        if (!(this.props.lessonInfo && this.props.lessonInfo.lessonInfo)) {
            return null;
        } 
        const lessonInfo = this.props.lessonInfo.lessonInfo;
        return (
            <div className={classes.root}>
            <Toolbar>
                <Typography type="title" className={classes.flex} noWrap> Editace lekce {lessonInfo.lesson_type.name} - {lessonInfo.lesson_type.location.name}, <DateTimeView date={lessonInfo.datetime} format="LLLL"/> </Typography>
            </Toolbar>
            <Typography type="caption"> Lesson Id: {this.props.lessonId} </Typography>
            </div>
        );
        
    }
}

LessonTabEdit.propTypes = {
    classes: PropTypes.object.isRequired,
    lessonId: PropTypes.string.isRequired,
};
  

export default compose(
    withStyles(styles),
    graphql(LessonInfo,{
        name: "lessonInfo",
        options: ({lessonId})=>({variables:{lesson_id:lessonId}})
    }),

)(LessonTabEdit)