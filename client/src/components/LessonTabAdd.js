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

var moment_tz = require('moment-timezone');


const LessonTypeInfo = gql`
  query LessonType($lesson_type_id: ID!) {
    lessonType(id:$lesson_type_id) {
        id name location {
            name
        }
    }
  }
`;


const SubmitNewLesson = gql`
    mutation SubmitNewLesson($lesson_type_id: ID!, $capacity: Int!, $datetime: DateTime!) {
        addLesson(lesson_type_id:$lesson_type_id,capacity:$capacity,datetime:$datetime) {
            id
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
  
const time_regexp = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
const capacity_regexp = /^[0-9]+$/;

class LessonTabAdd extends React.Component {
    state = {
        timestr:"",
        capacitystr:""
    }

    handleChange(name,value){
        this.setState({
          [name]: value,
        });
    }

    submitNew() {
        console.log("submitNew")
        const datetime_str = moment(this.props.date).format("YYYY-MM-DD")+" "+this.state.timestr;
        const resdt = moment_tz.tz(datetime_str,"Europe/Prague").tz("UTC").format();
        console.log(resdt);
        this.props.submitNew({variables:{
            lesson_type_id: this.props.lessonTypeId,
            capacity: this.state.capacitystr,
            datetime:resdt 
        }}).then(({ data }) => {
            console.log('got data', data);
        }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    }


    render() {
        const { classes } = this.props;
        const lessonType = this.props.lessonType ? this.props.lessonType.lessonType : null;
        const timeerror = this.state.timestr.length>0 && !this.state.timestr.match(time_regexp);
        const timevalid = this.state.timestr.length>0 && ! timeerror;
        const capacityerror = this.state.capacitystr.length>0 && !this.state.capacitystr.match(capacity_regexp);
        const capacityvalid = this.state.capacitystr.length>0 && ! capacityerror;

        return (
            <div className={classes.root}>
                <Typography variant="title"> Přidání nové lekce 
                    {lessonType && (<span>{" "+lessonType.name + " - " +lessonType.location.name+", "}</span>)}
                    <DateTimeView date={this.props.date} format="LL" />
                </Typography>
                <div className={classes.container}>
                <TextField className={classes.field}
                    label="Čas"
                    error={timeerror}
                    value={this.state.timestr}
                    onChange={(e)=>this.handleChange("timestr",e.target.value)}
                    margin="normal"
                    helperText="čas začátku lekce, např. 16:30"
                />
                <TextField className={classes.field}
                    label="Kapacita"
                    error={capacityerror}
                    value={this.state.capacitystr}
                    onChange={(e)=>this.handleChange("capacitystr",e.target.value)}
                    margin="normal"
                    helperText="maximální počet účastníků lekce, např. 10"
                />
                </div>
                <Button variant="raised" disabled={!capacityvalid || !timevalid} onClick={()=>this.submitNew()}> Přidat lekci</Button>
                <Typography variant="caption"> LessonType Id: {this.props.lessonTypeId} </Typography>
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
    graphql(SubmitNewLesson,{
        name:"submitNew",
        options: {
            refetchQueries: [
                'LessonsInfo',
                'LessonTypeDayInfos'
              ],
        }
    })
)(LessonTabAdd)