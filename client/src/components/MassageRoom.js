import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'


const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});
  


class MassageRoom extends React.Component {
    render() {
        return (
            <Typography> I Am MassageRoom (id:{this.props.massageRoomId}) </Typography>
        )
    }
}


MassageRoom.propTypes = {
    classes: PropTypes.object.isRequired,
    massageRoomId: PropTypes.string.isRequired
};
  

export default compose(
    withStyles(styles)
)(MassageRoom)