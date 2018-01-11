import React, { Component } from 'react';
import 'typeface-roboto';
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
import Clients from './components/Clients';
import TestComponent from './components/TestComponent';



const PageLessons = ({ match }) => (
 
  <LessonType lessonTypeId={match.params.id}/>
  
)

const PageMassages = ({ match }) => (
  <div>
    <h3>MassageRoom ID: {match.params.id}</h3>
    <MassageRoom massageRoomId={match.params.id}/>
  </div>
)

const PageUsers = ({ match }) => (
  <div>
    <h3>Users</h3>
    <Users />
  </div>
)

const PageOrderItems = ({ match }) => (
  <div>
    <h3>OrderItems</h3>
    <OrderItems />
  </div>
)
const PageLessonTypes = ({ match }) => (
  <div>
    <h3>LessonTypes</h3>
    <LessonTypes />
  </div>
)

const PageClients = ({ match }) => (
  <div>
    <h3>Clients</h3>
    <Clients />
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
          <Route path="/lessons/:id" component={PageLessons}/>
          <Route path="/massages/:id" component={PageMassages}/>
          <Route path="/users" component={PageUsers}/>
          <Route path="/orderitems" component={PageOrderItems}/>
          <Route path="/lessontypes" component={PageLessonTypes}/>
          <Route path="/clients" component={PageClients}/>
          <Route path="/test" component={PageTest}/>
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
