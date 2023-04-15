import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function GLogin() {
  
  return (
    Auth.federatedSignIn({provider: 'Google'})
  );
}

export default GLogin;
