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
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import CopyIcon from 'material-ui-icons/ContentCopy';
import MassageDaySlot from './MassageDaySlot';
import DateTimeView from './DateTimeView';
import TimeField from './TimeField';
import DateField from './DateField';
import TableEditor from './TableEditor';
import { setMassageOrderClipboard, clearMassageOrderClipboard } from './../actions'
import { connect } from 'react-redux'
import MassageOrder from './MassageOrder';
import CloseIcon from 'material-ui-icons/Close';
import IconButton from 'material-ui/IconButton';
//import PrintIcon from 'material-ui-icons/Print';
import ActionButton from './ActionButton';
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
import AppBar from 'material-ui/AppBar';
import PdfView from './PdfView';
import DebugInfo from './DebugInfo';

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
require("moment/min/locales.min");
moment.locale('cs');
var moment_tz = require('moment-timezone');



const MassageRoomDayPlan = gql`
  query MassageRoomDayPlan($massage_room_id: ID! $date: Date! ) {
    massageRoomDayPlan(massage_room_id:$massage_room_id, date:$date) {
      opening_times {
          id,begin,end
      }
      massage_orders {
        id massage_type {name length} massage_type_id begin client_id client {id, name,surname,phone, no} comment payment
      }
      status 
      slots {
          date break warn free order {id massage_type {name length} massage_type_id begin client_id client {id, name,surname,phone, no} comment payment} len 
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

const AddOpeningTimes = gql`
    mutation AddOpeningTimes($massage_room_id: ID!, $openingtimes: [DateTimeInterval]!) {
        addOpeningTimes(massage_room_id:$massage_room_id,openingtimes:$openingtimes) {
            id
        }
    }
