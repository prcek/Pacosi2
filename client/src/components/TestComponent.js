import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import Calendar from './Calendar';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    cal: {
        width: 300,
        borderStyle: 'solid',
        borderColor: 'red',
        borderWidth: 'thin',
    }
});
  


class TestComponent extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div>
            <Typography> I Am TestComponent </Typography>
            <div className={classes.cal}> 
            <Calendar/>
            </div>
            </div>
        )
    }
}

  

export default compose(
    withStyles(styles),
)(TestComponent)