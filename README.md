# CMPE 281: Project2--Travel-O-Cloud

* University Name: [San Jose State University](http://www.sjsu.edu/)
* Course: [Cloud Technologies](https://catalog.sjsu.edu/preview_course_nopop.php?catoid=12&coid=58375)
* Professor: [Sanjay Garje](https://www.linkedin.com/in/sanjaygarje/)
* Students: [Archana Miyar Kamath](https://www.linkedin.com/in/archana-kamath-018/), [Simran Tanvir Memon](https://www.linkedin.com/in/simran-m-a872a91a1/), [Mounica Kamireddy](https://www.linkedin.com/in/mounica-kamireddy/), [Limeka Dabre](https://www.linkedin.com/in/limekadabre/)

## Project Introduction

Travel-O-Cloud is a one stop application targeted to help users plan their lovely trip with the help of features like booking a hotel, checking for weather conditions, helping them store their trip memories in the form of images. And all this by securely logging in to the application using AWS Login or by using social identity providers like Google or Facebook. Users will be able to check for the current weather in their choice of city and book a hotel using Chatbot for their stay. Users will be able to upload the pictures from the places that they have visited and store it safely, moreover, they can also share the pictures on Facebook and retrieve the pictures from their trip to obtain highlights of locations.

## Website [URL](https://travelocloud.com/)

## Demo [URL](https://drive.google.com/file/d/1t-V27WUZFQQ_2zbkTKyq8mQKsZ0SdGcK/view?usp=sharing)

## Architecture Diagram:

![arch_dgm](https://user-images.githubusercontent.com/27188674/143171709-b5908d34-5807-4cd7-ae68-62a6c4a51728.jpg)

## Requirements to run the project locally:

* A free tier AWS account with IAM user access.
* AWS Components required are as mentioned in the following section.
* Softwares Required: Node JS, React JS
* Clone this git repository using ```git clone https://github.com/archana-kamath/travel-o-cloud.git```
* Install backend dependencies at ```travel-o-cloud-backend/``` using ```npm install``` and add a ```.env``` file with IAM user Access ID and Secret key.
* Run ```node app.js``` and server starts running at default port.
* Install frontend dependencies at ```travel-o-cloud-frontend/``` using ```npm install```
* Run ```npm start``` and now the application starts running at ```localhost:3000```
* Note: Helper lambda functions can be used from ```AWS_Lambda_Code/```

## AWS Components Required:

* Route53: This application is hosted on web using Route53, a registered web domain provided by AWS. SSL Cerificate was enabled on this domain by obtaining it from Amazon                Certificate Manager.

* Elastic Beanstalk: Travel-O-Cloud was deployed using Elastic Beanstalk, a service to host web applications. It manages the web application by keeping track of important                         features such as load balancing, auto scaling, health monitoring etc. It comes with EC2 instances by default.

* Image Rekognition: This service is used in application to recognize the objects in the uploaded image which further helps to filter the images while searching. A lambda                          code hook gets enabled when user uploads images.

* Amplify: Amplify Auth helped us to achieve a secure authentication and authorization flow. With the help of Cognito as its main authentication provider, it enables in                  building a  robust user directory service that handles user registration, authentication, account verification and other operations.   

* Cognito: Cognito was used to authorize users by validating the token with the federated identity providers like Facebook and Google received upon login. It creates user                pools to store the registered and logged in users from both, amplify login as well as social providers login.

* API Gateway: This service is used to receive user details from the frontend and act as a integration endpoint for backend resource. It invokes the custom Lambda authorizer                 and passes the token for further validation.

* CloudFormation:  CloudFormation helped us in creating a template of all the resources and its properties generated via Amplify. 

* Lex: Using this conversational interface which is voice and text enabled. Amplify interactions which uses Lex was used to integrate chatbot into application to book hotels.        A lambda code hook helps in fulfilling the intent of users. 

* S3: S3 bucket was used to store the files in AWS where a life cycle policy was enabled for the bucket in such a way that the files exist in standard S3 for 75 days, then         moves to standard IA and stays there for 365 days and then moves to s3 glacier for another 365 days and finally gets deleted. Transfer acceleration was enabled to avoid       any delays due to internet routing and speed. Replica of the used bucket was configured in different region to enable disaster recovery.

* Cloud Front: Cloud front was enabled for S3 bucket and the files can be accessed and downloaded through lambda edge location. Cloud Front acts as a cache storage. Geo                      location restriction was enabled for restricted countries.

* Amazon Dynamo DB: A NoSQL DB used to store user details and corresponding image uploads. 

* Lambda: A lambda function which gets triggered once user uploads images to S3 bucket and sends emails to application owner. 

* SNS: A notification service which helps application owner to monitor and track users activity.

* Cloud Watch: A monitoring service to keep track of the health and utilization of resources.

* Sage Maker: A service used to build, train and deploy ML models. This application can be further enhanced to help users in recommending hotels based on location and                       customer reviews.

* Code Pipeline: A CI/CD service which enables continuous integration and delivery when ever a code commit occurs in github and gets uploaded to S3. An updated deployed version is delivered to Elastic bean stalk application.


## Application Screenshots:

* AWS Login/Signup:

<img width="1337" alt="web aws login" src="https://user-images.githubusercontent.com/27188674/143164299-0d6320a0-ba1c-4346-aed9-8beaf8b04f4f.png">

* Google Login:

![image](https://user-images.githubusercontent.com/27188674/143182922-d594a854-bf4a-4529-8ef1-aeab3dde8bf9.png)

* Facebook Login:

![FbLogin](https://user-images.githubusercontent.com/27188674/143182941-624eefd9-66f1-4351-ac91-1abd757730ef.PNG)

* Weather Page:

<img width="1281" alt="weather" src="https://user-images.githubusercontent.com/27188674/143172280-7a641670-87b0-4916-9c7f-6abceb8f0d7b.png">

* Upload Image Page:

<img width="1337" alt="Upload picture" src="https://user-images.githubusercontent.com/27188674/143172340-16657c06-0792-4f31-a9a9-4bd35097e088.png">

* FB Sharing:

![FbShare](https://user-images.githubusercontent.com/27188674/143172957-25e792ca-4684-473d-8e9e-d5467487f1dd.PNG)

* Search Image Page:

<img width="1424" alt="search picture" src="https://user-images.githubusercontent.com/27188674/143172533-df848c20-3e7b-4155-b534-c3317959d127.png">

* Chat Bot:

<img width="1440" alt="chat-voice" src="https://user-images.githubusercontent.com/27188674/143172762-e6abc7e9-2dd2-404c-aa8d-9260c1bf823d.png">

<img width="1316" alt="Chatbot" src="https://user-images.githubusercontent.com/27188674/143172809-72473e81-6d0e-43d9-82c3-a26347ea22a0.png">

* Hotel Recommendations:

![Hotel recommendations](https://user-images.githubusercontent.com/27188674/143172863-1401182b-f7b6-4486-8ec5-831be70f0567.PNG)





