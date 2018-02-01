import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import Login from './../Login';
const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});


class TestComponent extends React.Component {
 
    handleSelect = () => {

    }

    render() {
       return (
           <div> <Login /> </div>
       )
    }
}




export default compose(
    withStyles(styles),
)(TestComponent)