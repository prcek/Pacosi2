import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import MassageTypeField from './MassageTypeField'
import TimeField from './TimeField';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


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
        var m2 = moment(m).add(780,'minutes');
        ranges.push({begin:m.toDate(),end:m2.toDate()});


        return (
            <div>
            <Typography> Massage Order id: {this.props.massageOrder.id} </Typography>
            <form className={classes.form}  noValidate autoComplete="off">

                <TimeField 
                    label={"OD"} 
                   // margin="dense"
                    ranges={ranges} 
                    value={this.props.massageOrder.begin} 
                    onChange={(e)=>this.props.onMassageOrderChange("begin",e.target.value)} 
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


                <TextField className={classes.textfield}
                    // autoFocus§
                    //  margin="dense"
                    id="lt_name"
                    label="Jmeno"
                    type="text"
                    value={null2empty(this.props.massageOrder.customer_name)}
                    onChange={(e)=>this.props.onMassageOrderChange("customer_name",empty2null(e.target.value))}
                />
                <TextField className={classes.textfield}
                    // autoFocus
                    //  margin="dense"
                    id="lt_comment"
                    label="Poznamka"
                    type="text"
                    value={null2empty(this.props.massageOrder.comment)}
                    onChange={(e)=>this.props.onMassageOrderChange("comment",empty2null(e.target.value))}
                />


            </form>

            <Button raised disabled={!this.props.correct} onClick={this.props.onSave} color="primary">Uložit</Button>

            </div>
        )
    }
}

MassageOrder.propTypes = {
    classes: PropTypes.object.isRequired,
    massageOrder: PropTypes.object.isRequired,
    correct: PropTypes.bool,
    onMassageOrderChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
}  

export default compose(
    withStyles(styles),
)(MassageOrder)