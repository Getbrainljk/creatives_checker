
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";

import './index.css';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { DropzoneDialog } from 'material-ui-dropzone';


const specsProgDisplay = require('./data_creatives-specs/specs-progDisplay.json')
const specsProgVideo = require('./data_creatives-specs/specs-progVideo.json')

var inOrder = new Boolean(true)


class CreaChecker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        const validationMessages = {
            successMsg: () => 'Les créatives sont bien aux formats!',
            noteMsg: () => 'Ici joint les formats et specificités liés à vos creatives:',
            formatMsg: (param) => `Le format'+ ${param.requiredLength}`,
            extensionMsg: (param) => `Max chars allowed is ${param.requiredLength}`,
        };
    }

    render() {
        let isValid;
        isValid = "valid";
        return (
            <Container>
                <h1 className="p-3">Verification des créatives</h1>
                <h6 className="attention">
                    Attention: Cette verification comporte l’extension, la taille, le poid, les normes basique mais n’incluent pas les normes de visibilité.</h6>
                <div className="mb-3">
                    <DropzoneDialogElem />
                </div>
                <div>
                </div>
            </Container>
        );
    }
}


export default class DropzoneDialogElem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: [],
            creas: {
                width: PropTypes.string,
                height: PropTypes.number,
                filesObj: null,
                inOrder: true,
            },
            creas2: []

        };
    }

    /*
    taillesRecommandes
    normesRespecter
    poidsMaximum
    extensionsAutorises
    */


    componentDidUpdate(prevProps) {

        function filterByContains(jsonObj, id, param) {
            if (!jsonObj || !param)
                return false;
            for (let i = 0; i < jsonObj.length; i += 1) {
                if (jsonObj[i] && (id in jsonObj[i]))
                {
                    console.log("jsonobj i id:" +jsonObj[i][id].toString().toLowerCase());
                    console.log("param:" + param.toString().toLowerCase());
                    if ((jsonObj[i][id].toString().toLowerCase()
                                .includes(param.toString().toLowerCase())) == true)
                                return true;
            }}
            return false;
        }
        function formatsChecker(crea) {
       //     for (let i = 0; i < this.state.creas2.length; i += 1) {
                var inOrder = true;
                const sizeCreasInput = crea.width.toString() + "x" + crea.height.toString();
                for (let i = 0; i < specsProgDisplay.length; i += 1) {
                    if (specsProgDisplay[i].taillesRecommandes) {
                        if (specsProgDisplay[i].taillesRecommandes.toString().toLowerCase().includes(sizeCreasInput)) {
                            inOrder = true;
                            crea.inOrder = true;
                            console.log("aux specs (formats)");
                            break;
                        }
                    }
                    inOrder = false;
                }
                if (!inOrder) {
                    crea.inOrder = false;
                    console.log("pas aux specs (formats)");
                    return;//break;
                }
           // }
        }
        console.log("================  component did update ==================")
        for (let i = 0; i < this.state.creas2.length; i += 1) {

            var ext = this.state.creas2[i].filesObj.type.substr(this.state.creas2[i].filesObj.type.lastIndexOf('/') + 1);

            //      for (let i = 0; i < specsProgDisplay.length; i += 1) {
            //  if (!specsProgDisplay[i].extensionsAutorises)
            //    continue;
//            console.log("bool?:"+filterByContains(specsProgDisplay, "extensionsAutorises", ext));
            switch (true) {

                case filterByContains(specsProgDisplay, "extensionsAutorises", ext):
                    console.log("IMG FILE DETECTED");
                    formatsChecker(this.state.creas2[i]);
                    break;
                case filterByContains(specsProgVideo, "extensionsAutorises", ext):
                    console.log("VIDEO FILE DETECTED");
                    break;
                default:
                    console.log(" pas aux specs?: extension:" + ext);
                    break;
            }
        }
    }

    handleClose() {
        this.setState({
            open: false
        });

    }

    handleSave(files) {
        console.log("================  OnSave() ==================")

        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files,
            open: false
        });

    }
    handleOpen() {
        this.setState({
            open: true,
        })
        console.log("handleOpen");
    }

    handleOnDrop(files) {
        console.log("================  OnDrop() ==================")

        this.setState({
            files: files,
            open: true,
        })

        for (let i = 0; i < files.length; i += 1) {

            const oFReader = new FileReader();
            oFReader.readAsDataURL(files[i]);
            oFReader.onload = (e) => {
                var image = new Image();
                image.src = e.target.result;
                image.onload = () => {
                    this.setState(prevState => {
                        return {
                            creas2: [...prevState.creas2,
                            {
                                width: image.width,
                                height: image.height,
                                filesObj: files[i],
                            },
                            ]
                        }
                    })
                    image = null;
                }
                if (image) {
                    this.setState(prevState => {
                        return {
                            creas2: [...prevState.creas2,
                            {
                                width: image.width,
                                height: image.height,
                                filesObj: files[i],
                            },
                            ]
                        }
                    })
                }

            }
        }
    }

    render() {
        return (

            <div>

                <Button variant="contained" onClick={this.handleOpen.bind(this)} color="primary">
                    Charger élément graphique
                </Button>
                <DropzoneDialog
                    //  dialogTitle
                    open={this.state.open}
                    onSave={this.handleSave.bind(this)}
                    //   acceptedFiles={['image/jpeg', 'image/png', 'image/jpg', 'image/gif']}
                    showPreviews={false}
                    onClose={this.handleClose.bind(this)}
                    // onAdd={this.handleOnAdd.bind(this)}
                    // onChange={this.handleOnChange.bind(this)}
                    filesLimit={50}
                    maxFileSize={1000000000000000000000000000000000000000000000000000000000000000000}
                    onDrop={this.handleOnDrop.bind(this)}
                />

            </div>

        );
    }
}


ReactDOM.render(

    <CreaChecker />,
    document.getElementById('root')
);