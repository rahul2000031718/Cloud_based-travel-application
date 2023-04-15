import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import { ChatBot , AmplifyTheme} from 'aws-amplify-react';

const myTheme = {
    ...AmplifyTheme,
    sectionHeader: {
      ...AmplifyTheme.sectionHeader,
      backgroundColor: 'black'
    }
  };
  
  Amplify.configure({
    Auth: {
      identityPoolId: 'us-west-2:51951696-4a2d-4bf6-a989-dde61459e921',
      region: 'us-west-2'
    },
    Interactions: {
      bots: {
        "BookTrip_chatbot": {
            "name": "BookTrip_chatbot",
            "alias": "$LATEST",
            "region": "us-west-2"
        },
      }
    }
  });
  
  class Chatbot extends Component {
    constructor(props){
        super(props);
        this.state={
            on:false,
        }
      this.toggle = this.toggle.bind(this);
    }
    

    toggle=()=>{
        this.setState({
            on:!this.state.on
        })
    }

    handleComplete(err, confirmation) {
      if (err) {
        return 'Okay, Your reservation has been cancelled!!';
      }
      return 'Booking Confirmed. Thank you! Have a great day!!';
    }
  
    render() {
      return (
        <div>
            {
                this.state.on && (
                    <ChatBot
                        title="Need help with booking?"
                        theme={myTheme}
                        botName="BookTrip_chatbot"
                        welcomeMessage="Welcome, how can I help you today?"
                        onComplete={this.handleComplete.bind(this)}
                        voiceEnabled={true}
                        clearOnComplete={true}
                    />
                )
            }
           <div className="col d-flex justify-content-center">
                <button type="button" className="btn btn-dark" onClick={this.toggle}>{this.state.on?'Close':'Chat Bot'}</button>   
            </div>
        </div>
      );
    }
  }
  
  export default Chatbot;