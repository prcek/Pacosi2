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
import DateField from './DateField';
import TableEditor from './TableEditor';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import DebugInfo from './DebugInfo';
import Moment from 'moment';
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
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

const SubmitNewLessons = gql`
    mutation SubmitNewLessons($lesson_type_id: ID!, $capacity: Int!, $datetimes: [DateTime]!) {
        addLessons(lesson_type_id:$lesson_type_id,capacity:$capacity,datetimes:$datetimes) {
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
        capacitystr:"",
        end_date:null,
        repeat:false
    }

    handleChange(name,value){
        this.setState({
          [name]: value,
        });
    }


    getDates() {

        if (!this.state.timestr.match(time_regexp)) {
            return null;
        }
        if (this.state.end_date === null) {
            return null;
        }
        if (moment(this.props.date).isAfter(this.state.end_date)) {
            return null;
        }
        var range = moment.range(moment(this.props.date),moment(this.state.end_date));
        var days = Array.from(range.by('weeks'));
        if (days.length>20) {
            return null;
        }
        return days.map(d=>{
            const datetime_str = moment(d).format("YYYY-MM-DD")+" "+this.state.timestr;
            return moment_tz.tz(datetime_str,"Europe/Prague").tz("UTC").format();
        });
    }

    createOne() {
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
    
    createMulti() {
        const resdts = this.getDates();
        console.log(resdts);
        if (resdts === null) {
            return ;
        }
        this.props.submitNewMulti({variables:{
            lesson_type_id: this.props.lessonTypeId,
            capacity: this.state.capacitystr,
            datetimes:resdts 
        }}).then(({ data }) => {
            console.log('got data', data);
        }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    }
 
    submitNew() {
        console.log("submitNew")
        if (this.state.repeat) {
            this.createMulti();
        } else {
            this.createOne();
        }

    }


    render() {
        const { classes } = this.props;
        const lessonType = this.props.lessonType ? this.props.lessonType.lessonType : null;
        const timeerror = this.state.timestr.length>0 && !this.state.timestr.match(time_regexp);
        const timevalid = this.state.timestr.length>0 && ! timeerror;
        const capacityerror = this.state.capacitystr.length>0 && !this.state.capacitystr.match(capacity_regexp);
        const capacityvalid = this.state.capacitystr.length>0 && ! capacityerror;
        const repdays = this.getDates();
        const repeatvalid = (!this.state.repeat) || (repdays !== null)
        return (
            <div className={classes.root}>
                <Typography variant="title"> Přidání nové lekce 
                    {lessonType && (<span>{" "+lessonType.name + " - " +lessonType.location.name+", "}</span>)}
                    <DateTimeView date={this.props.date} format="LL" />
                </Typography>
                <div className={classes.container}>
                <FormGroup row>
             
                <TextField className={classes.field}
                    label="Čas"
                    error={timeerror}
                    value={this.state.timestr}
                    onChange={(e)=>this.handleChange("timestr",e.target.value)}
                    margin="dense"
                    helperText="čas začátku lekce, např. 16:30"
                />

 
                <TextField className={classes.field}
                    label="Kapacita"
                    error={capacityerror}
                    value={this.state.capacitystr}
                    onChange={(e)=>this.handleChange("capacitystr",e.target.value)}
                    margin="dense"
                    helperText="maximální počet účastníků lekce, např. 10"
                />

                 <FormControlLabel
                        control={
                            <Switch
                              checked={this.state.repeat}
                              onChange={(e)=>this.handleChange('repeat',e.target.checked)}
                            value="checkedR"
                            color="primary"
                            />
                        }
                        label="Opakovat lekci"
                />
                {this.state.repeat && (
                    <DateField 
                        margin="dense"
                        id="end_date"
                        label="Konec opakování"
                        value={TableEditor.null2empty(this.state.end_date)}
                        onChange={(e)=>this.handleChange("end_date",TableEditor.empty2null(e))}
                        helperText="Opakování ve stejný den v týdnu, nejdéle do zvoleného data"
                     />
                )}
                </FormGroup>
                </div>
                {this.state.repeat && (
                    <div>
                    <Typography variant="subheading"> Termíny lekci: </Typography>
                    <ul>
                    {repdays && repdays.map((d,idx)=>{
                        return (
                           <li key={idx}><Typography  variant="body2"><DateTimeView date={d} format="LLL" /></Typography> </li>
                        )
                    })}
                    </ul>
                    </div>
                )}
                
                <Button variant="raised" disabled={!capacityvalid || !timevalid || !repeatvalid} onClick={()=>this.submitNew()}> 
                    {this.state.repeat?"Přidat lekce opakovaně":"Přidat lekci"}
                </Button>
                <DebugInfo> LessonType Id: {this.props.lessonTypeId} </DebugInfo>
                
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
    }),
    graphql(SubmitNewLessons,{
        name:"submitNewMulti",
        options: {
            refetchQueries: [
                'LessonsInfo',
                'LessonTypeDayInfos'
              ],
        }
    })

)(LessonTabAdd)