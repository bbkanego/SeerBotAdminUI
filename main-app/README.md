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
ng serve --env=<envName> (eg: ng serve --env=mock)
```

To build an application for different environments use the below command:
```
ng build --prod --env=<envName> (eg: ng build --prod --env=dev)
```

Refer the [Environments in Angular 5](https://medium.com/@onlyyprasanth/how-to-manage-multiple-environments-with-angular-cli-angular-2-to-5-aa68d557fa77) article for more info.

# How the App Works

1. When the user hits to index URL ie http://localhost:4300 the app tries to load the dashbaord. But before doing so the "AuthGuard" kicks in and check if the user is logged in or not. If not loggged in the user is forwarded to the '/login' URL.