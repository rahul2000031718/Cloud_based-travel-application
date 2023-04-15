import Amplify, { Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function FBLogin() {
  return (

    //<div className="App">
      //<button onClick={() => {
      //Auth.federatedSignIn({provider: 'Facebook'})
      //}}> Facebook Login </button>

      //Auth.federatedSignIn({provider: 'Facebook'})
    //</div>
      Auth.federatedSignIn({provider: 'Facebook',customState: JSON.stringify("/login")})
  );
}
export default FBLogin;
