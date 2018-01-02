import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});
  


class TestComponent extends React.Component {
    render() {
        return (
            <div>
            <Typography> I Am TestComponent </Typography>
            </div>
        )
    }
}

  

export default compose(
    withStyles(styles),
)(TestComponent)