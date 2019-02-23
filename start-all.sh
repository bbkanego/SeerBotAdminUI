#!/bin/bash

# (echo "starting the chat client";cd ../SeerlogicsChatClientUI;npm start > server.log 2>&1 &)
(echo "starting the chat sdk: port-3003";cd ../SeerlogicsBotAdminUI/chat-client-bootstrap;npm start > server.log 2>&1 &)
(echo "starting the reference UI: port-3004";cd ../SeerlogicsBotAdminUI/reference-ui/;npm start > server.log 2>&1 &)
(echo "starting the mock api: port-3005";cd ../SeerlogicsBotAdminUI/mock-api/;npm start > server.log 2>&1 &)
(echo "You can access the page at http://localhost:3004/customer/html/reference-ui-chat-local.html")