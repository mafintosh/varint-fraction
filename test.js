const tape = require('tape')
const varintf = require('./')

tape('basic', function (t) {
  const l = varintf.encodingLength(0.424)
  const b = varintf.encode(0.424)

  t.same(l, 3)
  t.same(varintf.encode.bytes, 3)
  t.same(varintf.decode(b), 0.424)
  t.same(varintf.decode.bytes, 3)
  t.end()
})

tape('random floats', function (t) {
  for (let i = 0; i < 1e6; i++) {
    const r = Math.round(1e10 * Math.random()) / 1e10
    const n = varintf.decode(varintf.encode(r))

    if (r !== n) {
      t.fail('bad float ' + r + ' vs ' + n)
      t.end()
      return
    }
  }

  t.pass('all random floats passed')
  t.end()
})
