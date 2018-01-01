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
import TextField from 'material-ui/TextField';


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
      },
      
    flex: {
        flex: 1,
    },

    button: {
        margin: theme.spacing.unit,
    },

    container: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingLeft: theme.spacing.unit*3,
        paddingRight: theme.spacing.unit*3,
    },
  
    field: {
        marginRight: theme.spacing.unit*3
    }
      
});
  
const time_regexp = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
const capacity_regexp = /^[0-9]+$/;


class LessonTabEdit extends React.Component {

    state = {
        timestr:"",
        capacitystr:""
    }

    handleChange(name,value){
        this.setState({
          [name]: value,
        });
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.lessonInfo && nextProps.lessonInfo.lessonInfo) {
            if (!(this.props.lessonInfo && this.props.lessonInfo.lessonInfo)) {
                if (!nextProps.lessonInfo.loading) {
                    this.setState({timestr:moment(nextProps.lessonInfo.lessonInfo.datetime).format("HH:mm"),capacitystr:""+nextProps.lessonInfo.lessonInfo.capacity});
                }
            } else {
                if (!nextProps.lessonInfo.loading) {
                    this.setState({timestr:moment(nextProps.lessonInfo.lessonInfo.datetime).format("HH:mm"),capacitystr:""+nextProps.lessonInfo.lessonInfo.capacity});
                }
            }
        }
    }    

    render() {
        const { classes } = this.props;
        if (!(this.props.lessonInfo && this.props.lessonInfo.lessonInfo)) {
            return null;
        } 
        const lessonInfo = this.props.lessonInfo.lessonInfo;

        const timeerror = this.state.timestr.length>0 && !this.state.timestr.match(time_regexp);
        const timevalid = this.state.timestr.length>0 && ! timeerror;
        const capacityerror = this.state.capacitystr.length>0 && !this.state.capacitystr.match(capacity_regexp);
        const capacityvalid = this.state.capacitystr.length>0 && ! capacityerror;


        return (
            <div className={classes.root}>
                <Toolbar>
                    <Typography type="title" className={classes.flex} noWrap> Editace lekce {lessonInfo.lesson_type.name} - {lessonInfo.lesson_type.location.name}, <DateTimeView date={lessonInfo.datetime} format="LLLL"/> </Typography>
                    <Button raised className={classes.button} > Smazat lekci </Button>
                </Toolbar>
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
                <div className={classes.container}>
                <Button raised disabled={!capacityvalid || !timevalid} onClick={()=>this.submitSave()}>Uložit</Button>
                </div>

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