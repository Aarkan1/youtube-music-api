# About tests

## API test
If you want to run the API-test included here, you can open the node-music-web-api.postman_collection.json with [postman](https://www.postman.com/) and run the collection test. Or you can install [newman](https://www.npmjs.com/package/newman) and run it from command line, or as a git hook for continous integration testing.

### installing newman
$ npm install -g newman

### running the test with newman
$ newman run tests/node-music-web-api.postman_collection.json

