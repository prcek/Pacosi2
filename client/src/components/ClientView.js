import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});
  
const CurrentClient = gql`
  query Client($client_id: ID!) {
    client(id:$client_id) {
      id
      no
      name
      surname
      phone
    }
  }
`;


class ClientView extends React.Component {


    render() {
        if (this.props.client && this.props.client.client) {
            return (
                <span>{this.props.client.client.surname}&nbsp;{this.props.client.client.name}</span>
            )
        } else {
            return null;
        }
    }
}


ClientView.propTypes = {
    classes: PropTypes.object.isRequired,
    client_id: PropTypes.string,
};
  

export default compose(
    withStyles(styles),
    graphql(CurrentClient,{
        name: "client",
        options: ({client_id})=>({variables:{client_id:client_id}}),
        skip: ({client_id}) => (!client_id)
    }),

)(ClientView)