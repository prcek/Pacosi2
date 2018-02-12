import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import DateField from './DateField';
import RoleField from './RoleField';
import ClientLookup2 from './ClientLookup2';
//import Divider from 'material-ui/Divider';
import ClientView from './ClientView';
import Paper from 'material-ui/Paper';

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
       // const { classes } = this.props;
        return (
            <div>
            
            <div style={{width:400}}>
            <Paper>
            <ClientLookup2 />
            </Paper>
            </div>
            <ClientView client_id="5a4e0f95c8495915be856e65" />
            <ClientView  />
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