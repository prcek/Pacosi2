import React from 'react';
import { withStyles } from 'material-ui/styles';
//import { fade } from 'material-ui/styles/colorManipulator';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import TextField from 'material-ui/TextField';
//import GridList  from 'material-ui/GridList';
import { MenuItem, MenuList } from 'material-ui/Menu';

const styles = theme => ({
    root: {
        width: '350px',
      //  borderStyle: 'solid',
      //  borderColor: 'green',
      //  borderWidth: 'thin',
        padding: "5px"
    },
    textfield: {
        margin: theme.spacing.unit
    },
    /*
    gridList: {
        width: "100%",
        height: 100,
    },
    */

    //gridItem: {
    //    display: "flex",
    //    justifyContent: "left", /* align horizontal */
   //     alignItems: "center",
        //borderStyle: 'solid',
        //borderColor: 'green',
        //borderWidth: 'thin',
    //},
    
    menuList: {
        width: "100%",
        height: 300,
        overflowY:"auto"
    },
    menuItem: {
        
    }
});


const ClientsLookup = gql`
  query ClientsLookup($text: String!, $limit:  Int, $location_id: ID) {
    clientsLookup(text:$text,limit:$limit,location_id:$location_id) {
        id,name,surname,no,phone
    }
  }
`;


class ClientLookup extends React.Component {

    state = {
        srch: "",
        suggestions: []
    }

    handleSrchChange = (val) => {
        console.log("handleSrchChange",val)
        this.setState({srch:val});
        if (val !== "") {
            this.doLookup(val);
        } else {
            this.setState({suggestions:[]});
        }
    }

    doLookup(srch) {
        var variables={text:srch,limit:25};
        if (!this.props.allLocations && this.props.current_location_id && this.props.current_location_id !== "") {
            variables.location_id = this.props.current_location_id;
        }

        this.props.client.query({query:ClientsLookup,variables:variables,fetchPolicy:"cache-and-network"}).then(r=>{
            this.setState({suggestions: r.data.clientsLookup});
        }).catch(console.error);
    }

    renderInput() {
        const { classes } = this.props;
        return (
            <TextField
                autoFocus
                id="search"
                label="Hledání v evidenci klientů"
                type="search"
                className={classes.textField}
                fullWidth
                margin="none"
                value={this.state.srch}
                onChange={(e)=>this.handleSrchChange(e.target.value)}
            />
        )
    }

    onSuggestClick = (client) => {
        console.log("ClientLookup.onSuggestClick",client)
        this.props.onSelect(client);
    }

    renderSuggestions() {
        const { classes } = this.props;
        const { suggestions } = this.state;
        return (
            <MenuList  className={classes.menuList}>
                {suggestions.map((item,idx) => (
                    <MenuItem dense divider className={classes.menuItem} key={idx} onClick={(e)=>this.onSuggestClick(item)} >
                       <Typography> {item.surname}&nbsp;{item.name}&nbsp;{item.phone} </Typography>
                    </MenuItem>
                ))}
            </MenuList>
        )
    }

    render() {
        
        const { classes } = this.props;
        const input = this.renderInput();
        const suggestions = this.renderSuggestions();
        return (
           
            <div className={classes.root}> 
                {input}
                {suggestions}
            </div>
        
        )
    }
}

ClientLookup.propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    allLocations: PropTypes.bool
}


ClientLookup.defaultProps = {
    allLocations: false
}

function mapStateToProps(state) {
    return { 
        current_location_id: state.location,
    }
}

const mapDispatchToProps = dispatch => {
    return {
     
    }
}


export default withApollo(compose(
    withStyles(styles),
    connect(mapStateToProps,mapDispatchToProps),
)(ClientLookup))
