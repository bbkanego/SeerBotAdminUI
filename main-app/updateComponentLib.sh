#bin/bash

cd ~/svn/code/angular/Angular-Library-With-NgPackagr
npm run packagr
npm pack ./dist
cd ~/svn/code/angular/SeerlogicsBotAdminUI/main-app
npm install ~/svn/code/angular/Angular-Library-With-NgPackagr/my-component-library-0.0.0.tgz
