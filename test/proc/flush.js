import test from 'tape'
import { createStore, applyMiddleware } from 'redux'
import sagaMiddleware from '../../src'
import * as io from '../../src/effects'
import { channel, END } from '../../src/internal/channel'

test('proc flush handling', assert => {
  assert.plan(1)

  let actual = []

  const middleware = sagaMiddleware()
  createStore(() => ({}), {}, applyMiddleware(middleware))

  function* genFn() {
    const chan = yield io.call(channel)
    actual.push(yield io.flush(chan))
    yield io.put(chan, 1)
    yield io.put(chan, 2)
    yield io.put(chan, 3)
    actual.push(yield io.flush(chan))
    yield io.put(chan, 4)
    yield io.put(chan, 5)
    chan.close()
    actual.push(yield io.flush(chan))
    actual.push(yield io.flush(chan))
  }

  const task = middleware.run(genFn)

  const expected = [[], [1, 2, 3], [4, 5], END]

  task.done
    .then(() => {
      assert.deepEqual(actual, expected, 'proc must handle generator flushes')
      assert.end()
    })
    .catch(err => assert.fail(err))
})
