import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import Calendar from './Calendar';
import Paper from 'material-ui/Paper';
import Moment from 'moment';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    cal: {
        width: 300,
        margin: theme.spacing.unit
        //borderStyle: 'solid',
        //borderColor: 'red',
        //borderWidth: 'thin',
    }
});
  


class TestComponent extends React.Component {

    state = {
        day: Moment().startOf('week')
    }

    handleBackward = () => {
        this.setState({day:Moment(this.state.day).subtract(7,'days')})
    };

    handleForward = () => {
        this.setState({day:Moment(this.state.day).add(7,'days')})
    };

    handleToday = () => {
        this.setState({day:Moment().startOf('week')})
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
            <Typography> I Am TestComponent </Typography>
            <Paper className={classes.cal}> 
            <Calendar 
                startDay={this.state.day} 
                onForward={this.handleForward} 
                onBackward={this.handleBackward}
                onToday={this.handleToday}
            />
            </Paper>
            </div>
        )
    }
}

  

export default compose(
    withStyles(styles),
)(TestComponent)