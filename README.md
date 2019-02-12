# iterable-ndjson

> Takes an (async) iterable that yields ndjson and returns an async iterable that yields JS objects

## Install

```sh
npm install iterable-ndjson
```

## Usage

```js
const ndjson = require('iterable-ndjson')
const it = ndjson(source) // where `source` is any iterable that yields ndjson

for await (const obj of it)
  console.log(obj)
```

### Examples

Node.js streams are async iterable:

```js
const ndjson = require('iterable-ndjson')
const fs = require('fs')
const source = fs.createReadStream('/path/to/file.ndjson')

for await (const obj of ndjson(source))
  console.log(obj)
```

Async iterable:

```js
const ndjson = require('iterable-ndjson')

// An ndjson async iterator
const source = (() => {
  const array = ['{"id": 1}\n', '{"id"', ': 2}', '\n{"id": 3}\n']
  return {
    [Symbol.asyncIterator] () {
      return this
    },
    async next () {
      await new Promise(resolve => setTimeout(resolve))
      return array.length
        ? { done: false, value: array.shift() }
        : { done: true }
    }
  }
})()

async function main () {
  for await (const obj of ndjson(source))
    console.log(obj)
    // Logs out:
    // { id: 1 }
    // { id: 2 }
    // { id: 3 }
}

main()
```

Async iterable generator:

```js
const ndjson = require('iterable-ndjson')

// An ndjson async iterator
const source = (async function * () {
  const array = ['{"id": 1}\n', '{"id"', ': 2}', '\n{"id": 3}\n']
  for (let i = 0; i < array.length; i++) {
    yield new Promise(resolve => setTimeout(() => resolve(array[i])))
  }
})()

async function main () {
  for await (const obj of ndjson(source))
    console.log(obj)
    // Logs out:
    // { id: 1 }
    // { id: 2 }
    // { id: 3 }
}

main()
```

Regular iterable (like an array):

```js
const ndjson = require('iterable-ndjson')
const source = ['{"id": 1}\n', '{"id"', ': 2}', '\n{"id": 3}\n']

async function main () {
  for await (const obj of ndjson(source))
    console.log(obj)
    // Logs out:
    // { id: 1 }
    // { id: 2 }
    // { id: 3 }
}

main()
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/iterable-ndjson/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
