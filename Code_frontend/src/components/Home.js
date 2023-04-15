import React from 'react';
import {AmplifySignOut } from '@aws-amplify/ui-react';
import Button from 'react-bootstrap/Button';
import { Card, Container,ButtonGroup,Row} from 'react-bootstrap';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import Chatbot from './Chatbot';
import ImageUpload from './ImageUpload';
import ImageSearch from './ImageSearch';
import Weather from './Weather';
import SageMaker from './SageMaker';

Amplify.configure(awsconfig);

var em =''
class Home extends React.Component {

   constructor(props){
     super(props)

     this.state={
         userEmail :'',
         showImageUpload: false,
         showImageSearch: false,
         showWeatherSearch: false,
         showHotelSearch: false,
         showSageMaker: false,
     }
   }

   componentDidMount(props){
    var useremail = ''
    var email = ''

   

    Auth.currentAuthenticatedUser().then(function(result){
        console.log("In app.js")
        console.log(result.attributes.email)
        em = result.attributes.email
         console.log("set to em")
         console.log(em)
      });
   
    if(em=='' || em==null) {

    Auth.currentSession().then(function(data) {
        console.log("in session code...")
        let idToken = data.getIdToken();
        console.dir(idToken);
        email = idToken.payload.email;
        console.log("print email....")

        console.log(email);
        em = email;
        console.log(em);
 
    });
   }

   }


   imageUpload=(event)=>{
    event.preventDefault();
        this.setState({
     
        showImageUpload: true,
        showImageSearch: false,
        showWeatherSearch: false,
        showHotelSearch: false,
        showSageMaker: false,
        })
    }
    imageSearch=(event)=>{
        event.preventDefault();
            this.setState({
         
            showImageUpload: false,
            showImageSearch: true,
            showWeatherSearch: false,
            showHotelSearch: false,
            showSageMaker: false,
        })
    }
    weatherSearch=(event)=>{
    event.preventDefault();
        this.setState({

            showImageUpload: false,
            showImageSearch: false,
            showWeatherSearch: true,
            showHotelSearch: false,
            showSageMaker: false,
        })
    }
    hotelSearch=(event)=>{
        event.preventDefault();
            this.setState({
         
            showImageUpload: false,
            showImageSearch: false,
            showWeatherSearch: false,
            showHotelSearch: true,
            showSageMaker: false,
            })
        }
    sageMaker=(event)=>{
        event.preventDefault();
            this.setState({
             
            showImageUpload: false,
            showImageSearch: false,
            showWeatherSearch: false,
            showHotelSearch: false,
            showSageMaker: true,
        })
    }
   
    render(){
const { user } = this.state;
         return(
         <React.Fragment>
         <Container fluid>
        <Row>
   
         <div className="col d-flex justify-content-center">
         <h4>Hello {em}</h4>
         </div>
         </Row>
         <Row>
         <div className="col d-flex justify-content-center">
         <ButtonGroup>
          <Button variant="dark" onClick={this.imageUpload}>Upload Picture Page</Button>
          &nbsp;&nbsp;
          <Button variant="dark" onClick={this.imageSearch}>Search Picture Page</Button>
          &nbsp;&nbsp;
     <Button variant="dark" onClick={this.weatherSearch}>Current Weather</Button>
          &nbsp;&nbsp;
          <Button variant="dark" onClick={this.hotelSearch}>Book Hotel</Button>{' '}
          &nbsp;&nbsp;
          <Button variant="dark" onClick={this.sageMaker}>Hotel Recommendations</Button>{' '}
          &nbsp;
          </ButtonGroup>
          <AmplifySignOut/>
          </div>
          </Row>
          <Row>
              &nbsp;
      {this.state.showImageUpload=== true? (<ImageUpload userEmailProp={em}></ImageUpload>):(<div></div>)}
      {this.state.showImageSearch=== true? (<ImageSearch userEmailProp={em}></ImageSearch>):(<div></div>)}
      {this.state.showWeatherSearch=== true? (<Weather userEmailProp={em}></Weather>):(<div></div>)}
      {this.state.showHotelSearch=== true? (<Chatbot userEmailProp={em}></Chatbot>):(<div></div>)}
      {this.state.showSageMaker=== true? (<SageMaker userEmailProp={em}></SageMaker>):(<div></div>)}
          </Row>
        </Container>
        </React.Fragment>
        );
     }
 };

 export default Home;
