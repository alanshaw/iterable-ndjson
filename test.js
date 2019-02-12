const test = require('ava')
const ndjson = require('.')

function toAsyncIterator (array) {
  return (async function * () {
    for (let i = 0; i < array.length; i++) {
      yield new Promise(resolve => setTimeout(() => resolve(array[i])))
    }
  })()
}

test('should split 1 item from 1 chunk', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n'])
  const results = []

  for await (const value of ndjson(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }])
})

test('should split 1 item from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id', '": 1 }\n'])
  const results = []

  for await (const value of ndjson(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }])
})

test('should split 2 items from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n', '{ "id": 2 }'])
  const results = []

  for await (const value of ndjson(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }, { id: 2 }])
})

test('should split 2 items from 1 chunk', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n{ "id": 2 }'])
  const results = []

  for await (const value of ndjson(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }, { id: 2 }])
})

test('should split 3 items from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n{ "i', 'd": 2 }', '\n{"id":3}'])
  const results = []

  for await (const value of ndjson(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }, { id: 2 }, { id: 3 }])
})
