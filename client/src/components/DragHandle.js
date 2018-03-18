import React from 'react';
//import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import DragIcon from 'material-ui-icons/DragHandle';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});


class DragHandle extends React.Component {

  render() {
    return (
      
        <DragIcon style={{height:24}}/>
      
    );
  }
}

DragHandle.propTypes = {

};
DragHandle.defaultProps = {
  
};

export default withStyles(styles)(DragHandle);