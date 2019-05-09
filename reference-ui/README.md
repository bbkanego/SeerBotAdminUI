# **Reference UI Guide**

Reference UI is an example implementation which guides the customer on how to inlcude the Chatbot on their website and what kinds of configurations are allowed and can be done.

## **Components of Chatbot integration**

1. Merchant/Customers website home page
2. Chatbot bootstrap file
3. Chatbot client running on the cloud

## **How reference UI works**

1. Reference UI allows the customer to test out how to integrate Chatbot on their website.
2. The entry point for the reference point is the HTML page "reference-ui-chat-local.html". On this page the "bootstrap" file is included and the required configuration is provided.
3. You can start the demo/reference UI using the "/start-all.sh" in the root directory.

## **Chatbot initialization process**

**On the customers website home page**

1. The customer creates a absolute DIV with styles that we provide to them. This DIV needs to have a unique id.
2. The customer includes "seer-chat-bootstrap.js" in their HTML page. See the example URL when testing locally.

```
http://localhost:3003/load-chat/javascript/seer-chat-bootstrap.js
```

3. Next the customer defines config object:
   ```
   var SEER_CHAT_config = {
        targetDivId: 'chat-iframe-target',
        chatBotUrl: 'http://localhost:4320',
        chatWindowHeading: 'Test Window',
        chatButtonLabel: 'Talk To Us!',
        chatAPIUrl: '<Url to Chat API provided during setup>'
    }
   ```
   There are many options that can be provided, but the above is the minimum config options.
4. Next the customer calls : window.SEER_CHAT_BOOTSTRAP.initialize();
5. The "initialize" method inits the IFrame and sends postMessage ":initialize:".
6. The ":initialize:" method results in call to "getConfig" in the bootstrap JS.

## **How to use reference-ui for _local testing_.**

### **Understanding the configuration**

1. Refer the file

   ```
   ~/svn/code/angular/SeerlogicsBotAdminUI/reference-ui/public/html/reference-ui-chat-local.html
   ```

   - This HTML file mimics the customers website.
     On this page you will see the "seer-chat-bootstrap.min.js" file included, like so:

   ```
   <script src="http://localhost:3003/load-chat/javascript/seer-chat-bootstrap.min.js"></script>
   ```

   - You will also see "initialize" method called where we supply the sdkurl, targetDivId etc
   - You will see the following configuration supplied in the "initialize" function:

   ```
       <script>
       window.SEER_CHAT_BOOTSTRAP.initialize({
           targetDivId: 'chat-iframe-target',
           chatBotUrl: 'http://localhost:4320',
           chatWindowHeading: 'Test Window',
           chatButtonLabel: 'Talk To Us!',
           chatAPIUrl: 'http://localhost:8099/chatbot/api/chats'
       });
       </script>
   ```

### **Starting the Server (express based) and Chabotbot (Spring boot)**

1. First make sure chatbot service is running by running the Intellij config: SeerlogicsReferenceBot-local:8099

2. Start the chatbot angular client. Go to the dir:
   ```
   ~/svn/code/angular/SeerlogicsChatClientUI
   ```
3. Start the chat client

   ```
   npm run local
   ```

4. This will start the chat client at port 4320

5. Next make sure you build the latest bootstrap file using webpack and watch for any changes you make while its running using below

   ```
   cd ~/svn/code/angular/SeerlogicsBotAdminUI/chat-client-bootstrap
   npm run webpack-watch
   ```

6. Next we start all the other servers using

   ```
   ~/svn/code/angular/SeerlogicsBotAdminUI/start-all.sh
   ```

   once all the scripts start you can access the example UI using below link:

   ```
   http://localhost:3004/customer/html/reference-ui-chat-local.html
   ```

7. Using this set up you can debug issues with reference bot in intellij and fix those.
