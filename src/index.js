
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";

import './index.css';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { DropzoneDialog } from 'material-ui-dropzone';

import specsProgDisplay  from  './data_creatives-specs/specs-progDisplay.json'
import specsProgVideo  from  './data_creatives-specs/specs-progVideo.json'



class CreaChecker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
            },
            creas2: []
        };
        this.handleOnDrop = this.handleOnDrop.bind(this);
    }
    componentDidUpdate(prevProps) {
        console.log("================  component did update ==================")
  
    }
    handleClose() {
        this.setState({
            open: false
        });

    }

    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files,
            open: false
        });
        console.table(this.state.creas2);
        console.table(specsProgDisplay);
        console.table(specsProgVideo);
    }
    handleOpen() {
        this.setState({
            open: true,
        })
    }
    handleOnDrop(files) {
        this.setState({
            files: files,
            open: true,
        })
        for (let i = 0; i < files.length; i += 1) {
            console.log("================ for loop ==================")

            // console.log(files[i]);
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
                    acceptedFiles={['image/jpeg', 'image/png', 'image/jpg', 'image/gif']}
                    showPreviews={true}
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
function creativesChecker(creas) {

    for (let i = 0; i < creas.length; i += 1) {
        console.log(creas[i].width);
        console.log(creas[i].height);
        console.log(creas[i].files[i]);
    }
    return true;
}



ReactDOM.render(

    <CreaChecker />,
    document.getElementById('root')
);