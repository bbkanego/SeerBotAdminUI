#!/bin/bash

# (echo "starting the chat client";cd ../SeerlogicsChatClientUI;npm start > server.log 2>&1 &)
(echo "starting the chat sdk";cd ../SeerlogicsBotAdminUI/chat-client-bootstrap;npm start > server.log 2>&1 &)
(echo "starting the reference UI";cd ../SeerlogicsBotAdminUI/reference-ui/;npm start > server.log 2>&1 &)
(echo "You can access the page at http://localhost:3004/customer/html/reference-ui-chat-local.html")