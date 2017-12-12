import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class MenuBar extends React.Component {
    //constructor(props) {
    //  super(props);
   // }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <Typography type="headline" color="inherit">
                   xxx
                </Typography>
                <Button color="contrast">Button1</Button>
                <Button color="contrast">Button2</Button>
                <Typography color="inherit" className={classes.flex}>
                </Typography>
                <Button color="contrast">Login</Button>
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuBar);