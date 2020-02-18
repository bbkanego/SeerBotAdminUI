#bin/bash

cd ~/Bhushan/code/angular/Angular-Library-With-NgPackagr
npm run packagr
npm pack ./dist
cd ~/Bhushan/code/angular/SeerlogicsBotAdminUI/main-app
npm install ~/Bhushan/code/angular/Angular-Library-With-NgPackagr/my-component-library-0.0.0.tgz
