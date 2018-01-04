import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { graphql } from 'react-apollo';
import { connect } from 'react-redux'
import gql from 'graphql-tag';
import { setClientPageNo, setClientPageLength } from './../actions'

import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from 'material-ui/Table'





const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    table: {
        minWidth: 800,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});
  
const CurrentClients = gql`
  query Clients($pageNo: Int!, $pageLength: Int!) {
    clients_pages(pagination:{pageNo:$pageNo,pageLength:$pageLength}) {
      items {
        id
        no
        name
        surname
        email
        phone
      }

      paginationInfo {
        pageNo
        pageLength
        totalPages
        totalCount
      }
    }
  }
`;


class Clients extends React.Component {

    state = {
        page:1,
        count:1,
        rowsPerPage:20
    }

    handleChangePage = (event, page) => {
        this.props.onSelectPageNo(page)
    };
    
    handleChangeRowsPerPage = event => {
        this.props.onSelectPageLength(event.target.value);
    };

/*
    componentWillReceiveProps(nextProps) {
        if (nextProps.clients) {
            console.log("clients")
            console.log("loading",nextProps.clients.loading)
            console.log("data",nextProps.clients.clients_pages)
        } else {
            console.log("no")
        }
    }
*/

    renderClients(clients) {
        return clients.map(user=> (
          <TableRow key={user.id}>
             <TableCell>{user.no}</TableCell>
             <TableCell>{user.surname}</TableCell>
             <TableCell>{user.name}</TableCell>
          </TableRow>
        ));
    }
    renderPaginator(pi) {
        return (
            <TablePagination
            count={1000}
            rowsPerPage={pi.pageLength}
            page={pi.pageNo}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            /> 
        )
    }

    render() {
        const { classes } = this.props;
        const rows = !this.props.clients.clients_pages ?[]:this.renderClients(this.props.clients.clients_pages.items);
        const paginator = !this.props.clients.clients_pages ?null:this.renderPaginator(this.props.clients.clients_pages.paginationInfo);
        return (
            <div>
            <Typography> I Am Clients page {this.props.current_page_no} </Typography>
            <Table className={classes.table}>
                <TableHead>
    
                    <TableRow>
                        <TableCell>ev.c.</TableCell>
                        <TableCell>prijmeni</TableCell>
                        <TableCell>jmeno</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        {paginator}
                    </TableRow>
                </TableFooter>
            </Table>
           
            </div>
        )
    }
}


Clients.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

function mapStateToProps(state) {
    return { 
        current_page_no: state.clientPage.pageNo,
        current_page_length: state.clientPage.pageLength
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
      onSelectPageNo: no => {
        dispatch(setClientPageNo(no))
      },
      onSelectPageLength: no => {
        dispatch(setClientPageLength(no))
      }
    }
}
  
export default compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
    graphql(CurrentClients,{
        name: "clients",
        options: ({current_page_no,current_page_length})=>({variables:{pageNo:current_page_no,pageLength:current_page_length}})
    }),


)(Clients)