
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
1. The customer creates a absolute DIV with styles that we provide to them. This DIV needs to have an id.
2. The customer includes "seer-chat-bootstrap.js" in their HTML page. See the example URL when testing locally.
```
http://localhost:3003/load-chat/javascript/seer-chat-bootstrap.js
```
3. Next the customer defines config object:
   ```
   var SEER_CHAT_config = {
        targetDivId: 'chat-iframe-target',
        sdkUrl: 'http://localhost:4320/'
    }
   ```
   There are many options that can be provided, but the above is the minimum config options.
4. Next the customer calls : window.SEER_CHAT_BOOTSTRAP.initialize();
5. The "initialize" method inits the IFrame and sends postMessage ":initialize:".
6. The ":initialize:" method results in call to "getConfig" in the bootstrap JS.

## **How to use reference-ui for local testing.**
1. Refer the file
   ```
   ~/svn/code/angular/SeerlogicsBotAdminUI/reference-ui/public/html/reference-ui-chat-local.html
   ```   
    * This HTML file mimics the customers website.
   On this page you will see the "seer-chat-bootstrap.min.js" file included.
    * You will also see "initialize" method called where we supply the sdkurl, targetDivId etc
2. Next we start all the servers using 
   ```
   ~/svn/code/angular/SeerlogicsBotAdminUI/start-all.sh
   ```
   once all the scripts start you can access the example UI using below link:
   ```
   http://localhost:3004/customer/html/reference-ui-chat-local.html
   ```
3. Start the chatbot. Go to the dir:
    ```
    ~/svn/code/angular/SeerlogicsChatClientUI
    ```
4. Start the chat client
    ```
    npm run local
    ```

3. This will start the chat client at port 4320
   
4. Also make sure that chatbot MS is running by running the Intellij config: SeerlogicsReferenceBot:8099
5. Using this set up you can debug issues with reference bot in intellij and fix those.
