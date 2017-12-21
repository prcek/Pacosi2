import React, { Component } from 'react';
import 'typeface-roboto';
import Typography from 'material-ui/Typography';
import AccessAlarmIcon from 'material-ui-icons/AccessAlarm';
import MenuBar from './MenuBar';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const CurrentUsers = gql`
  query CurrentUsers {
    users {
      id
      name
      email
    }
    mista: locations {
      id,name
    }
  }
`;



class App extends Component {

  state = {users: []}
  
  componentDidMount() {

  }
  
  renderUsers(users) {
    return "";
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
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <h1>Users</h1>
        {this.props.data.loading ? <div> loading </div>: this.renderUsers(this.props.data.users) }
        
        <Typography> Hi this is Typography </Typography>
        <AccessAlarmIcon/>
      </div>
    );
  }
}

export default graphql(CurrentUsers)(App);
