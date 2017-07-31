# Code Challenge

This is Node.js app for shortened url.

  - Node 7.8
  - MongoDB
  - ES6
  - jQuery
  - HTML5
  - CSS3

## Installation

This app requires [Node.js](https://nodejs.org/) v7+ and MongoDB to run.

### Installing MongoDB

```
brew update
brew install mongodb
```

The default directory that mongod uses is /data/db, so lets go ahead and create that:

```
mkdir -p /data/db
```

We can now start up our MongoDB database by typing:

```
mongod
```

Afte installing of MongoDB you should install the dependencies and devDependencies and start the server.

```
$ npm install
$ node --harmony_async_await app.js
```

You can see the running app from the browser by typing:
```
http://localhost:3000/
```

License
----
MIT
