# MOCK API

## How to run mock-api

```
http://localhost:3005/mock/chats/initiate
```

## Possible Error Scenarios:

1. You might see the below error when running mock-api express server using "npm run start"
   
```
> reference-ui@1.1.0-SNAPSHOT start /home/bkane/svn/code/angular/SeerlogicsBotAdminUI/mock-api
> node ./bin/www

/home/bkane/svn/code/angular/SeerlogicsBotAdminUI/mock-api/node_modules/express/lib/router/index.js:458
      throw new TypeError('Router.use() requires a middleware function but got a ' + gettype(fn))
      ^

TypeError: Router.use() requires a middleware function but got a Object
    at Function.use (/home/bkane/svn/code/angular/SeerlogicsBotAdminUI/mock-api/node_modules/express/lib/router/index.js:458:13)
``` 

The above means that in one of your router files, you are missing:
```
module.exports = router;
```



