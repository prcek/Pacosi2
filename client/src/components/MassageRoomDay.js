import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import MassageDaySlot from './MassageDaySlot';
import DateTimeView from './DateTimeView';
import TimeField from './TimeField';
import MassageOrder from './MassageOrder';
import CloseIcon from 'material-ui-icons/Close';
import IconButton from 'material-ui/IconButton';
import Switch from 'material-ui/Switch';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
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
        id massage_type {name length} massage_type_id begin customer_name comment
      }
      status 
      slots {
          date break free order {id massage_type {name length} massage_type_id begin customer_name comment} len clen
      }
      massage_types {
        id name length hidden
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


const AddMassageOrder = gql`
    mutation AddMassageOrder($massage_room_id: ID! $massage_type_id: ID! $begin: DateTime!, $customer_name: String!, $comment: String ) {
        addMassageOrder(massage_room_id:$massage_room_id, massage_type_id:$massage_type_id, begin:$begin,customer_name:$customer_name, comment:$comment) {
            id
        }
    }
`;

const UpdateMassageOrder = gql`
    mutation UpdateMassageOrder($id: ID! $massage_type_id: ID $begin: DateTime, $customer_name: String, $comment: String ) {
        updateMassageOrder(id:$id, massage_type_id:$massage_type_id, begin:$begin,customer_name:$customer_name, comment:$comment) {
            id
        }
    }
`;

const DeleteMassageOrder = gql`
    mutation DeleteMassageOrder($id: ID!) {
        deleteMassageOrder(id:$id) {
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
  


class MassageRoomDay extends React.Component {
 
    constructor(props) {
        super(props);
        this.state = {
            planMode: false,
            open_mod: false,
            newOt: false,
            newOtItem: {
                begin: this.props.day,
                end: this.props.day
            },
            massageOrder: null
        
            
        };
    }

    onPlanMode(val) {
        this.setState({planMode:val});
    }

    componentWillReceiveProps(nextProps) {
        if (!moment(this.props.day).isSame(nextProps.day,'day')) {
            this.setState({newOtItem:{begin:nextProps.day,end:nextProps.day},massageOrder:null});
        }
    }
   
 
    renderDayDetail(slots) {

        if (slots.length === 0) {
            return (
                <Typography>v tento den není otvírací doba</Typography>
            )
        }

        const mds = slots.map((s,idx)=>{
            return (
                <MassageDaySlot key={idx} break={s.break} time={moment(s.date).toDate()} order={s.order} length={s.len} clen={s.clen} onClick={this.handleSlotClick} /> 
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

    handleSlotClick = (d,order) => {
        console.log("handleSlotClick",d,order);
        if (order) {
            const mo = {
                id: order.id,
                massage_room_id: this.props.massageRoomId,
                begin:order.begin,
                massage_type_id: order.massage_type_id,
                customer_name: order.customer_name,
                comment: order.comment
            }
            const c = this.checkOrder(mo);
            this.setState({massageOrder:mo,moCorrect:c})
        } else {
            const mo = {
                massage_room_id: this.props.massageRoomId,
                begin:d
            }
            this.setState({massageOrder:mo,moCorrect:false})
        }
    }

    handleCancelOrder = () => {
        this.setState({massageOrder:null})
    }


    handleSaveOrder = () => {
        console.log("handleSaveOrder",this.state.massageOrder)
        this.setState({moWait:true})

        if (this.state.massageOrder.id) {
            this.props.updateMassageOrder({variables:{
                id: this.state.massageOrder.id,
                massage_type_id: this.state.massageOrder.massage_type_id,
                begin: this.state.massageOrder.begin,
                customer_name: this.state.massageOrder.customer_name,
                comment: this.state.massageOrder.comment
            }}).then(({ data }) => {
                this.setState({moWait:false,moCorrect:false,massageOrder:null})
                console.log('got data', data);
            }).catch((error) => {
                this.setState({moWait:false,moCorrect:false})
                console.log('there was an error sending the query', error);
            });
    
        } else {
            this.props.addMassageOrder({variables:{
                massage_room_id: this.state.massageOrder.massage_room_id,
                massage_type_id: this.state.massageOrder.massage_type_id,
                begin: this.state.massageOrder.begin,
                customer_name: this.state.massageOrder.customer_name,
                comment: this.state.massageOrder.comment
            }}).then(({ data }) => {
                this.setState({moWait:false,moCorrect:false,massageOrder:null})
                console.log('got data', data);
            }).catch((error) => {
                this.setState({moWait:false,moCorrect:false})
                console.log('there was an error sending the query', error);
            });
        }

    }


    handleDeleteOrder = () => {
        this.setState({open_mod:true});
    }

 
    getMassageType(id) {
        if (!this.props.massageRoomDayPlan.massageRoomDayPlan) {
            return null;
        }
        return this.props.massageRoomDayPlan.massageRoomDayPlan.massage_types.find((i)=>{
            return i.id === id;
        })
        
    }
    getMassageOrder(id) {
        if (!this.props.massageRoomDayPlan.massageRoomDayPlan) {
            return null;
        }
        return this.props.massageRoomDayPlan.massageRoomDayPlan.massage_orders.find((i)=>{
            return i.id === id;
        })
    }

    getPossibleSlots(len,skip_order_id=null) {
        const slen = Math.trunc(len/30);
        if (!this.props.massageRoomDayPlan.massageRoomDayPlan) {
            return [];
        }
        const times = this.props.massageRoomDayPlan.massageRoomDayPlan.slots.reduce((a,s)=>{
            if (s.free) {
                return [...a,s.date]
            }
            if (s.order && s.order.id === skip_order_id) {
                const int = Array.from(moment.range(s.date,moment(s.date).add(30*s.len,"minutes")).by('minutes',{step:30,exclusive:true}))
                return [...a,...int]
            }
            return a;
        },[]);

        const ctimes = times.reduceRight((a,v)=>{
            if (a.length===0) {
                return [{date:v,clen:1}]
            }
            const last = a[0];
            if (moment(last.date).subtract(30,'minutes').isSame(v)) {
                return [{date:v,clen:last.clen+1},...a]    
            } else {
                return [{date:v,clen:1},...a]
            }
        },[]).filter(i=>{return i.clen>=slen}).map(i=>{return moment(i.date).toDate()})
        return ctimes;
    }

    checkOrderSlot(begin,len,skip_order_id=null) {
        console.log("checkOrderSlot",begin,len,skip_order_id)
        const times = this.getPossibleSlots(len,skip_order_id);
        const pos  = times.find(t=>{return moment(t).isSame(begin)});
        return pos !==undefined
    }

    checkOrder(order) {
        console.log("CHECK ORDER",order);
        if (!order.begin) { return false;}
        if (!moment(order.begin).isSame(this.props.day,"day")) {return false;}
        if (!order.customer_name) { return false;}
        if (!order.massage_type_id) { return false;}
        const massageType = this.getMassageType(order.massage_type_id);
        if (!massageType) {return false;}
        const massageLen = massageType.length;
        if (!this.checkOrderSlot(order.begin,massageLen,order.id)) { return false; }
        return true;
    }

    handleMassageOrderChange = (f,v) => {
        const {massageOrder} = this.state
        massageOrder[f]=v;


        const c = this.checkOrder(massageOrder);
        

        this.setState({massageOrder:massageOrder,moCorrect:c});
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
                    <Button className={classes.button} disabled={this.checkNewOt()!==null} variant="raised" onClick={this.handleNewOtTimeSave}> přidat </Button>
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
                <Button  className={classes.button} variant="raised" onClick={()=>this.handleOtTimeDelete(ot.id)}> smazat </Button>
            </Toolbar>
        )
    }

    renderDayPlan() {
       // const { classes } = this.props;
        const {opening_times}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
        const ot = Lodash.sortBy(opening_times,['begin']).map(o=>{return this.renderDayPlanOt(o)})
        const not = this.renderDayPlanNewOt();
        return (
            <div>
                <Toolbar > 
                        <Typography variant={"subheading"}> Nastavení provozní doby </Typography>
                </Toolbar>
                <Divider/>
                {ot}
                <Divider/>
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

    renderOrder() {
        const { classes } = this.props;
        return (
            <div>

                <Toolbar classes={{root:classes.toolbar}}>
                    <Typography variant="title">{this.state.massageOrder.id?"Editace masáže":"Nová masáž"}</Typography>
                    <Typography color="inherit" className={classes.flex}>&nbsp;</Typography>
               
                    <IconButton color="primary" onClick={this.handleCancelOrder} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>  
                
                <Paper>
                    <MassageOrder 
                        massageOrder={this.state.massageOrder} 
                        correct={this.state.moCorrect} 
                        wait={this.state.moWait} 
                        onMassageOrderChange={this.handleMassageOrderChange} 
                        onSave={this.handleSaveOrder}
                        onDelete={this.handleDeleteOrder}
                    />
                </Paper>
                <Typography variant="caption"> 
                MassageOrder id:{this.state.massageOrder.id}
                </Typography>

            </div>
        )
    }
   
    handleCloseMOD = () => {
        this.setState({open_mod:false});
    }

    handleConfirmMODelete = () => {
        console.log("handleDeleteOrder",this.state.massageOrder)
        this.setState({moWait:true})
        //console.log(vars);
        this.props.deleteMassageOrder({variables:{id:this.state.massageOrder.id}}).then(({ data }) => {
            this.setState({moWait:false,moCorrect:false,massageOrder:null,open_mod:false})
            console.log('got data', data);
        }).catch((error) => {
            this.setState({moWait:false,moCorrect:false,open_mod:false})
            console.log('there was an error sending the query', error);
        });
    }

    renderMODeleteDialog() {
        return (
            <Dialog open={this.state.open_mod} onClose={this.handleCloseMOD}>
                <DialogTitle id="alert-dialog-title">{"Smazání objednané masáže"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Opravdu chcete smazat objednanou masáž?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseMOD} color="primary">
                        Ne
                    </Button>
                    <Button onClick={this.handleConfirmMODelete} color="primary" autoFocus>
                        Ano
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    render() {
        const { classes } = this.props;

        let dd = null;
        if (this.props.massageRoomDayPlan.massageRoomDayPlan) {
            const {slots}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
            dd = this.renderDayDetail(slots);   
        }

        const pm = this.props.massageRoomDayPlan.massageRoomDayPlan?this.renderDayPlan():null;
        const mo = this.state.massageOrder?this.renderOrder():null;
        const mod_dialog = this.renderMODeleteDialog();
        return (
            <div className={classes.root}>
            {mod_dialog}
             <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={7}>
                    <Toolbar classes={{root:classes.toolbar}}>
                        <Typography variant="title"><DateTimeView date={this.props.day}/></Typography>
                        <Typography color="inherit" className={classes.flex}>&nbsp;</Typography>
                        {this.renderSettingsSwitch()}
                    </Toolbar>  
                    <Paper>
                        {this.state.planMode?pm:dd}    
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={5}> 
                    {mo}
                </Grid>
            </Grid>
            </div>
        )
    }
}


MassageRoomDay.propTypes = {
    classes: PropTypes.object.isRequired,
    massageRoomId: PropTypes.string.isRequired,
    day: PropTypes.objectOf(Date).isRequired,
    onNew: PropTypes.func,
    onEdit: PropTypes.func
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
    }),
    graphql(AddMassageOrder,{
        name:"addMassageOrder",
        options: {
            refetchQueries: [
                'MassageRoomDayPlan',
                'MassageRoomDayInfos'
              ],
        }
    }),
    graphql(UpdateMassageOrder,{
        name:"updateMassageOrder",
        options: {
            refetchQueries: [
                'MassageRoomDayPlan',
                'MassageRoomDayInfos'
              ],
        }
    }),

    graphql(DeleteMassageOrder,{
        name:"deleteMassageOrder",
        options: {
            refetchQueries: [
                'MassageRoomDayPlan',
                'MassageRoomDayInfos'
              ],
        }
    }),


)(MassageRoomDay)