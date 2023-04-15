import React from 'react';
import { Container, Card,Form,Button, Col, Row, Carousel } from 'react-bootstrap';
import axios from 'axios'
import urls from "./utils"
import { DateUtils } from '@aws-amplify/core';

class ImageSearch extends React.Component {

    constructor(props){
      super(props)
  
      this.state = {
        places:'',
        searchLabel:'',
        user:'',
        showImage:false,
        images:[]
      }
    }


    onFileSearch = (event) => {
  
      event.preventDefault();

      if(this.state.places==null || this.state.places==''){
        alert("Please entry place")
        return
      }
      if(this.state.searchLabel==null || this.state.searchLabel==''){
        alert("Please entry search criteria")
        return
      }

      console.log(this.state.places)
      console.log(this.state.searchLabel)
      console.log(this.state.user)
      console.log(this.state.showImage)

    axios.post(urls.backendURL+'/searchPicture', {
        places:this.state.places,
        searchLabel:this.state.searchLabel,
        user: this.props.userEmailProp
    }).then(response => response.data).then((data) => {
       console.log(data.response)
       this.setState({
        showImage:true,
        images:data.response
        
      })
    });

    this.setState({
      showImage:true
    })
      
    };//end of onFileSearch

    handlePlaceChange = (e) => {
      this.setState({ places: e.target.value });
    }
  
    handleLabelChange = (e) => {
      this.setState({ searchLabel: e.target.value });
    }

    render() {

      var imagePath= "";
      return(<React.Fragment>
      <Container fluid>
      
      <Row>
        <Col>
      <Card style={{ width: '40rem' }}><Card.Body>
      
      <Form.Control size="md" type="text" value={this.state.places} 
      placeholder="Place visited" onChange={this.handlePlaceChange} />
      &nbsp;
      <Form.Control size="md" type="text" value={this.state.searchLabel} 
      placeholder="Search criteria" onChange={this.handleLabelChange}/>
      &nbsp;
      <div className="col d-flex justify-content-center">
          <Button  onClick={this.onFileSearch} variant="dark">Search</Button>
          <div>&nbsp;</div>
      </div>
      </Card.Body>
      </Card>
      </Col>
      <Col>
     
     
      {console.log("just checking")}
      {this.state.showImage?(
        <div>
          <h4>Results found: {this.state.images.length }</h4>
          <Carousel>
         {this.state.images.map(image => (
           <Carousel.Item>
              <div> {imagePath = urls.cloudfront+""+image}</div>
              {/* <a href={imagePath}>Download</a> */}
              <img
                className="d-block w-100"
                src={imagePath}
                alt={imagePath}
              />
              <Carousel.Caption>
                <h5>{image}</h5>
              </Carousel.Caption>
           </Carousel.Item>
                
            ))}
        </Carousel>
        </div>
      ):(<div></div>)}
          </Col>
          </Row>
          </Container>
          </React.Fragment>)
    }
}

export default ImageSearch;