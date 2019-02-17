
## Amplify Setup

### `Initializing Amplify with amplify init`

STEPS : 

1) run : amplify init 
* this will give us a bunch of setup prompts. these are the settings we chose: 

	default code editor :  visual studio 
	app type : javascript
	framework : react
	source directory path :  src (default)
	distribution directory path : build (default)
	build command : yarn build (default is npm)
	start command : yarn start (default is npm)

2) do you want to setup AWS profile :  Y

3) enter the name :  default  (we just used the default value when we set it up)

4) It will go and do all the AWS magic and run a bunch of shit
✔ Successfully created initial AWS cloud resources for deployments.

Your project has been successfully initialized and connected to the cloud!

5) And you know if it really worked because you should have an ./amplify folder at root with config stuff in it + .amplifyrc file also at the root level

### `Setting up GraphQL api with authentication`

1) At the root of the project > in terminal > run the command in the Amplify CLI > amplify add api 
* this will give us a bunch of setup prompts. these are the settings we chose: 

	select mentioned service :  GraphQL 
	api name :  appname (default) 
	    — in case you have multiple apis running in the app, you can give each its own name
	choose authorization type :  Amazon Cognito User Pool 
		— the default is API KEY, but this is only for prototyping 
	do you want to use the default authentication and security configuration? : Yes, use the default 
		— there is an option to customize, but the default is highly recommended >> custom config is very time consuming

Successfully added auth resource
? Do you have an annotated GraphQL schema? (y/N) 

* NOTE :  after this step, you will see ./backend folder with a separate ./auth folder in the root ./amplify folder and in there you will see a ./cognito folder with the yml config files

### `The next steps are where we setup the GraphQL Schema`

2) THESE ARE THE STEPS : 

	Do you have an annotated GraphQL Schema? : N (Amplify will walk you through the setup)
	Do you wanted a guided schema creation :  Y 
		These will be the options you can choose from >> 
		* We will select the first option for this app 

  Single object with fields (e.g., “Todo” with ID, name, description) 
  One-to-many relationship (e.g., “Blogs” with “Posts” and “Comments”) 
  Objects with fine-grained access control (e.g., a project management app with owner-based authorization)

	Do you want to edit the schema :  Y  >>. 
	* THIS WILL NOW CREATE A DEFAULT OBJECT WE CAN CHANGE
 
Do you want to edit the schema now? Yes
Selected default editor not found in your machine. Please manually edit the file created at /directory/path/app/schema.graphql

THIS IS WHAT WILL COME OUT IN THE SCHEMA.GQL FILE : 

type Note @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  note: String!
}

#### `Note the @auth(rules: [{ allow: owner }]) part which is used for data owndership`

— WE COMPLETE THE PROCESS IN THE NEXT SECTION

### `Generating GraphQL api off the schema`

1) We will change the schema to fit our needs for the notetaker app : 

type Note @model {
  id: ID!
  note: String!
}

* NOTE : WE DONT NEED TO WRITE QUERIES OR MUTATIONS >> AMPLIFY WILL CREATE A CRUD API FOR US 

2) Hit enter in the CLI to continue — we should get a message saying that our api was successfully saved 

Press enter to continue 

GraphQL schema compiled successfully. Edit your schema at /path/directory/app/schema.graphql
Successfully added resource app locally

Some next steps:
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

3) We need to run the Amplify command to provision the resources from our local to the cloud 
Run the command :  amplify push 

| Category | Resource name    | Operation | Provider plugin   |
| -------- | ---------------- | --------- | ----------------- |
| Auth     |  <INFORMATION>   | Create    | awscloudformation |
| Api      |  <INFORMATION>   | Create    | awscloudformation |
? Are you sure you want to continue? Yes

GraphQL schema compiled successfully. Edit your schema at /directory/path/amplify/backend/api/app-name/schema.graphql

SHOWS US THAT THE AUTH WAS SETUP IN COGNITO ON AWS AS WELL AS OUR API IN APPSYNC

4) Next we set up the options for the auto code generation: 
THIS WILL RUN A FEW MINUTES AND GIVE US ALL THE FRONTEND/BACKEND GQL CODE WE NEED

GraphQL schema compiled successfully. Edit your schema at /directory/path/amplify/backend/api/app-name/schema.graphql
? Do you want to generate code for your newly created GraphQL API Yes
? Choose the code generation language target javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes

ONCE IT FINISHES : 

CREATE_COMPLETE apiamplifynotetaker AWS::CloudFormation::Stack Fri Feb 01 2019 17:48:56 GMT-0500 (Eastern Standard Time) 
⠼ Updating resources in the cloud. This may take a few minutes...

UPDATE_COMPLETE_CLEANUP_IN_PROGRESS <INFORMATION> AWS::CloudFormation::Stack Fri Feb 01 2019 17:48:58 GMT-0500 (Eastern Standard Time) 
UPDATE_COMPLETE                     <INFORMATION> AWS::CloudFormation::Stack Fri Feb 01 2019 17:48:59 GMT-0500 (Eastern Standard Time) 
✔ Generated GraphQL operations successfully and saved at src/graphql
✔ All resources are updated in the cloud

GraphQL endpoint: https://some-endppoint.appsync-api.us-east-2.amazonaws.com/graphql

CREATES A ./GRAPHQL FOLDER IN THE ./SRC FOLDER WITH QUERIES AND MUTATIONS : 

EXAMPLE MUTATIONS : 
```javascript
export const createNote = `mutation CreateNote($input: CreateNoteInput!) {
  createNote(input: $input) {
    id
    note
  }
}
`;
export const updateNote = `mutation UpdateNote($input: UpdateNoteInput!) {
  updateNote(input: $input) {
    id
    note
  }
}
`;
export const deleteNote = `mutation DeleteNote($input: DeleteNoteInput!) {
  deleteNote(input: $input) {
    id
    note
  }
}
`;
```
EXAMPLE QUERIES : 
```javascript
export const getNote = `query GetNote($id: ID!) {
  getNote(id: $id) {
    id
    note
  }
}
`;
export const listNotes = `query ListNotes(
  $filter: ModelNoteFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      note
    }
    nextToken
  }
}
`;
```
### `Configuring Amplify with React`

STEPS : 

1) install the necessary packages :  yarn add aws-amplify aws-amplify-react
* NOTE :  these libraries have modules that allow us to interact with our amplify resources like the api and auth

2) go to the index.js file at the root of the project and import the required packages to configure amplify

import Amplify from 'aws-amplify'
import aws_exports from './aws-exports'

3)  Call the configure method off of the Amplify package instance and pass it the file export from ./aws-exports.js

// TO CONFIGURE AMPLIFY IN THE INDEX FILE
Amplify.configure(aws_exports);

THAT ’S IT WE ARE DONE!!!

