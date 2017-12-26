import React, { Component } from 'react';
import 'typeface-roboto';
import Typography from 'material-ui/Typography';
import AccessAlarmIcon from 'material-ui-icons/AccessAlarm';
import MenuBar from './MenuBar';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux'

import { SnackbarContent } from 'material-ui/Snackbar';


const CurrentUsers = gql`
  query CurrentUsers {
    users {
      id
      name
      email
    }
  }
`;



class App extends Component {

  state = {users: []}
  
  componentDidMount() {

  }
  
  renderUsers(users) {
    return users.map(user=> (
      <div key={user.id}> {user.name} {user.email} </div>
    ));

    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MenuBar />
        </header>

        {! this.props.current_location_id && <SnackbarContent message="neni zvolena lokalita"/>}


        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h1>Users</h1>
        {this.props.data.loading ? <div> loading </div>: this.renderUsers(this.props.data.users) }
        <Typography> Hi </Typography>
        <AccessAlarmIcon />
        {this.props.current_location_id ? <div> current location is {this.props.current_location_id} </div> : <div> no current location </div> }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { current_location_id: state.location }
}


export default compose(
  graphql(CurrentUsers),
  connect(mapStateToProps)
)(App);
