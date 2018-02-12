import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import DateField from './DateField';
import RoleField from './RoleField';
//import ClientLookup from './ClientLookup2';
//import Divider from 'material-ui/Divider';
import ClientView from './ClientView';
import ClientField from './ClientField';
//import Paper from 'material-ui/Paper';

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
        client_id: null,
    }

    handleDateChange = (d) => {
        this.setState({valueDate:d})
    }
    handleDateChange2 = (d) => {
        this.setState({valueDate2:d})
    }
    handleClientChange = (cid) => {
        this.setState({client_id:cid})
    }

    render() {
       // const { classes } = this.props;
        return (
            <div>
            



            <ClientView client_id={this.state.client_id} />
            <ClientField id="cxx" name="cxxxx" value={this.state.client_id} onChange={this.handleClientChange}/>
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