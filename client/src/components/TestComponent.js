import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import DateField from './DateField';
import RoleField from './RoleField';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    textfield: {
        //margin: theme.spacing.unit
    },

});


class TestComponent extends React.Component {
 
    state = {
        valueDate: null,
        valueDate2: null,
    }

    handleDateChange = (d) => {
        this.setState({valueDate:d})
    }
    handleDateChange2 = (d) => {
        this.setState({valueDate2:d})
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
            <DateField id="xx" name="xxxx" value={this.state.valueDate} onChange={this.handleDateChange}/>
            <DateField id="xx2" name="xxxx2" value={this.state.valueDate2} onChange={this.handleDateChange2}/>
            <div>{this.state.valueDate} </div>
            <RoleField value=""/>
            </div>
        )
    }
}




export default compose(
    withStyles(styles),
)(TestComponent)