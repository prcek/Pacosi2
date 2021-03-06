import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import Grid from 'material-ui/Grid';
//import MassageRoomCal from './MassageRoomCal';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import MassageRoomDay from './MassageRoomDay';
import Switch from 'material-ui/Switch';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import MassageRoomCal from './MassageRoomCal';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import DebugInfo from './DebugInfo';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('cs');



const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    weekline: {
        display:'flex'
    },
    daycard: {
        
    },
    toolbar: {
        minHeight:50
    },

});
  
const CurrentMassageRoom = gql`
  query MassageRoom($massage_room_id: ID!) {
    massageRoom(id:$massage_room_id) {
      id
      name
      location_id
      location {
          name
      }
    }
  }
`;


class MassageRoom extends React.Component {
    state = {
        calendarStartDate: moment().startOf('week').toDate(),
        calendarDay: moment().startOf('day').toDate(),
        massageOrder: {
            massage_room_id:this.props.massageRoomId,
            begin: moment().startOf('day').add(7,'hours').toDate()
        }
    }

 

    handleSelectDay = (d) => {
        this.setState({calendarDay:d});
    }

    handleCalMove = (d) => {
        this.setState({calendarStartDate:d});
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
        return (
            <div className={classes.root}>

                <Grid container>
                    <Grid item xs={12} sm={12} md={4} lg={3}>
                        <Toolbar classes={{root:classes.toolbar}}> 
                        {this.props.massageroom.massageRoom  && <Typography variant="title">{this.props.massageroom.massageRoom.name}</Typography> }
                        </Toolbar>
                        <MassageRoomCal massageRoomId={this.props.massageRoomId} massageRoom={this.props.massageroom.massageRoom} begin={this.state.calendarStartDate} selected={this.state.calendarDay} onSelectDay={this.handleSelectDay} onMove={this.handleCalMove}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={9}>
                        {this.state.calendarDay && <MassageRoomDay massageRoomId={this.props.massageRoomId} massageRoom={this.props.massageroom.massageRoom} day={this.state.calendarDay} onNew={this.handleNewOrder} onEdit={this.handleEditOrder}/>}
                    </Grid>
                </Grid>


                <DebugInfo> 
                    MassageRoom id:{this.props.massageRoomId}
                    {this.state.calendarDay && ", selected date: "+ moment(this.state.calendarDay).format()} 
                </DebugInfo>

            </div>
        )
    }
}


MassageRoom.propTypes = {
    classes: PropTypes.object.isRequired,
    massageRoomId: PropTypes.string.isRequired
};
  

export default compose(
    withStyles(styles),
    graphql(CurrentMassageRoom,{
        name: "massageroom",
        options: ({massageRoomId})=>({variables:{massage_room_id:massageRoomId}})
    }),
)(MassageRoom)