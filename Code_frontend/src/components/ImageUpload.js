import React from 'react';
import { Container, Card, Form,Button, Col, Row } from 'react-bootstrap';
import axios from 'axios'
import urls from "./utils"
import { FacebookButton }  from "react-social";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';


class ImageUpload extends React.Component {

  constructor(props){
    super(props)

    this.state = {
        selectedFile: null,
        selectedFiletoDisplay: null,
        selectedFileName:'',
        showMessage:false,
        showPreview:false,
        showGetTagButton:false,
        showShareButton:false,
        label0: '',
        label1: '',
        label2: '',
        label3: '',
        label4: '',
        username: this.props.userEmailProp,
        trip:'',
        url:''
        
    }
    this.handleChange = this.handleChange.bind(this)
  }

  getLabels = (event) => {
    event.preventDefault();
    
    axios.post(urls.backendURL+'/getLabels', {
         filename:this.state.selectedFile.name,
         username:this.state.username,
         trip:this.state.trip
    }).then(response => response.data).then((data) => {
      console.log(data.response)
        this.setState({
          label0 : '#'+data.response.label0,
          label1 : '#'+data.response.label1,
          label2 : '#'+data.response.label2,
          label3 : '#'+data.response.label3,
          label4 : '#'+data.response.label4
        })
    });
  }

  onFileUpload = (event) => {
  
    event.preventDefault();
    const formData = new FormData();
   

    if(this.state.selectedFile==null){
      alert("Please select an image")
      return
    }

    if(this.state.trip==null || this.state.trip==''){
      alert("Please enter trip")
      return
    }

    console.log("selected file: "+this.state.selectedFile.name)

    formData.append('file', this.state.selectedFile);
    formData.append('fileName', this.state.selectedFile.name)
    formData.append('username', this.state.username);
    formData.append('trip', this.state.trip)
    
    axios.post(urls.backendURL+'/uploadPicture', formData, {
       headers: {
         'Content-Type': 'multipart/form-data'
       }
    }).then(response => response.data).then((data) => {
        console.log(data)
    });
   
    
    var urlarray=this.props.userEmailProp.split("@")
    
    var url="https://d1gv6kjioq2hnb.cloudfront.net/"+urlarray[0]+"/"+this.state.trip+"/"+this.state.selectedFile.name;
    this.setState({
        showMessage:true,
        showPreview:false,
        showGetTagButton:true,
        url:url
       
    })


    console.log("after uploading")
    console.log(this.state.selectedFile.name)
  };//end of onFileUpload

  handlePlaceChange = (e) => {
    this.setState({ trip: e.target.value });
  }
  

    handleChange(event) {
      event.preventDefault();
      this.setState({
          selectedFiletoDisplay: URL.createObjectURL(event.target.files[0]),
          selectedFile: event.target.files[0],
          showMessage: false,
          showPreview:true
      })
    };// end of handleChange

    render() {
    
    const fileName = this.state.selectedFileName;

    return (
      <Container fluid>

          <Row>
          <Col>
          <Row>
          <Card style={{ width: '40rem' }}><Card.Body> 
          <div className="col d-flex justify-content-center">
            <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Select the image that you want to upload</Form.Label>
                  <Form.Control type="file" onChange={this.handleChange}/>
                  &nbsp;
                  <Form.Control size="md" type="text" value={this.state.places} 
                  placeholder="Trip" onChange={this.handlePlaceChange} />
            </Form.Group>
            <div>&nbsp;&nbsp;</div>
            </div>
           <div className="col d-flex justify-content-center">
            <Button  onClick={this.onFileUpload} variant="dark">Save to Cloud</Button> 
            </div>&nbsp;&nbsp;
            
            {/* Enter the facebook developer api key Example appId={000000000000000} */}
            <div className="col d-flex justify-content-center">

           <FacebookButton url={this.state.url} appId={1111111}> 

              {"share"}<FontAwesomeIcon icon={faFacebook} size="1x" color="black"/> </FacebookButton> 
            </div>
          </Card.Body></Card></Row>
          <Row>
          <Card style={{ width: '40rem' }}>
            <Card.Body>
            
            <Row>
            <div className="col d-flex justify-content-center">
            {this.state.showGetTagButton==true?
            (<Button  onClick={this.getLabels} variant="dark">Whats in it?</Button>):
            (<div></div>)}
            </div>
            </Row>
            <Row>
            <div className="col d-flex justify-content-center">
            <Container>
            <Row><h5>{this.state.label0}</h5> 
            <h5>{this.state.label1}</h5> 
            <h5>{this.state.label2}</h5> 
            <h5>{this.state.label3}</h5> 
            <h5>{this.state.label4}</h5> </Row>
            </Container>
            </div>
            </Row>
            </Card.Body>
          </Card>
          </Row>
          </Col>
          <Col>
          <div className="col d-flex justify-content-center">
              {this.state.showMessage===true?
              (<div>
                <h5>{this.state.selectedFile.name} Successfully Uploaded !!</h5>
                <img className="resize" src={this.state.selectedFiletoDisplay}/>
                </div>):
              (<div></div>)}
              {this.state.showPreview===true?
              (<img className="resize" src={this.state.selectedFiletoDisplay}/>):
              (<div></div>)}
              {/* <img className="resize" src={fileName}/> */}
          </div>
          </Col>
          </Row>
        </Container>
    );
  }
}

export default ImageUpload;