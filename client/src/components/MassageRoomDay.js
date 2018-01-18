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
      massage_orders {
        id massage_type {name length} begin
      }
    
    }
  }
`;


const AddOpeningTime = gql`
    mutation AddOpeningTime($massage_room_id: ID! $begin: DateTime!, $end: DateTime!) {
        addOpeningTime(massage_room_id:$massage_room_id,begin:$begin,end:$end) {
            id
        }
    }
`;

const DeleteOpeningTime = gql`
    mutation DeleteOpeningTime($id: ID!) {
        deleteOpeningTime(id:$id) {
            id
        }
    }
`;


const styles = theme => ({
    root: {
   //   marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    
    flex: {
        flex: 1,
    },
    toolbar: {
        minHeight:50
    },
    
    weekline: {
        display:'flex'
    },
    daycard: {
        
    },
    button: {
        marginLeft: theme.spacing.unit * 3
    },
    warn: {
        margin: theme.spacing.unit * 3,
        color: 'red'
    }
});
  

class MDController {

    sortByRange(array) {
        return Lodash.sortBy(array,[function(o) { return o.range.toDate()[0]; },function(o) { return o.range.toDate()[1]; }])
    }
    umbrellaRange(array) {
        const begins = array.map((x)=>{return x.range.start.toDate()});
        const ends = array.map((x)=>{return x.range.end.toDate()});
        const begin = Lodash.min(begins);
        const end = Lodash.max(ends);
        if (begin && end) {
            const res =  moment.range(begin,end);
            return res;
        }
        return null;
    }    
    

    updateSlots() {

        this.opening_times_range = this.umbrellaRange(this.opening_times);
        this.massage_orders_range = this.umbrellaRange(this.massage_orders);


        if (this.opening_times_range && this.massage_orders_range) {
            this.slots_range = this.umbrellaRange([{range:this.opening_times_range},{range:this.massage_orders_range}]);
        } else {
            this.slots_range = this.opening_times_range;
        }

        if (this.slots_range) {
            const slots = Array.from(this.slots_range.by('minutes', { step: 30, exclusive: true })).map(s=>{
                if (this.massage_orders_range) {
                    const r = this.massage_orders.find((r)=>{
                        return s.isSameOrAfter(r.range.start) && s.isBefore(r.range.end);
                    });
                    if (r) {
                        const cont = s.isAfter(r.range.start);
                        return {begin:s.toDate(),type:"o",cont:cont,order:r.massage_order,len:r.massage_order.massage_type.length}
                    }
                } 

                if (this.opening_times_range) {
                    const r = this.opening_times.find((r)=>{
                        return s.isSameOrAfter(r.range.start) && s.isBefore(r.range.end);
                    });
                    if (r) {
                        return {begin:s.toDate(),type:"f",opening_time:r,len:30}
                    }
                }

                return {begin:s.toDate(),type:"b",len:30};
            })

            for(let si=1; si<slots.length;si++) {
                if (slots[si].type==="b") {
                    slots[si].cont = (slots[si-1].type==="b");
                }
            }
            var cumb =0;
            for(let si=slots.length-1; si>=0; si--) {
                if (slots[si].type==='b') {
                    if (slots[si].cont) {
                        cumb+=30;
                    } else {
                        slots[si].len = 30+cumb;
                        cumb = 0;
                    }
                }
            }

            this.slots = slots.filter(s=>{
                return !( 
                    (s.type==='b' && s.cont) || 
                    (s.type==='o' && s.cont)
                );
            });
        } else {
            this.slots=[];
        }

    }

    constructor(date,opening_times=[],massage_orders=[]) {
        this.day = moment(date).startOf("day");
        this.day_range = moment.range(this.day,moment(this.day).add(1,"day"));
        this.opening_times = this.sortByRange(opening_times.map(ot=>{
            return {id:ot.id,type:"ot",opening_time:ot,range:moment.range(ot.begin,ot.end)}
        }));
        this.massage_orders = this.sortByRange(massage_orders.map(mo=>{
            const begin = moment(mo.begin).toDate()
            const end = moment(mo.begin).add(mo.massage_type.length,"minutes").toDate();
            return {id:mo.id,type:"mo",massage_order:mo,range:moment.range(begin,end)} 
        }));
        this.updateSlots();
    }

    getSlots() {
        return this.slots.map(s=>{
            return {break:s.type==="b",order:s.type==="o"?s.order:null,begin:s.begin,len:Math.trunc(s.len/30)}
        })
    }
}

function prepareSlots(current_date,opening_times,massage_orders) {
    var mdc = new MDController(current_date,opening_times,massage_orders)
    return mdc.getSlots();
}



class MassageRoomDay extends React.Component {
 
    constructor(props) {
        super(props);
        this.state = {
            planMode: false,
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
        const {opening_times,massage_orders}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
        const testSlots = prepareSlots(this.props.day,opening_times,massage_orders);

        console.log("OTS",opening_times);
        console.log("MOS",massage_orders);
        console.log("SLOTS",testSlots)


        const tplan = Lodash.sortBy(opening_times,['begin']).map(ot=>{
            const range = moment.range(ot.begin,ot.end);
            const slots = Array.from(range.by('minutes',{step:30})).map(x=>{return {date:x.toDate(),break:false,len:1}})
            const last_date = moment(Lodash.last(slots).date).add(30,'minutes').toDate();
            return [...slots,{date:last_date,break:true,len:1}]
        });
        const plan = Lodash.dropRight(Lodash.flatten(tplan));
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
            return "Začátek není před koncem"
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
        this.props.addOpeningTime({variables:{
            massage_room_id: this.props.massageRoomId,
            begin: this.state.newOtItem.begin,
            end:this.state.newOtItem.end 
        }}).then(({ data }) => {
            console.log('got data', data);
        }).catch((error) => {
            console.log('there was an error sending the query', error);
        });

    }
    handleOtTimeDelete = (id) => {
        console.log("handleOtTimeDelete",id);
        this.props.deleteOpeningTime({variables:{
            id: id,
        }}).then(({ data }) => {
            console.log('got data', data);
        }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    }

    renderDayPlanNewOt() {
        const { classes } = this.props;

        var ranges = [];
        var m = moment(this.props.day).startOf('day').add(7,'hours');
        var m2 = moment(m).add(780,'minutes');
        ranges.push({begin:m.toDate(),end:m2.toDate()});


        return (
            <div>
                <Toolbar> 
                    <TimeField label={"OD"} ranges={ranges} value={this.state.newOtItem.begin} onChange={(e)=>this.handleNewOtTime("begin",e.target.value)} />
                    <TimeField label={"DO"} ranges={ranges} value={this.state.newOtItem.end} onChange={(e)=>this.handleNewOtTime("end",e.target.value)} />
                    <Button className={classes.button} disabled={this.checkNewOt()!==null}raised onClick={this.handleNewOtTimeSave}> přidat </Button>
                </Toolbar>
                <Typography className={classes.warn}> {this.checkNewOt()} </Typography>
            </div>
        )
    }
    renderDayPlanOt(ot) {
        const { classes } = this.props;
        return (
            <Toolbar key={ot.id}> 
                <Typography> <DateTimeView date={ot.begin} format={"HH:mm"} /> - <DateTimeView date={ot.end} format={"HH:mm"} /> </Typography>
                <Button  className={classes.button} raised onClick={()=>this.handleOtTimeDelete(ot.id)}> smazat </Button>
            </Toolbar>
        )
    }

    renderDayPlan() {
        const { classes } = this.props;
        const {opening_times}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
        const ot = Lodash.sortBy(opening_times,['begin']).map(o=>{return this.renderDayPlanOt(o)})
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
                <Toolbar classes={{root:classes.toolbar}}>
                    <Typography type={"title"}><DateTimeView date={this.props.day}/></Typography>
                    <Typography color="inherit" className={classes.flex}>&nbsp;</Typography>
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
    graphql(AddOpeningTime,{
        name:"addOpeningTime",
        options: {
            refetchQueries: [
                'MassageRoomDayPlan',
                'MassageRoomDayInfos'
              ],
        }
    }),
    graphql(DeleteOpeningTime,{
        name:"deleteOpeningTime",
        options: {
            refetchQueries: [
                'MassageRoomDayPlan',
                'MassageRoomDayInfos'
              ],
        }
    })


)(MassageRoomDay)