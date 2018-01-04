import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import { connect } from 'react-redux'
import gql from 'graphql-tag';
import { setClientPageNo } from './../actions'


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});
  
const CurrentClients = gql`
  query Clients($pageNo: Int!) {
    clients_pages(pagination:{pageNo:$pageNo,pageLength:10}) {
      items {
        id
        name
        surname
        email
        phone
      }
    }
  }
`;


class Clients extends React.Component {

    renderClients(clients) {
        console.log(clients)
        return clients.map(user=> (
          <div key={user.id}> {user.id} {user.name} {user.surname} {user.phone} {user.email} </div>
        ));
    }
    

    render() {
        return (
            <div>
            <Typography> I Am Clients page </Typography>
            {this.props.clients.loading ? <div> loading </div>: this.renderClients(this.props.clients.clients_pages.items) }
            </div>
        )
    }
}


Clients.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

function mapStateToProps(state) {
    return { current_page_no: state.clientPage }
}
  
const mapDispatchToProps = dispatch => {
    return {
      onSelectPageNo: no => {
        dispatch(setClientPageNo(no))
      }
    }
}
  
export default compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
    graphql(CurrentClients,{
        name: "clients",
        options: ({current_page_no})=>({variables:{pageNo:current_page_no}})
    }),


)(Clients)