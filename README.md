# **SeerLogic Bot Admin UI**

- In order to view this file in "chrome" install the "Markdown Viewer" plugin

## **Setting up EsList**

1. Refer Youtube video: https://www.youtube.com/watch?v=o2H8kvuwMKE
2. Install Eslint globally using 'npm install eslint -g'
3. Next go to you project where you want eslint enabled and do 'eslint --init'
4. The above command will start a wizard. In the wizard choose "google" and "JSON" as the o/p format.
5. This will create **eslintrc.json**

## **Configure VsCode to follow EsLint formatting styles**

1. In VsCode make sure that you install "Prettier for Javascript" and "EsLint" plugins.
2. Next go to User->Preferences->Settings.
3. Make sure that you choose "edit json" and edit the "User Settings".
4. In the User Settings set the following:

```
   "eslint.enable": true,
    "prettier.eslintIntegration": true,
    "prettier.singleQuote": true
```

5. Next install the "Intellij" key bindings and perform "Cntrl+Alt+L" on linux to format the code.
6. Note that VsCode will look for eslint settings in **eslintrc.json** first and then use the global settings.

## **Use Express Application Generator to create app skeleton**

1. Refer: https://expressjs.com/en/starter/generator.html
2. Create your invidual projects using the above.
3. Below is the example o/p when I created an express project in an existing dir

```
bkane@bhushanhplinux:~/svn/code/angular/SeerlogicsBotAdminUI$ express --view=pug reference-ui
destination is not empty, continue? [y/N] y

   create : reference-ui/
   create : reference-ui/public/
   create : reference-ui/public/javascripts/
   create : reference-ui/public/images/
   create : reference-ui/public/stylesheets/
   create : reference-ui/public/stylesheets/style.css
   create : reference-ui/routes/
   create : reference-ui/routes/index.js
   create : reference-ui/routes/users.js
   create : reference-ui/views/
   create : reference-ui/views/error.pug
   create : reference-ui/views/index.pug
   create : reference-ui/views/layout.pug
   create : reference-ui/app.js
   create : reference-ui/package.json
   create : reference-ui/bin/
   create : reference-ui/bin/www

   change directory:
     $ cd reference-ui

   install dependencies:
     $ npm install

   run the app:
     $ DEBUG=reference-ui:* npm start
```

4. Note that you will need to remove the views/routes etc and adjust the www and app.js file per your needs.

## **Possible Error scenario**
1. Cross domain communication issue:
   ```
    Failed to execute 'postMessage' on 'DOMWindow': The target origin provided does not match the recipient window's origin
   ```
   To fix the above make sure that you set the "targetOrigin" to the target domain (ie domain of the Chat Client) when doing a "postMessage".
   See : https://www.codeproject.com/Questions/845454/Failed-to-execute-postMessage-on-DOMWindow-The-tar


## Git issues
1. In certain cases GIT does not save your username/pwd when you do a push or pull to a repository. And it keeps asking you for credentials. In order to avoid this situation run the following command in any GIT local repo:
```
git config --global credential.helper store
```
> So the next time you push or pull, your credentials will be saved.


