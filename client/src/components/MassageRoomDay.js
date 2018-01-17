import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import MassageDaySlot from './MassageDaySlot';
import DateTimeView from './DateTimeView';
import TimeField from './TimeField';

import Switch from 'material-ui/Switch';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Lodash from 'lodash';


const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
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
 
    constructor(props) {
        super(props);
        this.state = {
            planMode: true,
            newOt: false,
            newOtItem: {
                begin: this.props.day,
                end: this.props.day
            }
        };
    }

    onPlanMode(val) {
        this.setState({planMode:val});
    }

    componentWillReceiveProps(nextProps) {
        if (!moment(this.props.day).isSame(nextProps.day,'day')) {
            this.setState({newOtItem:{begin:nextProps.day,end:nextProps.day}});
        }
    }
   
 
    renderDayDetail() {
        const {opening_times}  = this.props.massageRoomDayPlan.massageRoomDayPlan;

        const tplan = opening_times.map(ot=>{
            const range = moment.range(ot.begin,ot.end);
            const slots = Array.from(range.by('minutes',{step:30})).map(x=>{return {date:x.toDate(),break:false,len:1}})
            const last_date = moment(Lodash.last(slots).date).add(30,'minutes').toDate();
            return [...slots,{date:last_date,break:true,len:1}]
        });
        const plan = Lodash.dropRight(Lodash.flatten(tplan));
        //console.log(plan)
        const mds = plan.map(s=>{
            return (
                <MassageDaySlot key={s.date.toISOString()} break={s.break} time={s.date} length={s.len} /> 
            )
        });
        
        return (
            <div>
                {mds}
            </div>
        )
    }

    checkNewOt() {
        if (moment(this.state.newOtItem.begin).isSameOrAfter(this.state.newOtItem.end)) {
            return "Zacatek neni pred koncem"
        }
        const range = moment.range(this.state.newOtItem.begin,this.state.newOtItem.end);
        const {opening_times}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
        const ranges = opening_times.map(x=>{return moment.range(x.begin,x.end)});
        const overlap =ranges.find(r=>{
            return r.overlaps(range);
        })
        return overlap?"Překryv s existujícím intervalem":null;
    }

    handleNewOtTime = (field,date) => {
        const {newOtItem} = this.state
        newOtItem[field] = date;
        this.setState({newOtItem:newOtItem})
    }

    handleNewOtTimeSave = () => {
        console.log("handleNewOtTimeSave");
    }
    handleOtTimeDelete = (id) => {
        console.log("handleOtTimeDelete",id);
    }

    renderDayPlanNewOt() {


        var ranges = [];
        var m = moment(this.props.day).startOf('day').add(7,'hours');
        var m2 = moment(m).add(780,'minutes');
        ranges.push({begin:m.toDate(),end:m2.toDate()});


        return (
            <div>
            <Toolbar> 
                <TimeField label={"OD"} ranges={ranges} value={this.state.newOtItem.begin} onChange={(e)=>this.handleNewOtTime("begin",e.target.value)} />
                <TimeField label={"DO"} ranges={ranges} value={this.state.newOtItem.end} onChange={(e)=>this.handleNewOtTime("end",e.target.value)} />
                <Button disabled={this.checkNewOt()!==null}raised onClick={this.handleNewOtTimeSave}> přidat </Button>
            </Toolbar>
            <Typography> {this.checkNewOt()} </Typography>
            </div>
        )
    }
    renderDayPlanOt(ot) {
        return (
            <Toolbar key={ot.id}> 
                <Typography> <DateTimeView date={ot.begin} format={"HH:mm"} /> - <DateTimeView date={ot.end} format={"HH:mm"} /> </Typography>
                <DateTimeView date={ot.begin} />
                <Button raised onClick={()=>this.handleOtTimeDelete(ot.id)}> smazat </Button>
            </Toolbar>
        )
    }

    renderDayPlan() {
        const { classes } = this.props;
        const {opening_times}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
        const ot = opening_times.map(o=>{return this.renderDayPlanOt(o)})
        const not = this.renderDayPlanNewOt();
        return (
            <div>
                <Toolbar > 
                        <Typography> přehled otvírací doby pro den </Typography>
                </Toolbar>
                {ot}
                {not}
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
        const dd = this.props.massageRoomDayPlan.massageRoomDayPlan?this.renderDayDetail():null;
        const pm = this.props.massageRoomDayPlan.massageRoomDayPlan?this.renderDayPlan():null;
        return (
            <div className={classes.root}>
                <Toolbar >
                    <Typography><DateTimeView date={this.props.day}/></Typography>
                    {this.renderSettingsSwitch()}
                </Toolbar>  
                <Paper>
                    {this.state.planMode?pm:dd}    
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