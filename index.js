const varint = require('varint')

module.exports = {
  encodingLength,
  encode,
  decode
}

encode.bytes = decode.bytes = 0

function encodingLength (f) {
  const [a, b] = fractionEncode(f)
  return varint.encodingLength(a) + varint.encodingLength(b)
}

function encode (f, buf, offset) {
  const [a, b] = fractionEncode(f)

  if (!offset) offset = 0
  if (!buf) buf = Buffer.allocUnsafe(varint.encodingLength(a) + varint.encodingLength(b))

  varint.encode(a, buf, offset)
  encode.bytes = varint.encode.bytes

  varint.encode(b, buf, offset + encode.bytes)
  encode.bytes += varint.encode.bytes

  return buf
}

function decode (buf, offset) {
  if (!offset) offset = 0
  const a = varint.decode(buf, offset)
  decode.bytes = varint.decode.bytes
  const b = varint.decode(buf, offset + varint.decode.bytes)
  decode.bytes += varint.decode.bytes
  return fractionDecode(a, b)
}

function count10s (n) {
  if (n === 0) return 0

  let m = 0
  while (Math.floor(n / 10) === n / 10) {
    m++
    n /= 10
  }

  return m
}

function fractionEncode (n) {
  const sign = n < 0 ? -1 : 1

  if (Math.floor(n) === n) {
    return sign < 0 ? [-10 * n, 1] : [n, 0]
  }

  n *= sign

  let m = 0

  const top = Math.floor(n)

  let digits = 0
  let f = 1
  while (10 * f * top < Number.MAX_SAFE_INTEGER && digits < 10) {
    digits++
    f *= 10
  }

  n -= top
  m = digits - count10s(Math.round(n * f))

  const pow = Math.pow(10, m)
  return [Math.round(top * pow + n * pow), zigzagEncode(sign * m)]
}

function fractionDecode (n, m) {
  m = zigzagDecode(m)
  const pow = m < 0 ? -Math.pow(10, -m) : Math.pow(10, m)
  return n / pow
}

function zigzagDecode (n) {
  return n === 0 ? n : (n & 1) === 0 ? n / 2 : -(n + 1) / 2
}

function zigzagEncode (n) {
  // 0, -1, 1, -2, 2, ...
  return n < 0 ? (2 * -n) - 1 : n === 0 ? 0 : 2 * n
}
