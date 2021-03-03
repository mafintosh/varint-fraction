# varint-fraction

Small thing that encodes a fractional number into a two varints.

```
npm install varint-fraction
```

## Usage

``` js
const varintf = require('varint-fraction')

const buf = varintf.encode(0.42)

console.log(varintf.decode(buf)) // 0.42
```

## License

MIT
