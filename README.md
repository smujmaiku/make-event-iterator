# Make Event Iterator

[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]

Do you have event emitters you are wrapping in a single promise?
Is the return from that process massive and causing memory issues?
Do you want an excuse to use [for await...of][for-await-of]?

Create an iterator from an event emitter!

## Installation

`npm i make-event-iterator`

## Usage

It is easier than saying, just supply the an event emitter to the package.

```js
const makeEventIterator = require('make-event-iterator');
for await(const chunk of makeEventIterator(eventEmitter)) {
    // ...
}
```

### http server

```js
const http = require('http');
const makeEventIterator = require('make-event-iterator');

async function handleHttp(req, res) {
    for await(const chunk of makeEventIterator(req)) {
        console.log('chunk:', chunk.length);
    }
    res.end();
}

const server = http.createServer(handleHttp);
server.listen(8000);
```

### readline

```js
const fs = require('fs');
const readline = require('readline');
const makeEventIterator = require('make-event-iterator');

const fileStream = fs.createReadStream('file.txt');
const rl = readline.createInterface({
    input: fileStream,
});

for await (const line of makeEventIterator(rl, makeEventIterator.READLINE)) {
    console.log('line:', line);
}
```

## License

Copyright (c) 2019, Michael Szmadzinski. (MIT License)

[travis-image]: https://travis-ci.org/smujmaiku/make-event-iterator.svg?branch=master
[travis-url]: https://travis-ci.org/smujmaiku/make-event-iterator
[codecov-image]: https://coveralls.io/repos/github/smujmaiku/make-event-iterator/badge.svg
[codecov-url]: https://coveralls.io/github/smujmaiku/make-event-iterator
[for-await-of]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
