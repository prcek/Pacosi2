import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu'

import { Link } from 'react-router-dom';

import { compose } from 'react-apollo'
import { connect } from 'react-redux'

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { setLocation } from './actions'

const CurrentLocations = gql`
  query CurrentLocations {
    locations {
      id,name
    }
  }
`;


const addUser = gql`
  mutation addUser {
    addUser(name:"new",email:"xxxx",password:"xxx") {
      id
    }
  }
`;


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
    onClick() {
      console.log("CLICK");
    }

    renderLocations(locations) {
      return locations.map(location=> (
        <MenuItem key={location.id} value={location.id}> {location.name} </MenuItem>
      ));
    }

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
                <Button color="contrast" component={Link} to="/page1">Button1</Button>
                <Button color="contrast" component={Link} to="/page2">Button2</Button>
                <Typography color="inherit" className={classes.flex}>
                &nbsp;
                </Typography>
                <Button color="contrast">Login</Button>
                <Select value={this.props.current_location_id?this.props.current_location_id:""} onChange={(e)=>this.props.onSelectLocation(e.target.value)}>
                  <MenuItem value="">None</MenuItem>
                  {!this.props.locations.loading && this.renderLocations(this.props.locations.locations) }
                </Select>
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}

MenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  return { current_location_id: state.location }
}

const mapDispatchToProps = dispatch => {
  return {
    onSelectLocation: id => {
      dispatch(setLocation(id))
    }
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps,mapDispatchToProps),
  graphql(CurrentLocations,{name: "locations"}),
  graphql(addUser,{name:"mutateAddUser",options: {refetchQueries:['CurrentUsers']}}),
)(MenuBar);