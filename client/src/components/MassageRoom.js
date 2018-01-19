import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import Grid from 'material-ui/Grid';
import MassageRoomCal from './MassageRoomCal';
import MassageRoomDay from './MassageRoomDay';
import MassageOrder from './MassageOrder';
import Switch from 'material-ui/Switch';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

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
        
    }
});
  


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

    handleNewOrder = (d) => {
        const order = {
            massage_room_id:this.props.massageRoomId,
            begin:d
        }
        this.setState({massageOrder:order})
    }
    handleEditOrder = (order) => {
        
    }

    handleSaveOrder = () => {
        console.log("handleSaveOrder")
    }
 
    handleMassageOrderChange = (f,v) => {
        const {massageOrder} = this.state
        massageOrder[f]=v;
        this.setState({massageOrder:massageOrder});
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
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                       <MassageRoomCal massageRoomId={this.props.massageRoomId} begin={this.state.calendarStartDate} selected={this.state.calendarDay} onSelectDay={this.handleSelectDay} onMove={this.handleCalMove}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        {this.state.calendarDay && <MassageRoomDay massageRoomId={this.props.massageRoomId} day={this.state.calendarDay} onNew={this.handleNewOrder} onEdit={this.handleEditOrder}/>}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        {this.state.massageOrder && <MassageOrder massageOrder={this.state.massageOrder} onMassageOrderChange={this.handleMassageOrderChange} onSave={this.handleSaveOrder}/>}
                    </Grid>
                </Grid>


            <Typography type="caption"> 
                MassageRoom id:{this.props.massageRoomId}
                {this.state.currentDate && ", selected date: "+ moment(this.state.currentDate).format()} 
            </Typography>
            </div>
        )
    }
}


MassageRoom.propTypes = {
    classes: PropTypes.object.isRequired,
    massageRoomId: PropTypes.string.isRequired
};
  

export default compose(
    withStyles(styles)
)(MassageRoom)