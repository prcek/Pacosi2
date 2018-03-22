import React, { Component } from 'react';
//import Typography from 'material-ui/Typography';
import MenuBar from './MenuBar';
import { compose } from 'react-apollo'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom';
import Snackbar, { SnackbarContent} from 'material-ui/Snackbar';
import Reboot from 'material-ui/Reboot';
import { withRouter } from 'react-router'
import { withStyles } from 'material-ui/styles';
import CloseIcon from 'material-ui-icons/Close'
import IconButton from 'material-ui/IconButton';
import MassageRoom from './components/MassageRoom';
import LessonType from './components/LessonType';
import Users from './components/Users';
import OrderItems from './components/OrderItems';
import LessonTypes from './components/LessonTypes';
import Locations from './components/Locations';
import MassageRooms from './components/MassageRooms';
import MassageTypes from './components/MassageTypes';
import Clients from './components/Clients';
import Orders from './components/Orders';
import OrdersReport from './components/OrdersReport';
import LessonsReport from './components/LessonsReport';
import MassagesReport from './components/MassagesReport';
import Version from './components/Version';
import About from './components/About';
import TestComponent from './components/TestComponent';
import Login from "./Login";
import {isAuth} from './auth';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import Typography from 'material-ui/Typography';
import { clearErrorMessage, clearInfoMessage } from './actions';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});


const PageLessons = ({ match }) => (
 
  <LessonType lessonTypeId={match.params.id}/>
  
)

const PageMassages = ({ match }) => (
  <MassageRoom massageRoomId={match.params.id}/>
)

const PageUsers = ({ match }) => (
  <div>
    <Users />
  </div>
)

const PageOrderItems = ({ match }) => (
  <div>
    <OrderItems />
  </div>
)
const PageLessonTypes = ({ match }) => (
  <div>
    <LessonTypes />
  </div>
)
const PageLocations = ({ match }) => (
  <div>
    <Locations />
  </div>
)


const PageMassageRooms = ({ match }) => (
  <div>
    <MassageRooms />
  </div>
)

const PageMassageTypes = ({ match }) => (
  <div>
    <MassageTypes />
  </div>
)

const PageClients = ({ match }) => (
  <div>
    <Clients />
  </div>
)

const PageOrders = ({ match }) => (
  <div>
    <Orders />
  </div>
)

const PageOrdersReport = ({ match }) => (
  <div>
    <OrdersReport />
  </div>
)

const PageMassagesReport = ({ match }) => (
  <div>
    <MassagesReport />
  </div>
)

const PageLessonsReport = ({ match }) => (
  <div>
    <LessonsReport />
  </div>
)

const PageNoMatch = ({ match }) => (
  <div>
  </div>
)

const PageAbout = ({ match }) => (
  <div>
    <About />
  </div>
)


const PageTest = ({ match }) => (
  <div>
    <h3>TEST PAGE</h3>
    <TestComponent />
  </div>
)


class App extends Component {

  checkAuth() {
    return /*this.props.auth && */isAuth();
  }

  render() {
  // const { classes } = this.props
    if (this.checkAuth()) {
      return this.renderApp();
    } else {
      return (
        <div className="App">
        <Reboot />
        <Version />
        <Login/>
        </div>      
      )
    }
  }
  handleCloseError = (event, reason) => {
   // console.log("handleCloseError",reason)
    this.props.onClearError();
  }
  renderSnackError() {
    const { classes } = this.props;
    return (
      <Snackbar 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        key="error"
        open={this.props.error_message!==null}
    //    autoHideDuration={6000}
        onClose={this.handleCloseError}
        message={(<Typography color="error">{this.props.error_message}</Typography>)}
        action={(
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.handleCloseError}
          >
            <CloseIcon />
          </IconButton>
         )}

      />
    )
  }

  handleCloseInfo = (event, reason) => {
     this.props.onClearInfo();
   }
   renderSnackInfo() {
     const { classes } = this.props;
     return (
       <Snackbar 
         anchorOrigin={{
           vertical: 'bottom',
           horizontal: 'center',
         }}
         key="info"
         open={this.props.info_message!==null}
     //    autoHideDuration={6000}
         onClose={this.handleCloseInfo}
         message={(<Typography color="inherit">{this.props.info_message}</Typography>)}
         action={(
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.handleCloseInfo}
          >
            <CloseIcon />
          </IconButton>
         )}
       />
     )
   }
 
  renderApp() {
   // const { classes } = this.props
    const errorSnack = this.renderSnackError();
    const infoSnack = this.renderSnackInfo();
    
    return (
      <div className="App">
        <Reboot />
        <header className="App-header">
          <Version />
          <MenuBar />
        </header>
        {errorSnack}
        {infoSnack}
        {! this.props.current_location_id && <SnackbarContent message="není zvolena lokalita"/>}
        <Switch>
          <Route path="/r/lessons/:id" component={PageLessons}/>
          <Route path="/r/massages/:id" component={PageMassages}/>
          <Route path="/r/users" component={PageUsers}/>
          <Route path="/r/orderitems" component={PageOrderItems}/>
          <Route path="/r/lessontypes" component={PageLessonTypes}/>
          <Route path="/r/massagerooms" component={PageMassageRooms}/>
          <Route path="/r/locations" component={PageLocations}/>
          <Route path="/r/massagetypes" component={PageMassageTypes}/>
          <Route path="/r/clients" component={PageClients}/>
          <Route path="/r/orders" component={PageOrders}/>
          <Route path="/r/ordersreport" component={PageOrdersReport}/>
          <Route path="/r/massagesreport" component={PageMassagesReport}/>
          <Route path="/r/lessonsreport" component={PageLessonsReport}/>
          <Route path="/r/about" component={PageAbout}/>
          <Route path="/r/test" component={PageTest}/>
          <Route component={PageNoMatch}/>
        </Switch>

      </div>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    onClearError: () => {
      dispatch(clearErrorMessage())
    },
    onClearInfo: () => {
      dispatch(clearInfoMessage())
    },
  }
}

function mapStateToProps(state) {
  return { current_location_id: state.location, auth:state.auth, error_message:state.notify.error, info_message:state.notify.info }
}


export default withRouter(compose(
  withStyles(styles),
  connect(mapStateToProps,mapDispatchToProps),
  DragDropContext(HTML5Backend)
)(App));
