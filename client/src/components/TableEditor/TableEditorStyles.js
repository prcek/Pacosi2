/*import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import Paper from 'material-ui/Paper';
import Moment from 'moment';*/

const TestComponentBaseStyles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
      width: '100%',
    },

    table: {
        minWidth: 800,
    },
    toolbar: {
        minHeight:0
    },
    textfield: {
        margin: theme.spacing.unit
    },
    filterfield: {
        margin: theme.spacing.unit,
        width:"300px"
    },
    input: {
        fontSize: 'inherit',
        flexShrink: 0,
    },
    button: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit * 2,
    },
    selectRoot: {
        marginRight: theme.spacing.unit * 4,
        marginLeft: theme.spacing.unit,
        color: theme.palette.text.secondary,
    },
    select: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 2,
    },
    selectIcon: {
        top: 1,
    },
    spacer: {
        flex: '1',
    },
    pager: {
        width:"100%",
    },
});
  
export default TestComponentBaseStyles;
