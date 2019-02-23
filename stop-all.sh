#!/bin/bash

# (echo "starting the chat client";cd ../SeerlogicsChatClientUI;npm start > server.log 2>&1 &)
(echo "Stop the chat sdk";cd ../SeerlogicsBotAdminUI/chat-client-bootstrap;npm run stop)
(echo "Stop the reference UI";cd ../SeerlogicsBotAdminUI/reference-ui/;npm run stop)
(echo "Stop the mock-api";cd ../SeerlogicsBotAdminUI/mock-api/;npm run stop)
