import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});
  
const CurrentClients = gql`
  query Clients {
    clients {
      id
      name
      surname
      email
      phone
    }
  }
`;


class Clients extends React.Component {

    renderClients(clients) {
        return clients.map(user=> (
          <div key={user.id}> {user.id} {user.name} {user.surname} {user.phone} {user.email} </div>
        ));
    }
    

    render() {
        return (
            <div>
            <Typography> I Am Clients page </Typography>
            {this.props.data.loading ? <div> loading </div>: this.renderClients(this.props.data.clients) }
            </div>
        )
    }
}


Clients.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default compose(
    withStyles(styles),
    graphql(CurrentClients),
)(Clients)