import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import MonthField from './MonthField';
import UserField from './UserField';
import TextField from 'material-ui/TextField';

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
    }
    
});
  


class OrdersReport extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div>
            <Toolbar classes={{root:classes.toolbar}}>
            <Typography className={classes.typo} type="title"> Přehled prodejů </Typography>
            <TextField 
             label="Stav"
            />
            <MonthField 
            label="Stav"
            />
            </Toolbar>
            </div>
        )
    }
}

  

export default compose(
    withStyles(styles),
)(OrdersReport)