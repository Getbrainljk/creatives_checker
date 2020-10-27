
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";

import './index.css';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { DropzoneDialog } from 'material-ui-dropzone';
import ReactGoogleSlides from "react-google-slides";

const specsProgDisplay = require('./data_creatives-specs/specs-progDisplay.json')
const specsProgVideo = require('./data_creatives-specs/specs-progVideo.json')

var inOrder = true;


class CreaChecker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    render() {
        let isValid;
        isValid = "valid";
        return (
            <Container>
                <h1 className="p-3">Verification des créatives
                <span role="img" aria-label="arrow">{' '} ✔️</span>
                </h1>
                <h6 className="attention">
                    Attention: Cette verification comporte l’extension, la taille, le poids, les normes basique mais n’incluent pas les normes de visibilité.</h6>
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
            creas2: [],
            onSpecs: true,
        }
        this.initialState = { ...this.state };

    }

    /*
    taillesRecommandes
    normesRespecter
    poidsMaximum
    extensionsAutorises
    */

    componentDidUpdate(prevProps) {
    }

    handleClose() {
        this.setState({
            open: false
        });

    }

    handleSave(files) {
        console.info("================  OnSave() ==================")

        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files,
            open: false,
        }

        );
        const validationMessages = {
            successMsg: 'Les créatives sont bien aux formats!',
            noteMsg: 'Ici joint les formats et specificités liés à vos creatives:',
            formatMsg: "Erreur: Le format n'est pas aux spécificités.",
            extensionMsg: "Erreur: L\'extension utilisé n\'est pas géré",
            weightMsg: "Erreur: Le format est trop lourd."
        };
        function filterByContains(jsonObj, id, param) {
            if (!jsonObj || !param)
                return false;
            for (let i = 0; i < jsonObj.length; i += 1) {
                if (jsonObj[i] && (id in jsonObj[i])) {
                    //  console.log("jsonobj i id:" +jsonObj[i][id].toString().toLowerCase());
                    //  console.log("param:" + param.toString().toLowerCase());
                    if ((jsonObj[i][id].toString().toLowerCase()
                        .includes(param.toString().toLowerCase())) == true)
                        return true;
                }
            }
            return false;
        }
        function formatsChecker(crea) {
            //     for (let i = 0; i < this.state.creas2.length; i += 1) {
            var inOrder = true;
            const sizeCreasInput = crea.width.toString() + "x" + crea.height.toString();
            for (let i = 0; i < specsProgDisplay.length; i += 1) {
                if (specsProgDisplay[i].taillesRecommandes) {
                    if (specsProgDisplay[i].taillesRecommandes.toString().toLowerCase()
                        .includes(sizeCreasInput)) {
                        inOrder = true;
                        crea.inOrder = true;
                        crea.status = "OK";
                        break;
                    }
                }
                inOrder = false;
                crea.inOrder = false;
                crea.status = validationMessages.formatMsg + '\n';
            }
            return inOrder;

        }
        
        function weightChecker(crea) {
            var inOrder = true;
            for (let i = 0; i < specsProgDisplay.length; i += 1) {
                if (specsProgDisplay[i].poidsMaximum) {
                     const sizeCreasInput = crea.filesObj.size;

                    var j = parseInt(Math.floor(Math.log(crea.filesObj.size) / Math.log(1024)));
                    console.log();
                   
                    if ((crea.filesObj.size / Math.pow(1024, j) )
                         < ( parseFloat(specsProgDisplay[i].poidsMaximum.toString().toLowerCase().replace(/\D/g,'') ))) {
                             console.log(crea.filesObj.size / Math.pow(1024, j) + " < " + 
                             ( parseFloat(specsProgDisplay[i].poidsMaximum.toString().toLowerCase().replace(/\D/g,'') )));
                        inOrder = true;
                        crea.inOrder = true;
                        crea.status = "OK";
                        break;
                    }
                }
                inOrder = false;
                crea.inOrder = false;
                crea.status = validationMessages.weightMsg ;
        }
        return inOrder;
    }
        for (let i = 0; i < this.state.creas2.length; i += 1) {

            var ext = this.state.creas2[i].filesObj.type.substr(this.state.creas2[i].filesObj.type.lastIndexOf('/') + 1);
            //      for (let i = 0; i < specsProgDisplay.length; i += 1) {
            //  if (!specsProgDisplay[i].extensionsAutorises)
            //    continue;
            //            console.log("bool?:"+filterByContains(specsProgDisplay, "extensionsAutorises", ext));
            switch (true) {

                case filterByContains(specsProgDisplay, "extensionsAutorises", ext):
                    console.log("========================");

                    var check = formatsChecker(this.state.creas2[i]);
                    if (check == false) {
                        this.state.onSpecs = false
                    }
                    weightChecker(this.state.creas2[i]);
                    console.log("========================");
                    break;
                case filterByContains(specsProgVideo, "extensionsAutorises", ext):
                    console.log("VIDEO FILE DETECTED");
                    break;
                default:
                    console.log(" pas aux specs?: extension:" + ext);
                    this.state.onSpecs = false;
                    this.state.creas2.status = "testing" ;//Erreur: L\'extension utilisé n\'est pas géré";
                    break;
            }
        }      
    }

    handleOpen() {
        this.setState({
            open: true,
            creas2: [],
            inOrder: true,
            onSpecs: true,
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
                if (!image) {
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
        const items = []

        for (const [index, value] of this.state.creas2.entries()) {
            items.push(
                <li  style={{ fontWeight: 'bold'}}
                    key={index}>{value.filesObj.name}
                    <ul>
                        Status: {' '}
                       {value.status}
                    </ul>
                </li>)
        }
        console.log(items);

        function ShowSpecs(props) {
            console.log("zzz showp:" + props.onSpecs);
            const inorder = props.onSpecs;
            if (inorder)
                return null;
                else {
            return (        
                (
                    <div>
                        <br />
                        <h3> Consultez les formats et spécificités des créatives
                            <span role="img" aria-label="arrow">{' '} 😊:</span>
                        </h3>
                        <ReactGoogleSlides
                            width={640}
                            height={480}
                            slidesLink="https://docs.google.com/presentation/d/1nyPfmaERePtLLt8tI-_pMZgO2qQGy87ZvMC04vF6TXw/edit?usp=sharing"
                            // slideDuration={5}
                            showControls
                            loop
                        />
                    </div>
                )
            );
                }
        }

        return (

            <div>

                <Button variant="contained" onClick={this.handleOpen.bind(this)} color="primary">
                    Charger élément graphique
                </Button>
                <DropzoneDialog
                    showPreviews={true}
                    showPreviewsInDropzone={true}
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
                <div>
                    <br />
                <br />

                    {items}
                </div>
                <div>
                    <ShowSpecs onSpecs={this.state.onSpecs} />
                </div>
            </div>
        );
    }
}


ReactDOM.render(

    <CreaChecker />,
    document.getElementById('root')
);