import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import DateTimeView from './DateTimeView';
var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');


const LessonTypeInfo = gql`
  query LessonType($lesson_type_id: ID!) {
    lessonType(id:$lesson_type_id) {
        id name location {
            name
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
  


class LessonTabAdd extends React.Component {

    
    render() {
        const { classes } = this.props;
        const lessonType = this.props.lessonType ? this.props.lessonType.lessonType : null;
        console.log("lessonType",lessonType)
        return (
            <div className={classes.root}>
                <Typography type="title"> Přidání nové lekce 
                    {lessonType && (<span>{" "+lessonType.name + " - " +lessonType.location.name+", "}</span>)}
                    <DateTimeView date={this.props.date} format="LL" />
                </Typography>
                <div className={classes.container}>
                <TextField className={classes.field}
                    label="Čas"
                    margin="normal"
                    helperText="čas začátku lekce, např. 16:30"
                />
                <TextField className={classes.field}
                    label="Kapacita"
                    margin="normal"
                    helperText="maximální počet účastníků lekce, např. 10"
                />
                </div>
                <Button raised> Přidat lekci</Button>
                <Typography type="caption"> LessonType Id: {this.props.lessonTypeId} </Typography>
            </div>
        );
        
    }
}

LessonTabAdd.propTypes = {
    classes: PropTypes.object.isRequired,
    lessonTypeId: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired
};
  

export default compose(
    withStyles(styles),
    graphql(LessonTypeInfo,{
        name: "lessonType",
        options: ({lessonTypeId})=>({variables:{lesson_type_id:lessonTypeId}})
    }),
)(LessonTabAdd)