import React, { Component } from 'react';
import { Container, Card,Form,Button, Col, Row } from 'react-bootstrap';

class SageMaker extends React.Component{
    constructor(props){
        super(props)
        this.state={
            location:'',
            description:''
           
        }
    }
    handleLocationChange = (e) => {
        this.setState({ location: e.target.value });
      }
    handleDescriptionChange = (e) =>{
        this.setState({description: e.target.value});
    }
    
   
    render(){
        return(<React.Fragment>
            <Container fluid>
            
            <Row>
              <Col>
            <Card style={{ width: '40rem' }}><Card.Body>
            
            <Form.Control size="md" type="text" value={this.state.location} 
            placeholder="Enter a location" onChange={this.handleLocationChange} />
            &nbsp;
            <Form.Control size="md" type="text" value={this.state.description} 
            placeholder="Enter description of a trip you are planning" onChange={this.handleDescriptionChange}/>
            &nbsp;
            <div className="col d-flex justify-content-center">
                <Button  onClick={this.recommendSagemaker} variant="dark">Recommend</Button>

                {/* The recommend button would invoke the function jupyter notebook in sagemaker by passing paramters
                location and description of the trip you are planning, and will return recommendations based on input */}
                <div>&nbsp;</div>
            </div>


            </Card.Body>
            </Card>
            </Col>
            </Row>
            </Container>
    </React.Fragment>
        )
        }
}
export default SageMaker;
