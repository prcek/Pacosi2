import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
//import IconButton from 'material-ui/IconButton';
import ViewIcon from 'material-ui-icons/Pageview';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import SaveIcon from 'material-ui-icons/Done';
import SaveCopyIcon from 'material-ui-icons/DoneAll';
import EditIcon from 'material-ui-icons/ModeEdit';
import PrintIcon from 'material-ui-icons/Print';
import CancelIcon from 'material-ui-icons/Clear';
import AddPersonIcon from 'material-ui-icons/PersonAdd';
import Tooltip from 'material-ui/Tooltip'
import Button from 'material-ui/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  icon: {
   // marginLeft: theme.spacing.unit,
   // height:24,
   // width:24,
  },
});


class ActionButton extends React.Component {
 
  renderIcon() {
    const { classes } = this.props;
    switch(this.props.icon) {
      case 'none': return null;
      case 'view': return (<ViewIcon className={classes.icon}/>);
      case 'delete': return (<DeleteIcon className={classes.icon}/>);
      case 'edit':return (<EditIcon className={classes.icon}/>);
      case 'add':return (<AddIcon className={classes.icon}/>);
      case 'enroll':return (<AddPersonIcon className={classes.icon}/>);
      case 'print':return (<PrintIcon className={classes.icon}/>);
      case 'cancel':return (<CancelIcon className={classes.icon}/>);
      case 'save':return (<SaveIcon className={classes.icon}/>);
      case 'savecopy': return (<SaveCopyIcon className={classes.icon}/>);
      default: return (<div>?</div>);
    }
  }


  renderIconButton() {
    const { classes } = this.props;
    const icon = this.renderIcon();
    return (
        <Button disabled={this.props.disabled} size={'small'} className={classes.button} variant="raised" color="default" onClick={this.props.onClick}>
            {this.props.label}
            {icon}
        </Button>
    );
  }


 render() {
    const ib = this.renderIconButton();
    if (this.props.tooltip && !this.props.disabled) {
       return (
        <Tooltip title={this.props.tooltip}>
        {ib}
        </Tooltip>
       )
    } else {
      return ib;
    }
  }
};

ActionButton.propTypes = {
  icon: PropTypes.oneOf(['none','view', 'delete','edit','add','save','savecopy','print','cancel','enroll']).isRequired,
  tooltip: PropTypes.string,
  label: PropTypes.string,
  onClick:PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
ActionButton.defaultProps = {
    disabled:false
};

export default withStyles(styles)(ActionButton);