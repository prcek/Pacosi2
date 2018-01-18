import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { compose } from 'react-apollo'
import MassageTypeField from './MassageTypeField'

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
    },
});
  
function null2empty(v) {
    if ((v === null) || (v === undefined)) {return ""}
    return v;
}
function empty2null(v) {
    if (v === "") { return null} 
    return v;
}


class MassageOrder extends React.Component {
    state = {
        doc: {}
    }
    render() {
        return (
            <div>
            <Typography> I Am TestComponent </Typography>
            <MassageTypeField
                        margin="dense"
                        id="lt_masstype-simple"
                        name="massagetype"
                        label="Typ masáže"
                        value={null2empty(this.props.massageOrder.massage_type_id)}
                        onChange={(e)=>this.props.onMassageOrderChange("massage_type_id",empty2null(e.target.value))}
            />

            </div>
        )
    }
}

MassageOrder.propTypes = {
    classes: PropTypes.object.isRequired,
    massageOrder: PropTypes.object.isRequired,
    onMassageOrderChange: PropTypes.func.isRequired
}  

export default compose(
    withStyles(styles),
)(MassageOrder)