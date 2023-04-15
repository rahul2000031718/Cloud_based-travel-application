import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Home from './Home';
import { Auth } from 'aws-amplify';

Amplify.configure(awsconfig);

const AWSLogin = () => (
  <div>
    <Home></Home>
  </div>
);

export default withAuthenticator(AWSLogin);
