Scorebored
==========

This is the start of Scorebored version 2! And it will do more than Pong.

Setup
-----

Install node.js

Install Grunt and Buster.JS globally:

```
sudo npm install --global grunt
sudo npm install --global buster
```

In the repository root, install necessary components:

```
npm install
```

Grunt Tasks
-----------

* lint: Runs the JavaScript linter (jslint)
* doc: Generates documentation (YUI Doc). Output is placed in build/doc

Test Suite
----------
PhantomJS for headless testing doesn't seem to work with the current code
base. Static web browser testing can be done with:

```
buster static
```

Navigate to the URL that Buster reports to run the tests. The server needs
to be restarted anytime a JavaScript file is added or removed.

