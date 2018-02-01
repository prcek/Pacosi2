import React from 'react';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo';
import ClientLookup from './ClientLookup';
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
           <div> <ClientLookup onSelect={this.handleSelect}/> </div>
       )
    }
}




export default compose(
    withStyles(styles),
)(TestComponent)