`;

const CleanOpeningTimes = gql`
    mutation CleanOpeningTimes($massage_room_id: ID!, $dates: [Date]!) {
        cleanOpeningTimes(massage_room_id:$massage_room_id,dates:$dates) {
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
    mutation AddMassageOrder($massage_room_id: ID! $massage_type_id: ID! $begin: DateTime!, $client_id: ID!, $comment: String,  $payment: Payment!) {
        addMassageOrder(massage_room_id:$massage_room_id, massage_type_id:$massage_type_id, begin:$begin,client_id:$client_id, comment:$comment, payment:$payment) {
            id
        }
    }
`;

const UpdateMassageOrder = gql`
    mutation UpdateMassageOrder($id: ID! $massage_type_id: ID $begin: DateTime, $client_id: ID, $comment: String, $payment: Payment) {
        updateMassageOrder(id:$id, massage_type_id:$massage_type_id, begin:$begin,client_id:$client_id, comment:$comment, payment:$payment) {
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
    },
    typop: {
        marginLeft: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit, 
    },
    ul: {
        marginTop:0,
        marginBottom:0,
    }
});
  
function payment2str(p) {
    let s;
    switch(p) {
    case "NOT_PAID": s = "neplaceno"; break;
    case "VOUCHER": s ="dárkový poukaz"; break;
    case "INVOICE": s ="faktura"; break;
    case "PAID": s ="placeno"; break;
    default : s="";
    }
    return s;
}


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
            massageOrder: null,
            print: false,
            end_date:null,
            rot_done:false,
            rot_wait:false,
        };
    }

    onPlanMode(val) {
        this.setState({planMode:val});
    }

    componentWillReceiveProps(nextProps) {
        if (!moment(this.props.day).isSame(nextProps.day,'day')) {
            this.setState({newOtItem:{begin:nextProps.day,end:nextProps.day},massageOrder:null,rot_done:false,rot_wait:false,end_date:null});
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
                <MassageDaySlot key={idx} warn={s.warn} break={s.break} time={moment(s.date).toDate()} order={s.order} length={s.len} onClick={this.handleSlotClick} /> 
            )
        });
        
        return (
            <div>
                {mds}
            </div>
        )
    }

    checkNewOt() {

        if (moment(this.state.newOtItem.begin).isSame(this.state.newOtItem.end)) {
            return ""
        }
        

        if (moment(this.state.newOtItem.begin).isSameOrAfter(this.state.newOtItem.end)) {
            return "Začátek není před koncem"
        }
        const range = moment.range(this.state.newOtItem.begin,this.state.newOtItem.end);
        const {opening_times}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
        const ranges = opening_times.map(x=>{return moment.range(x.begin,x.end)});
        const overlap =ranges.find(r=>{
            return r.overlaps(range);
        })
        return overlap?"Překryv s existující dobou":null;
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
                client_id: order.client_id,
                comment: order.comment,
                payment: order.payment,
            }
            const c = this.checkOrder(mo);
            this.setState({massageOrder:mo,moCorrect:c})
        } else {
            if (this.props.clipboard_massage_order) {
                const mo = {
                    massage_room_id: this.props.massageRoomId,
                    begin:d,
                    massage_type_id: this.props.clipboard_massage_order.massage_type_id,
                    client_id: this.props.clipboard_massage_order.client_id,
                    comment: this.props.clipboard_massage_order.comment,
                    payment: this.props.clipboard_massage_order.payment,
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
    }

    handleCancelOrder = () => {
        this.setState({massageOrder:null})
    }

    handleCancelClipboard = () => {
        this.props.onClearMassageOrderClipboard();
    }

    handleSaveAndCopyOrder = () => {
        this.props.onSetMassageOrderClipboard(this.state.massageOrder);
        this.saveOrder();
    }
    handleSaveOrder = () => {
        this.props.onClearMassageOrderClipboard();
        this.saveOrder();
    }
    saveOrder = () => {
        console.log("saveOrder",this.state.massageOrder)
        this.setState({moWait:true})
        if (this.state.massageOrder.id) {
            this.props.updateMassageOrder({variables:{
                id: this.state.massageOrder.id,
                massage_type_id: this.state.massageOrder.massage_type_id,
                begin: this.state.massageOrder.begin,
                client_id: this.state.massageOrder.client_id,
                comment: this.state.massageOrder.comment,
                payment: this.state.massageOrder.payment
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
                client_id: this.state.massageOrder.client_id,
                comment: this.state.massageOrder.comment,
                payment: this.state.massageOrder.payment
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
        if (!order.client_id) { return false;}
        if (!order.payment) { return false;}
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
    handleChangeED = (d) => {
        this.setState({end_date:d,rot_done:false});
    }

    handleNewROt = () => {
        const days = this.getROtDates();
        const {opening_times}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
        const ot = Lodash.flatten(Lodash.sortBy(opening_times,['begin']).map(o=>{

            return days.map(d=>{


                const b_datetime_str = moment(d).format("YYYY-MM-DD")+" "+moment(o.begin).format("HH:mm");
                const ob=moment_tz.tz(b_datetime_str,"Europe/Prague").tz("UTC").format();
      
                const e_datetime_str = moment(d).format("YYYY-MM-DD")+" "+moment(o.end).format("HH:mm");
                const oe=moment_tz.tz(e_datetime_str,"Europe/Prague").tz("UTC").format();
                
                return {begin:ob,end:oe};
    
            })
        }))

        this.setState({rot_wait:true});
        console.log("________")

        const cdays = days.map(d=>{return moment(d).format("YYYY-MM-DD")});

        this.props.cleanOpeningTimes({variables:{
            massage_room_id: this.props.massageRoomId,
            dates:cdays 
        }}).then(({ data }) => {
            console.log('cleanOpeningTimes - got data', data);
           // console.log("XX",ot)

           
                this.props.addOpeningTimes({variables:{
                    massage_room_id: this.props.massageRoomId,
                    openingtimes:ot 
                }}).then(({ data }) => {
                    console.log('addOpeningTimes - got data', data);
                    this.setState({end_date:null,rot_done:true,rot_wait:false})
                }).catch((error) => {
                    console.log('addOpeningTimes - there was an error sending the query', error);
                });
          

        }).catch((error) => {
            console.log('addOpeningTimes - there was an error sending the query', error);
        });


 


    }

    getROtDates() {
        if (this.state.end_date===null) {
            return null;
        }
        var begin = moment(this.props.day);
        begin.add(1,"week");

        if (begin.isAfter(this.state.end_date)) {
            return null;
        }

        var range = moment.range(begin,moment(this.state.end_date));
        var days = Array.from(range.by('weeks'));
        if (days.length>20) {
            return null;
        }

        return days.map(d=>{return moment(d).format("YYYY-MM-DD")});
    }

    //checkNewROt() {
    //    return this.getROtDates()!==null;
    //}

    renderDayPlanROt() {
        const { classes } = this.props;
        const days = this.getROtDates();
        return (
            <div className={classes.typop}>
                <DateField 
                        margin="dense"
                        id="end_date"
                        label="Konec opakování"
                        value={TableEditor.null2empty(this.state.end_date)}
                        onChange={(e)=>this.handleChangeED(TableEditor.empty2null(e))}
                        helperText="Opakování ve stejný den v týdnu, nejdéle do zvoleného data"
                     />
           
                <Button className={classes.button} disabled={(days===null)||this.state.rot_wait} variant="raised" style={{minWidth:"38px"}} onClick={this.handleNewROt}> <CopyIcon/> </Button>
                <div>
                    {days!==null &&(
                        <ul>
                            {days.map((d,idx)=>{return (
                                <li key={idx}><DateTimeView date={d} format="LL"/></li>
                            )})}
                        </ul>        
                    )}
                  
                </div>
                {this.state.rot_done &&(
                    <Typography className={classes.typop} variant="body2">provozní doba byla nakopírována</Typography>
                )}
                <div>&nbsp;</div>

            </div>
        )
    }

    renderDayPlanNewOt() {
        const { classes } = this.props;

        var ranges = [];
        var m = moment(this.props.day).startOf('day').add(7,'hours');
        var m2 = moment(m).add(840,'minutes');
        ranges.push({begin:m.toDate(),end:m2.toDate()});


        return (
            <div>
                <Toolbar> 
                    <TimeField label={"OD"} ranges={ranges} value={this.state.newOtItem.begin} onChange={(e)=>this.handleNewOtTime("begin",e.target.value)} />
                    <TimeField label={"DO"} ranges={ranges} value={this.state.newOtItem.end} onChange={(e)=>this.handleNewOtTime("end",e.target.value)} />
                    <Button className={classes.button} disabled={this.checkNewOt()!==null} variant="raised" style={{minWidth:"38px"}} onClick={this.handleNewOtTimeSave}> <AddIcon/> </Button>
                    <Typography className={classes.warn}> {this.checkNewOt()} </Typography>
                </Toolbar>
            </div>
        )
    }
    renderDayPlanOt(ot) {
        const { classes } = this.props;
        return (
            <li key={ot.id}>
                <Toolbar disableGutters> 
                <Typography> <DateTimeView date={ot.begin} format={"HH:mm"} /> - <DateTimeView date={ot.end} format={"HH:mm"} /> </Typography>
                <Button  className={classes.button} variant="raised" style={{minWidth:"38px"}} onClick={()=>this.handleOtTimeDelete(ot.id)}> <DeleteIcon/> </Button>
                <DebugInfo>{"id: "+ot.id}</DebugInfo>
                </Toolbar>
            </li>
        )
    }

    renderDayPlan() {
        const { classes } = this.props;
        const {opening_times}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
        const ot = Lodash.sortBy(opening_times,['begin']).map(o=>{return this.renderDayPlanOt(o)})
        const not = this.renderDayPlanNewOt();
        const rot = this.renderDayPlanROt();
        
        return (
            <div>
                <Toolbar > 
                        <Typography variant="title"> Nastavení provozní doby </Typography>
                </Toolbar>
                <Divider/>
                <Typography className={classes.typop} variant="subheading">Aktuální provozní doba:</Typography>
                <ul className={classes.ul}>
                {ot}
                </ul>
                <Divider/>
                <Typography className={classes.typop} variant="subheading">Přidání provozní doby:</Typography>
                {not}
                <Divider/>
                <Typography className={classes.typop} variant="subheading">Kopírování provozní doby na následující dny:</Typography>
                {rot}
            </div>
        )
    }

    renderSettingsSwitch() {
        const { classes } = this.props;
        return (
            <FormGroup row>
                <FormControlLabel
                    control={<Switch className={classes.button} checked={this.state.planMode} onChange={(e,c)=>this.onPlanMode(c)}/>}
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
                        onSaveAndCopy={this.handleSaveAndCopyOrder}
                        onDelete={this.handleDeleteOrder}
                    />
                </Paper>
                <DebugInfo > 
                MassageOrder id:{this.state.massageOrder.id}
                </DebugInfo>

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

    handlePrint = () => {
        this.setState({print:true});
    }

    handlePrintClose = () => {
        this.setState({print:false});
    }


    renderPrintDialog() {
        const { classes } = this.props;
        const orders = this.props.massageRoomDayPlan.massageRoomDayPlan?Lodash.sortBy(this.props.massageRoomDayPlan.massageRoomDayPlan.massage_orders,['begin']):[];
        //console.log("XXX",orders);
        
        const widths = [50,100,80,80,200,100,90];
        const cols = ["Čas","Přijmení","Jméno","Telefon","Masáž","Platba","Poznámka"];
        const rows = orders.map(m=>{
            return [moment(m.begin).format("HH:mm"),m.client.surname,m.client.name,m.client.phone,m.massage_type.name,payment2str(m.payment),m.comment]
        });
        const roomInfo = this.props.massageRoom? this.props.massageRoom.name +", "+this.props.massageRoom.location.name :"";
        return (
            <Dialog
                fullScreen
                open={this.state.print}
                onClose={this.handlePrintClose}
             >
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Tisk masáží - {roomInfo}
                        </Typography>
                        <IconButton color="inherit" onClick={this.handlePrintClose} aria-label="Close">
                            <CloseIcon />
                         </IconButton>
                     </Toolbar>
                </AppBar>
            {this.state.print && (<PdfView landscape title={roomInfo + " - " + moment(this.props.day).format("LL")} description={"Přehled přihlášených klientů na masáže."} cols={cols} rows={rows} widths={widths}/>)}
             </Dialog>
        )
    }

    renderClipboard() {
        const { classes } = this.props;
        if (this.props.clipboard_massage_order) {
            return (
                <div>
                    <Toolbar classes={{root:classes.toolbar}}>
                    <Typography variant="title">{"Zapamatovaná masáž"}</Typography>
                    <Typography color="inherit" className={classes.flex}>&nbsp;</Typography>
               
                    <IconButton color="primary" onClick={this.handleCancelClipboard} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>  
            
                </div>


            )
        } else {
            return null;
        }   
    }
 
    render() {
        const { classes } = this.props;

        let dd = null;
        if (this.props.massageRoomDayPlan.massageRoomDayPlan) {
            const {slots}  = this.props.massageRoomDayPlan.massageRoomDayPlan;
            dd = this.renderDayDetail(slots);   
        }

        const pm = this.props.massageRoomDayPlan.massageRoomDayPlan?this.renderDayPlan():null;
        const mo = this.state.massageOrder?this.renderOrder():this.renderClipboard();
        const mod_dialog = this.renderMODeleteDialog();
        const printDlg = this.renderPrintDialog();
        return (
            <div className={classes.root}>
            {mod_dialog}
            {printDlg}
             <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={7}>
                    <Toolbar classes={{root:classes.toolbar}}>
                        <Typography variant="title"><DateTimeView date={this.props.day}/></Typography>
                        <Typography color="inherit" className={classes.flex}>&nbsp;</Typography>

                        {this.renderSettingsSwitch()}
                        <ActionButton  disabled={!pm} icon={"print"} tooltip={"Tisk"} onClick={this.handlePrint} /> 
                        
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
    massageRoom: PropTypes.object,
    day: PropTypes.objectOf(Date).isRequired,
    onNew: PropTypes.func,
    onEdit: PropTypes.func
};
  
function mapStateToProps(state) {
    return { 
        clipboard_massage_order: state.clipboard.massage_order,
    }
}

const mapDispatchToProps = dispatch => {
    return {
      onSetMassageOrderClipboard: (mo,expire) => {
        dispatch(setMassageOrderClipboard(mo,expire))
      },
      onClearMassageOrderClipboard: () => {
        dispatch(clearMassageOrderClipboard())
      },
    }
}



export default compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
    graphql(MassageRoomDayPlan,{
        name: "massageRoomDayPlan",
        options: ({massageRoomId,day})=>({
            variables:{
                massage_room_id:massageRoomId,
                date: moment(day).format('YYYY-MM-DD'),
            }, fetchPolicy:"cache-and-network"
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
    graphql(AddOpeningTimes,{
        name:"addOpeningTimes",
        options: {
            refetchQueries: [
                'MassageRoomDayPlan',
                'MassageRoomDayInfos'
              ],
        }
    }),
    graphql(CleanOpeningTimes,{
        name:"cleanOpeningTimes",
        options: {
       //     refetchQueries: [
       //         'MassageRoomDayPlan',
       //         'MassageRoomDayInfos'
       //       ],
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