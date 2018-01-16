import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import MassageDaySlot from './MassageDaySlot';
import DateTimeView from './DateTimeView';
import Switch from 'material-ui/Switch';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');


const MassageRoomDayPlan = gql`
  query MassageRoomDayPlan($massage_room_id: ID! $date: Date! ) {
    massageRoomDayPlan(massage_room_id:$massage_room_id, date:$date) {
      opening_times {
          id,begin,end
      }
    }
  }
`;


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    weekline: {
        display:'flex'
    },
    daycard: {
        
    }
});
  


class MassageRoomDay extends React.Component {
    state = {
        planMode: true
    }

    onPlanMode(val) {
        this.setState({planMode:val});
    }

 
    renderDayDetail() {
        return (
            <div>
                <MassageDaySlot />
                <MassageDaySlot length={2}/>
                <MassageDaySlot />
                <MassageDaySlot length={4}/>
                <MassageDaySlot />
                <MassageDaySlot length={3}/>
                <MassageDaySlot length={2}/>
                <MassageDaySlot />
                <MassageDaySlot />
            </div>
        )
    }

    renderSettingsSwitch() {
        return (
            <FormGroup row>
                <FormControlLabel
                    control={<Switch checked={this.state.planMode} onChange={(e,c)=>this.onPlanMode(c)}/>}
                    label="Editace dne"
                />
            </FormGroup>
        )
    }



    render() {
        const { classes } = this.props;
        const dd = this.renderDayDetail();
        return (
            <div className={classes.root}>
                <Toolbar >
                    <Typography><DateTimeView date={this.props.day}/></Typography>
                    {this.renderSettingsSwitch()}
                </Toolbar>  
                <Paper>
                    {dd}    
                </Paper>
            </div>
        )
    }
}


MassageRoomDay.propTypes = {
    classes: PropTypes.object.isRequired,
    massageRoomId: PropTypes.string.isRequired,
    day: PropTypes.objectOf(Date).isRequired
};
  

export default compose(
    withStyles(styles),
    graphql(MassageRoomDayPlan,{
        name: "massageRoomDayPlan",
        options: ({massageRoomId,day})=>({
            variables:{
                massage_room_id:massageRoomId,
                date: moment(day).format('YYYY-MM-DD'),
            }
        })
    }),

)(MassageRoomDay)