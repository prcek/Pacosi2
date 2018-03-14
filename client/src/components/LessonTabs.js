import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import Tabs, { Tab } from 'material-ui/Tabs';
import AddIcon from 'material-ui-icons/Add';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import LessonTab from './LessonTab';
import LessonTabEdit from './LessonTabEdit';
import LessonTabAdd from './LessonTabAdd';
import Paper from 'material-ui/Paper';
//import Typography from 'material-ui/Typography/Typography';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');



const LessonsInfo = gql`
  query LessonsInfo($lesson_type_id: ID! $lesson_date: Date!) {
    lessonsInfo(lesson_type_id:$lesson_type_id, date:$lesson_date) {
      id,datetime,members_count,capacity
    }
  }
`;




const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },

});
  


class LessonTabs extends React.Component {

    state= {
        currentTab:false
    }

    handleTabChange(value) {
        this.setState({currentTab:value})
    };
    
    componentWillReceiveProps(nextProps) {
        if (this.state.currentTab) {
            if (nextProps.lessonsInfo && nextProps.lessonsInfo.lessonsInfo) {
                if (!nextProps.lessonsInfo.lessonsInfo.find((i)=>{return i.id === this.state.currentTab})){
                    this.setState({currentTab:false});
                }
            }
        }
    }

    lessonTitle(li) {
        return "Lekce "+moment(li.datetime).format('L HH:mm')+", "+li.members_count+"/"+li.capacity
    }

    renderTabs() {
        if (this.props.lessonsInfo.lessonsInfo.length === 0) {
            return (
                <Tab label={"V tento den není žádná lekce"} disabled/>
            )
        } 

        const tabs = this.props.lessonsInfo.lessonsInfo.map(li=> (
            <Tab key={li.id} value={li.id} label={this.lessonTitle(li)}/>
          ));
        return tabs;
      
    }

    renderTab() {
        if (this.state.currentTab==="new") {
            if (this.props.lessonDate) {
                return (<LessonTabAdd lessonTypeId={this.props.lessonTypeId} date={this.props.lessonDate}/>)
            } else {
                return null;
            }
        } else { 
            if (this.props.editMode) {
                return (<LessonTabEdit lessonId={this.state.currentTab}/>);
            } else {
                return (<LessonTab lessonId={this.state.currentTab}/>);
            }
        }
    }

    render() {
        return (
            <Paper>
                <Tabs value={this.state.currentTab} scrollable scrollButtons="auto" onChange={(e,v)=>this.handleTabChange(v)}>
                    {(this.props.lessonsInfo && this.props.lessonsInfo.lessonsInfo) && this.renderTabs()} 
                    {this.props.editMode && this.props.lessonDate && <Tab key="new" value="new" icon={<AddIcon/>} />}
                </Tabs>
                {this.state.currentTab && this.renderTab() }
            </Paper>
        )
    }
}

LessonTabs.propTypes = {
    classes: PropTypes.object.isRequired,
    lessonTypeId: PropTypes.string.isRequired,
    editMode: PropTypes.bool,
    lessonDate: PropTypes.object
};
  

export default compose(
    withStyles(styles),
    graphql(LessonsInfo,{
        name: "lessonsInfo",
        skip: (ownProps) =>  !ownProps.lessonDate, 
        options: ({lessonTypeId,lessonDate})=>({
            variables:{lesson_type_id:lessonTypeId,lesson_date:moment(lessonDate).format('YYYY-MM-DD')},
            fetchPolicy:"cache-and-network"
        })
    }),

)(LessonTabs)