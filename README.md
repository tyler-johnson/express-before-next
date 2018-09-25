# Express Before Next

[![npm](https://img.shields.io/npm/v/express-before-next.svg)](https://www.npmjs.com/package/express-before-next) [![Build Status](https://travis-ci.org/tyler-johnson/express-before-next.svg?branch=master)](https://travis-ci.org/tyler-johnson/express-before-next)

Combining several Express apps and routers together is useful, but often changes to the request and response are leaked down the router chain. This plugin provides a small API for cleaning up when the `next()` method is called on the router.

## Install

```
npm install express-before-next
```

## Usage

Call `attachBeforeNext(router)` on any Express Router or Application instance. This will monkey patch the `.handle()` method on these objects. A `req.beforeNext()` is attached to the request, pass it functions to be called on clean up. Keep in mind this method are *only* called if next is called.

```js
const express = require("express");
const attachBeforeNext = require("express-before-next");

function createHomeRoute() {
  const router = express();
  attachBeforeNext(router);

  router.use(function(req, res, next) {
    // set state on the request that should be cleaned up
    req.locals.foo = "bar";

    // clean up state before going to the next router
    req.beforeNext(() => {
      delete req.locals.foo;
    });
  });

  router.get("/", function(req, res) {
    res.render("home");
  });

  return router;
}

const bigapp = express();
bigapp.use(createHomeRouter());
bigapp.use(otherRoutes());
```
