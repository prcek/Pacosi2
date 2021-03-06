import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'react-apollo'
//import jsPDF from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";


import Moment from 'moment';
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
require("moment/min/locales.min");
moment.locale('cs');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const styles = theme => ({
    root: {
      //paddingTop: '64px',
      width: '100%',
      height: '100%',
    },
});
  



class PdfView extends React.Component {
    state = {
        datauristring: null
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.genPdf();
    }



    genPdf() {
        console.log("pdf render start")
        var docDefinition = {
            pageOrientation: this.props.landscape?'landscape':'portrait',
            info: {
                title: this.props.title,
                //author: 'CLR Evidence',
                //subject: 'subject of document',
                //keywords: 'keywords for document',
            },
            content: [ 
                {text: this.props.title, style: "header"},
                this.props.description,
                {
                    style: 'table',
			        table: {
                        widths: this.props.widths?this.props.widths:this.props.cols.map((x)=>{return "*"}),
                        headerRows: 1,
                        body: [
                            this.props.cols.map((x)=>{return {
                                text: x,
                                style:'tableHeader',
                                border: [false, false, false, false]
                            }}),
                            ...this.props.rows.map( (r,line)=>{
                                return r.map((x)=>{
                                    return {
                                        text:x?x:"",
                                        border: [false, false, false, false],
                                        fillColor: (line % 2 === 0)?[255,255,255]:[245,245,245]
                                    };
                                });
                            })    
                        ]
                    }
                },
                {text: "stav k "+moment().format("LLL"), style: 'footer'}
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                footer: {
                    alignment: 'right',
                    fontSize: 8,
                    italics: true
                },
                table: {
                    margin: [0, 5, 0, 15],
                    fontSize: 10
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'white',
                    fillColor: [41, 128, 185]
                }
            },
         };
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getDataUrl((dataUrl) => {
            this.setState({datauristring:dataUrl});
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.state.datauristring && (
                    <embed width="100%" height="100%" name="plugin" id="plugin" src={this.state.datauristring} type="application/pdf"/>
                )}
            </div>
        )
    }
}


PdfView.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    landscape: PropTypes.bool,
    widths: PropTypes.array,
    cols: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string,PropTypes.number]))).isRequired
};
  
PdfView.defaultProps = {
    landscape: false
}

export default compose(
    withStyles(styles),
)(PdfView)