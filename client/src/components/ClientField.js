import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { findDOMNode } from 'react-dom'
import Popover from 'material-ui/Popover';
import SearchIcon from 'material-ui-icons/Search';
import ClearIcon from 'material-ui-icons/Clear';
import IconButton from 'material-ui/IconButton';
import ClientLookup from './ClientLookup';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


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


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    textfield: {
        margin: theme.spacing.unit,
    },
    iconbutton: {
        width:'30px'
    }

});
  

class ClientField extends React.Component {

    state = {
        open:false,
        anchorEl:null,
    }

    handleSelectClient = (client) => {
        this.props.onChange(client.id);
        this.setState({open:false})
    }

    handleClear = () => {
        this.props.onChange(null);
    }
    handleClick = () => {
        const { open } = this.state
        if (!open) {
            this.setState({
                open: true,
                anchorEl: findDOMNode(this.input),
            })
        } else {
            this.setState({
                open: false,
            })
        }
    }


    handleClose = () => {
        this.setState({open:false,anchorEl:null})
    }


 
    render() {
        const { classes } = this.props;
        let val = null;
        if (this.props.client && this.props.client.client) {
            val = this.props.client.client.surname+" "+this.props.client.client.name;
        }
        return (
            <FormControl className={classes.textfield} margin={this.props.margin}
                ref={node => {
                    this.input = node;
                }} 
            >
                <InputLabel htmlFor={this.props.id}>{this.props.label}</InputLabel>
                <Input 
                    name={this.props.name} 
                    id={this.props.id} 
                    value={val?val:""} 
                    style={{width:400}}  
                    inputProps={{readOnly:true,onClick:this.handleClick}}
                    endAdornment={
                        <InputAdornment position="end">
                            {val && (
                                <IconButton className={classes.iconbutton} onClick={this.handleClear}>
                                    <ClearIcon/>
                                </IconButton>
                            )}
                            <IconButton  className={classes.iconbutton} onClick={this.handleClick}>
                               <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Popover style={{width:400}}
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleClose}
                        anchorOrigin={{vertical:"bottom",horizontal:"left"}}
                        disableRestoreFocus
                >

                    
                    <ClientLookup 
                        onSelect={this.handleSelectClient}
                    /> 
                </Popover>


           
            </FormControl>
        )
    }
}


ClientField.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    margin: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string
};
  
ClientField.defaultProps = {
    autoFocus: false,
    name: "client",
    id:"clientfield",
    label:"Klient"
}


export default compose(
    withStyles(styles),
    graphql(CurrentClient,{
        name: "client",
        options: ({value})=>({variables:{client_id:value}}),
        skip: ({value}) => (!value)
    }),

)(ClientField)