import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
//import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Autosuggest from 'react-autosuggest';

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
    container: {
        flexGrow: 1,
        position: 'relative',
        height: 200,
      },
      suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,
      },
      suggestion: {
        display: 'block',
      },
      suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
      },
      textField: {
        width: '100%',
      },
});



const ClientsLookup = gql`
  query ClientsLookup($text: String!) {
    clientsLookup(text:$text) {
        id,name,surname
    }
  }
`;


class ClientLookup extends React.Component {
    state = {
        value: "",
        suggestions: [],
    }

    handleChange = (event, op) => {
        console.log("handleChange",op)
        this.setState({
          value: op.newValue,
        });
    };

    handleSuggestionsFetchRequested = (op) => {
        console.log("handleSuggestionsFetchRequested",op,this)
        this.props.client.query({query:ClientsLookup,variables:{text:op.value}}).then(r=>{
            this.setState({suggestions: r.data.clientsLookup});
        }).catch(console.error);
    };

    handleSuggestionsClearRequested = () => {
        console.log("handleSuggestionsClearRequested")
    }

    renderInput(inputProps) {
        const { classes, autoFocus, value, ref, ...other } = inputProps;
        console.log("renderInput",inputProps);
        return (
          
          <TextField
            autoFocus={autoFocus}
            className={classes.textField}
            value={value}
            inputRef={ref}
            InputProps={{
              classes: {
                input: classes.input,
              },
              ...other,
            }}
          />
        
     
        );
        
    }

    renderSuggestion(suggestion, { query, isHighlighted }) {
        console.log("renderSuggestion")
        return (
            <MenuItem selected={isHighlighted} component="div">
              <div>
                    <span>
                      {suggestion.name}
                    </span>
             
                    <span>
                      {suggestion.surname}
                    </span>
                  
              </div>
            </MenuItem>
          );
    }

    renderSuggestionsContainer(options) {
        const { containerProps, children } = options;
        console.log("renderSuggestionsContainer");
        return (
          <Paper {...containerProps} square>
            {children}
          </Paper>
        );
      }

    getSuggestionValue(suggestion) {
        console.log("getSuggestionValue")
        return suggestion.id;
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
            <Typography> I Am TestComponent </Typography>
            <Autosuggest 
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={(i)=>this.renderInput(i)}
                inputProps={{
                    autoFocus: true,
                    classes,
                    placeholder: 'Search a country (start with a)',
                    value: this.state.value,
                    onChange: this.handleChange,
                  }}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}

                renderSuggestionsContainer={(o)=>this.renderSuggestionsContainer(o)}
                getSuggestionValue={(s)=>this.getSuggestionValue(s)}
                renderSuggestion={(s,op)=>this.renderSuggestion(s,op)}
            />
            </div>
        )
    }
}

ClientLookup.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withApollo(compose(
    withStyles(styles),
    
)(ClientLookup))