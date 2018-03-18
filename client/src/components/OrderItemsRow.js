import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo'
import  {  TableCell, TableRow} from 'material-ui/Table';
import { DragSource, DropTarget } from 'react-dnd';
import classNames from 'classnames';
import DragHandle from './DragHandle';
import { darken, fade, lighten } from 'material-ui/styles/colorManipulator';
import StatusView from './StatusView';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  root: {
    width: '100%',
   // maxWidth: 1000,
   // background: theme.palette.background.paper,
  },
  dragging: {
    opacity:0,
    //color: "rgba(0, 0, 0, 0)",
    //backgroundColor:"red"
  },
  cell: {
    height:30,
    paddingTop:1,
    paddingBottom:1,
    paddingLeft:2,
    paddingRight:2,
  },
  cellb: {
    height:30,
    paddingTop:1,
    paddingBottom:1,
    paddingLeft:2,
    paddingRight:2,
    borderLeft: `1px solid
    ${
      theme.palette.type === 'light'
        ? lighten(fade(theme.palette.divider, 1), 0.88)
        : darken(fade(theme.palette.divider, 1), 0.8)
    }`
  },
  row: {
    height:24,
  }
});


class OrderItemsRow extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {  
    
    }
  }
 


 
  
  

  render() {
    const { activeDrag, isDragging, connectDragSource, connectDragPreview,connectDropTarget, doc, toolbar, classes } = this.props;
    const className = classNames([
      { [classes.dragging]: isDragging },
      { [classes.hover]: !activeDrag},
      classes.row
    ]);
    return (
    
      
      <TableRow hover={!activeDrag} className={className}>
          <TableCell className={classes.cell}> {connectDropTarget(connectDragSource(
            <div><DragHandle/></div>
            ))} </TableCell>
          <TableCell className={classes.cell}> {connectDragPreview(<div>{doc.name}</div>)} </TableCell>

          <TableCell className={classes.cell}><StatusView status={doc.status}/></TableCell>
          <TableCell className={classes.cell}>  
            {toolbar}
          </TableCell>
      </TableRow>

      );
  }
}

OrderItemsRow.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  doc: PropTypes.object.isRequired,
  toolbar: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  activeDrag: PropTypes.bool.isRequired,
  findRow: PropTypes.func.isRequired,
  moveRow: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

OrderItemsRow.defaultProps = {
 
};


const rowSource = {
  beginDrag(props) {
    props.onDrag(true);
    const r = {
      doc: props.doc,
      id: props.id,
      originalIndex: props.findRow(props.id).index,
    };
  
    return r;
  },
  endDrag(props, monitor, component) {
    props.onDrag(false);

    const { id: droppedId, originalIndex } = monitor.getItem()
		const didDrop = monitor.didDrop()

		if (!didDrop) {
			props.moveRow(droppedId, originalIndex)
    } else {
      props.save();
    }
    
    return;
  }
};

const rowTarget = {
  
  hover(props, monitor, component) {

    const draggedId  = monitor.getItem().id;
		const overId  = props.id;

		if (draggedId !== overId) {
			const overIndex  = props.findRow(overId).index;
			props.moveRow(draggedId, overIndex);
		}
    return;
  }
}

function dnd_src(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}
function dnd_trg(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

export default compose(
  withStyles(styles),
  DropTarget('row', rowTarget, dnd_trg),
  DragSource('row', rowSource, dnd_src)
  
)(OrderItemsRow)
