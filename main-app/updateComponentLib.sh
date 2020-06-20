#!/usr/bin/env bash

cd ~/Bhushan/code/angular/Angular-Library-With-NgPackagr
echo '---------------------- Build the library'
ng build seerlogics-ngui-components

echo '---------------------- Create a TAR file'
npm pack ./dist/seerlogics-ngui-components

cd ~/Bhushan/code/angular/SeerlogicsBotAdminUI/main-app/
cp ~/Bhushan/code/angular/Angular-Library-With-NgPackagr/seerlogics-ngui-components-1.0.0.tgz .

echo '---------------------- Install the library for testing'
npm install ./seerlogics-ngui-components-1.0.0.tgz --save
