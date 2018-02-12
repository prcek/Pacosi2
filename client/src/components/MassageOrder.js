import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo'
import MassageTypeField from './MassageTypeField'
//import Typography from 'material-ui/Typography';
import TimeField from './TimeField';
import TextField from 'material-ui/TextField';
import ClientField from './ClientField';
import Button from 'material-ui/Button';
import PaymentField from './PaymentField';
import Toolbar from 'material-ui/Toolbar';

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
require("moment/min/locales.min");
moment.locale('cs');

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textfield: {
        margin: theme.spacing.unit
    },
    toolbar: {
        minHeight:50
    },
    button:{
        marginLeft:theme.spacing.unit,
        marginRight:theme.spacing.unit
    }
});
  
function null2empty(v) {
    if ((v === null) || (v === undefined)) {return ""}
    return v;
}
function empty2null(v) {
    if (v === "") { return null} 
    return v;
}


class MassageOrder extends React.Component {
    state = {
        doc: {}
    }
    render() {
        const { classes } = this.props;
        var ranges = [];
        var m = moment(this.props.massageOrder.begin).startOf('day').add(7,'hours');
        var m2 = moment(m).add(840,'minutes');
        ranges.push({begin:m.toDate(),end:m2.toDate()});


        return (
            <div>
            <form className={classes.form}  noValidate autoComplete="off">

                <TimeField 
                    label={"OD"} 
                   // margin="dense"
                    ranges={ranges} 
                    value={moment(this.props.massageOrder.begin)} 
                    onChange={(e)=>this.props.onMassageOrderChange("begin",e.target.value.toISOString())} 
                />

                <MassageTypeField
                    autoFocus
                    id="lt_masstype-simple"
                    // margin="dense"
                    name="massagetype"
                    label="Typ masáže"
                    value={null2empty(this.props.massageOrder.massage_type_id)}
                    onChange={(e)=>this.props.onMassageOrderChange("massage_type_id",empty2null(e.target.value))}
                />



                <ClientField className={classes.textfield}
                    // autoFocus§
                    //  margin="dense"
                    id="lt_client"
                    label="Klient"
                    type="text"
                    value={this.props.massageOrder.client_id}
                    onChange={(cid)=>this.props.onMassageOrderChange("client_id",cid)}
                />

                <PaymentField 
                    // margin="dense"
                    id="payment"
                    label="Platba"
                    value={null2empty(this.props.massageOrder.payment)}
                    onChange={(e)=>this.props.onMassageOrderChange("payment",empty2null(e.target.value))}
                />


                <TextField className={classes.textfield}
                    // autoFocus
                    //  margin="dense"
                    id="lt_comment"
                    label="Poznámka"
                    type="text"
                    value={null2empty(this.props.massageOrder.comment)}
                    onChange={(e)=>this.props.onMassageOrderChange("comment",empty2null(e.target.value))}
                />


            </form>
            <Toolbar>
                <Button className={classes.button} variant="raised" disabled={(!this.props.correct) || (this.props.wait)} onClick={this.props.onSave} >Uložit</Button>
                {this.props.massageOrder.id && 
                <Button className={classes.button} variant="raised" onClick={this.props.onDelete} >Smazat</Button>
                }
            </Toolbar>
            </div>
        )
    }
}

MassageOrder.propTypes = {
    classes: PropTypes.object.isRequired,
    massageOrder: PropTypes.object.isRequired,
    times: PropTypes.array,
    correct: PropTypes.bool,
    wait: PropTypes.bool,
    onMassageOrderChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
}  

export default compose(
    withStyles(styles),
)(MassageOrder)