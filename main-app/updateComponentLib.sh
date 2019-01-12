#bin/bash

cd ~/svn/code/angular/my-component-library
npm run packagr
npm pack ./dist
cd ~/svn/code/angular/chat-admin
npm install ../my-component-library/my-component-library-0.0.0.tgz
