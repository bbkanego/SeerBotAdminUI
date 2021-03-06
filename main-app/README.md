# BotAdmin Application

This application allows customers to create, manage and analyze Bots on the demand. The various featues provided are:

1. Ability to create and train NLP models.
2. Create Bots for a specific industry like Banking, Auto Repair, Medical practice etc.
3. Deploy the bots on AWS, Azure and other cloud envrionments.
4. Deploy bots to DEV,QA,Staging and PROD etc.
5. Integrate bots with Alexa and Google Home.
6. Analyze Bot performance and perform automatic training of bots based on Hits and Misses of utterances.
7. Create user action workflows using graphical tool to design and handle complex converations.

## Running the Bot Admin in different Enviornments:

For any application the ability to run in multiple environments is paramount. Chatbot can currently run in different environments. The supported environments are:
1. Dev environment
```
/environments/environment.dev.ts
```
2. Mock environment
```
/environments/environment.mock.ts
```
3. Production environment
```
/environments/environment.prod.ts
```

The above mapping of environment files to various environments is configured in ".angular-cli.json". See the "environments" section.

In order to run the chatbot bot locally with a specific environment use the below command:
```
$> ng serve --env=<envName> (eg: ng serve --env=mock)
```

NPM Shortcuts have been provided in the "package.json" and the app can run using those short cuts. See below for examples:
```
$> cd ~/Bhushan/code/angular/SeerlogicsBotAdminUI/main-app
$> npm run local // same as running ng serve --env=local
$> npm run dev // same ng serve --env=dev
$> npm run mock // same ng serve --env=mock
```

To build an application for different environments use the below command:
```
$> ng build --prod --env=<envName> (eg: ng build --prod --env=dev)
```

Refer the [Environments in Angular 5](https://medium.com/@onlyyprasanth/how-to-manage-multiple-environments-with-angular-cli-angular-2-to-5-aa68d557fa77) article for more info.

# Start the Java/Spring boot application
1. Open the SeerlogicsBotAdmin project in the Intellij.
2. Open the "Run Configurations" "BotAdminApplication-ec2:8091" or "BotAdminApplication-local:8091" and start the server.

# How the App Works

1. When the user hits to index URL ie http://localhost:4300 the app tries to load the dashbaord. But before doing so the "AuthGuard" kicks in and check if the user is logged in or not. If not loggged in the user is forwarded to the '/login' URL.
   
2. When the customer logs in, a JWT token is created and is returned back to the UI. This JWT token is saved in the browser's "session" storage. For each subsequent request thats made the JWT is sent as a "Bearer" token in the "Authorization" header.

# H2 Database useful commands

Drop Unique index. Normally "index" is associated with a contraint. You need to drop the index.
```
ALTER TABLE INTENT DROP CONSTRAINT UNQ_INTENT_PER_ACCOUNT;
```
