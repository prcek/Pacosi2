import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import MenuBar from './MenuBar';
import { compose } from 'react-apollo'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom';
import { SnackbarContent } from 'material-ui/Snackbar';
import Reboot from 'material-ui/Reboot';
import { withRouter } from 'react-router'

import MassageRoom from './components/MassageRoom';
import LessonType from './components/LessonType';
import Users from './components/Users';
import OrderItems from './components/OrderItems';
import LessonTypes from './components/LessonTypes';
import MassageRooms from './components/MassageRooms';
import MassageTypes from './components/MassageTypes';
import Clients from './components/Clients';
import Orders from './components/Orders';
import OrdersReport from './components/OrdersReport';
import LessonsReport from './components/LessonsReport';
import MassagesReport from './components/MassagesReport';

import TestComponent from './components/TestComponent';



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
    <Typography> vyber z menu co chces delat </Typography>
  </div>
)

const PageTest = ({ match }) => (
  <div>
    <h3>TEST PAGE</h3>
    <TestComponent />
  </div>
)


class App extends Component {

  

  render() {
    return (
      <div className="App">
        <Reboot />
        <header className="App-header">
          <MenuBar />
        </header>

        {! this.props.current_location_id && <SnackbarContent message="není zvolena lokalita"/>}

        <Switch>
          <Route path="/r/lessons/:id" component={PageLessons}/>
          <Route path="/r/massages/:id" component={PageMassages}/>
          <Route path="/r/users" component={PageUsers}/>
          <Route path="/r/orderitems" component={PageOrderItems}/>
          <Route path="/r/lessontypes" component={PageLessonTypes}/>
          <Route path="/r/massagerooms" component={PageMassageRooms}/>
          <Route path="/r/massagetypes" component={PageMassageTypes}/>
          <Route path="/r/clients" component={PageClients}/>
          <Route path="/r/orders" component={PageOrders}/>
          <Route path="/r/ordersreport" component={PageOrdersReport}/>
          <Route path="/r/massagesreport" component={PageMassagesReport}/>
          <Route path="/r/lessonsreport" component={PageLessonsReport}/>
          <Route path="/r/test" component={PageTest}/>
          <Route component={PageNoMatch}/>
        </Switch>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return { current_location_id: state.location }
}


export default withRouter(compose(
  connect(mapStateToProps),
)(App));
