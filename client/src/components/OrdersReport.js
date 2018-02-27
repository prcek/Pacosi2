import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import MonthField from './MonthField';
import UserField from './UserField';
import OrdersReportTable from './OrdersReportTable';
import Toolbar from 'material-ui/Toolbar';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    toolbar: {
       // minHeight:50,
    },
    typo: {
        marginTop: theme.spacing.unit*2,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3
    },
    button: {
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3
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


class OrdersReport extends React.Component {

    state = {
        filter:{},
        filter_err:{},
        wait:false
    }

    checkFilterField(name,value) {
        switch(name) {
     //   case 'customer_name': return ((value!==null) && (value!==undefined));
        case 'user_id': return ((value!==null) && (value!==undefined));
        case 'month': return ((value!==null) && (value!==undefined));
        default: return true;
        }
    }

    checkFilter() {
        return this.checkFilterField('user_id',this.state.filter.user_id) &&
            this.checkFilterField('month',this.state.filter.month);
    }


    handleFilterChange(name,value){
        let { filter, filter_err } = this.state;
        filter[name]=value;
        filter_err[name]=!this.checkFilterField(name,value);
        this.setState({
          filter:filter,
          filter_err:filter_err
        });
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
            <Toolbar classes={{root:classes.toolbar}}>
            <Typography className={classes.typo} variant="title"> Přehled prodejů </Typography>

            <UserField 
                autoFocus
                error={this.state.filter_err.user_id}
                id="user_id"
                label="Doktor"
                value={null2empty(this.state.filter.user_id)}
                onChange={(e)=>this.handleFilterChange("user_id",empty2null(e.target.value))}
            />

            <MonthField 
                error={this.state.filter_err.month}
                id="month"
                label="Měsíc"
                value={null2empty(this.state.filter.month)}
                onChange={(e)=>this.handleFilterChange("month",empty2null(e.target.value))}
            />
       
            </Toolbar>
            {this.checkFilter() && <OrdersReportTable user_id={this.state.filter.user_id} month={this.state.filter.month} /> }  
            </div>
        )
    }
}

  

export default compose(
    withStyles(styles),
)(OrdersReport)