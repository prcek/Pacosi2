import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
import jsPDF from 'jspdf';
require('jspdf-autotable');

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      width: '100%',
      height: '500px',
    },
});
  


class PdfView extends React.Component {


    getPdf() {

        var columns = ["ID", "Country", "Rank", "Capital"];
        var data = [
            [1, "Denmark", 7.526, "Copenhagen"],
            [2, "Switzerland", 	7.509, "Bern"],
            [3, "Iceland", 7.501, "Reykjavík"],
            [4, "Norway", 7.498, "Oslo"],
            [5, "Finland", 7.413, "Helsinki"],
            [1, "Denmark", 7.526, "Copenhagen"],
            [2, "Switzerland", 	7.509, "Bern"],
            [3, "Iceland", 7.501, "Reykjavík"],
            [4, "Norway", 7.498, "Oslo"],
            [5, "Finland", 7.413, "Helsinki"]
        ];

        var doc = new jsPDF();
        doc.autoTable(columns, data, {startY: 50, showHeader: 'firstPage'});
        
        
        doc.setProperties({
            title: 'Example: X' ,
            subject: 'A jspdf-autotable example pdf'
        });
        //doc.autoPrint();
        const pdfstring = doc.output('datauristring');
        return pdfstring;
    }


    render() {
        const { classes } = this.props;
        const src = this.getPdf();
        return (
            <div className={classes.root}>
                <embed width="100%" height="100%" name="plugin" id="plugin" src={src} type="application/pdf"/>
            </div>
        )
    }
}


PdfView.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default compose(
    withStyles(styles),
)(PdfView)