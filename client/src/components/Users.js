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
  
const CurrentUsers = gql`
  query CurrentUsers {
    users {
      id
      name
      email
    }
  }
`;


class Users extends React.Component {

    renderUsers(users) {
        return users.map(user=> (
          <div key={user.id}> {user.name} {user.email} </div>
        ));
    }
    

    render() {
        return (
            <div>
            <Typography> I Am Users page </Typography>
            {this.props.data.loading ? <div> loading </div>: this.renderUsers(this.props.data.users) }
            </div>
        )
    }
}


Users.propTypes = {
    classes: PropTypes.object.isRequired,
    
};
  

export default compose(
    withStyles(styles),
    graphql(CurrentUsers),
)(Users)