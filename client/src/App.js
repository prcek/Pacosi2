import React, { Component } from 'react';
import 'typeface-roboto';
import Typography from 'material-ui/Typography';
import MenuBar from './MenuBar';
import { compose } from 'react-apollo'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom';
import { SnackbarContent } from 'material-ui/Snackbar';

import { withRouter } from 'react-router'

import MassageRoom from './components/MassageRoom';
import LessonType from './components/LessonType';
import Users from './components/Users';
import Clients from './components/Clients';



const PageLessons = ({ match }) => (
  <div>
    <h3>LessonType ID: {match.params.id}</h3>
    <LessonType lessonTypeId={match.params.id}/>
  </div>
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

class App extends Component {

  

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MenuBar />
        </header>

        {! this.props.current_location_id && <SnackbarContent message="není zvolena lokalita"/>}

        <Switch>
          <Route path="/lessons/:id" component={PageLessons}/>
          <Route path="/massages/:id" component={PageMassages}/>
          <Route path="/users" component={PageUsers}/>
          <Route path="/clients" component={PageClients}/>
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
