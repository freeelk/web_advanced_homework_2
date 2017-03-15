(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/base64-js/lib/b64.js","/../../node_modules/base64-js/lib")
},{"buffer":2,"rH1JPG":4}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/buffer/index.js","/../../node_modules/buffer")
},{"base64-js":1,"buffer":2,"ieee754":3,"rH1JPG":4}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")
},{"buffer":2,"rH1JPG":4}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/process/browser.js","/../../node_modules/process")
},{"buffer":2,"rH1JPG":4}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';




var scrollMenu = (function () {
    var $news = $('.news'),
        $item = $('.blog__menu-item'),
        $itemSlide = $('.blog__menu-item'),
        $wrapMenu = $('.blog__wrap-menu'),
        body = document.body,
        isPositionArticle = [],
        offsetHeight = 200,

        positionArticle = function (element) {
            var len = element.length;
            for (let i = 0; i < len; i++) {
                isPositionArticle[i] = {};
                isPositionArticle[i].top = element
                        .eq(i)
                        .offset()
                        .top - offsetHeight;
                isPositionArticle[i].bottom = isPositionArticle[i].top + element
                        .eq(i)
                        .innerHeight();
            }
        },

        scrollPageFixMenu = function (e) {
            var scroll = window.pageYOffset;
            if (scroll < $news.offset().top) {
                $wrapMenu.removeClass('fixed');
            } else {
                $wrapMenu.addClass('fixed');
            }
        },

        scrollPage = function (e) {
            var scroll = window.pageYOffset;
            for (let i = 0; i < isPositionArticle.length; i++) {
                if (scroll >= isPositionArticle[i].top && scroll <= isPositionArticle[i].bottom) {
                    $('.slide__menu-item')
                        .eq(i)
                        .addClass('blog__menu-item_slide-menu_selected')
                        .siblings()
                        .removeClass('blog__menu-item_slide-menu_selected');
                    $item
                        .eq(i)
                        .addClass('blog__menu-item_selected')
                        .siblings()
                        .removeClass('blog__menu-item_selected');
                    //console.log(i);
                }
            }
        },

        clickOnMenu = function (e) {
            var index = $(e.target).index();
            var sectionOffset = $news
                .eq(index)
                .offset()
                .top;
            $(document).off('scroll', scrollPage);
            $('body, html').animate({
                'scrollTop': sectionOffset
            }, function () {
                $(e.target)
                    .addClass('blog__menu-item_selected')
                    .siblings()
                    .removeClass('blog__menu-item_selected');
                $(document).on('scroll', scrollPage);
            });
        },

        addListener = function () {
            $('.blog__menu').on('click', clickOnMenu);

            $(document).on('scroll', scrollPage);
            $(document).on('scroll', scrollPageFixMenu);

            $(window).on('load', function (e) {
                positionArticle($news);
            })

            $(window).on('resize', function (e) {
                positionArticle($news);
            })
        }

    return {
        init: addListener
    }
})();

module.exports =  scrollMenu;


}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/blog_menu.js","/")
},{"buffer":2,"rH1JPG":4}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

class Blur {
    constructor(wrapper, formBlur, posTop) {
        this.wrapper = wrapper;
        this.formBlur = formBlur;
        this.posTop = posTop;
    }

    start() {
        if (this.wrapper && this.formBlur) {
            let that = this;

            window.addEventListener('load', function(){
                that.set();
            });

            window.addEventListener('resize', function(){
                that.set();
            });
        }
    }

    set() {
        let posLeft = - this.wrapper.offsetLeft,
            posTop =  - this.posTop,
            blurCss = this.formBlur.style;

            blurCss.backgroundPosition = posLeft + 'px ' + posTop + 'px';
    }
}


module.exports = Blur;
/*

var blur = (function () {
    var wrapper = document.querySelector('.connect-me');
    var form = document.querySelector('.connect-me__blur');

    return {
        set: function() {
            var posLeft = -wrapper.offsetLeft;
            var posTop =  -625;
            var blurCss = form.style;

            blurCss.backgroundPosition = posLeft + 'px ' + posTop + 'px';
        }
    }
}());


window.addEventListener('load', function(){
    blur.set();
});


window.onresize = function() {
        blur.set();
    }*!/
*/

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/blur.js","/")
},{"buffer":2,"rH1JPG":4}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

var initMap = require('./google_map');
var flipGreetingBox = require('./flip_box');
var ParallaxScroll = require('./parallax_scroll');
var ParallaxMouse = require('./parallax_mouse');
var Blur = require('./blur');
var Preloader = require('./preloader');
var scrollMenu = require('./blog_menu');
var WorksSlider = require('./works_slider');

var preloader = new Preloader(document.getElementById('parallax'), document.getElementById('preloader'), document.getElementById('preloader-percents'));
preloader.init();

/**
 * Карта Google на странице About
 */
initMap();

/**
 *  Переключение Flip-бокса на индексной странице
 */
flipGreetingBox(document.getElementById("greeting-flip"), document.getElementById('greeting__athorizate'));
flipGreetingBox(document.getElementById("greeting-flip"), document.getElementById('to-index-page'));

/**
 * Форма авторизации
 */
/*
$( "#authorization" ).submit(function( event ) {
    if ( !($("#no_robot").prop( "checked" ) &&  ($('input[name=no_robot_radio]:checked', '#authorization').val() == 1))) {
        $("#validation-message").text(' Роботы нам не нужны');
    } else {
        $("#validation-message").text('Верю, что человек. Сабмит реализую позже');
    };

    event.preventDefault();
});
*/

$("#authorization").submit(prepareAuth);
/*
const  formLogin = $("#authorization");
if (formLogin) {
    formLogin.addEventListener('submit', prepareAuth);
}*/

function prepareAuth(e) {
    e.preventDefault();

    var resultContainer = $('#validation-message');

    if (!($("#no_robot").prop("checked") && $('input[name=no_robot_radio]:checked', '#authorization').val() == 1)) {
        $(resultContainer).text(' Роботы нам не нужны');
        return;
    };

    var data = {
        login: this.login.value,
        password: this.password.value
    };

    //console.log(data);
    $(resultContainer).text('Sending...');
    sendAjaxJson('/login', data, function (data) {
        $(resultContainer).text(data);
    });
}

/**
 * Форма отправки сообщения
 */

var formMail = document.querySelector('#connect-me-form');

if (formMail) {
    formMail.addEventListener('submit', prepareSendMail);
}

function prepareSendMail(e) {
    e.preventDefault();
    var resultContainer = document.querySelector('#validation-message');
    var data = {
        name: formMail.name.value,
        email: formMail.email.value,
        text: formMail.message.value
    };
    resultContainer.innerHTML = 'Sending...';
    sendMailData('/contact', data, function (data) {
        resultContainer.innerHTML = data;
    });
}

function sendMailData(url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        var result = JSON.parse(xhr.responseText);
        cb(result.status);
    };
    xhr.send(JSON.stringify(data));
}

/**
 * Параллакс по прокрутке страницы
 *
 * @type {parallaxScroll}
 */
var parallaxScroll = new ParallaxScroll(document.querySelector('.hero__bg-img'), document.querySelector('.hero-title-pic'), document.querySelector('.hero__author-container'));
parallaxScroll.start();

/**
 * Параллакс по движению мышки
 *
 * @type {parallaxMouse}
 */
var parallaxMouse = new ParallaxMouse(document.getElementById('parallax'));
parallaxMouse.start();

var wrapper = document.querySelector('.connect-me');
var form = document.querySelector('.connect-me__blur');
var blur = new Blur(wrapper, form, 625);
blur.start();

/**
 *  Скролл меню на странице блога
 */

if ($('.news').length > 0 && $('.blog__menu-item').length > 0 && $('.blog__wrap-menu').length > 0) {
    scrollMenu.init();
}

var data = [{
    title: 'Пример сайта  1',
    skills: 'html, css, javascript',
    link: 'http://site1.com',
    preview: '1.png'
}, {
    title: 'Сайт 2. Пример',
    skills: 'html, css, javascript, jQuery',
    link: 'http://site2.com',
    preview: '2.png'
}, {
    title: 'Сайт 3 Еще один пример',
    skills: 'Angular2',
    link: 'http://site3.com',
    preview: '3.png'
}, {
    title: 'Сайт 4 Четрвертый сайт',
    skills: 'php, Yii2',
    link: 'http://site4.com',
    preview: '4.png'
}];

var templateElements = {
    title: document.getElementById('slider-title'),
    skills: document.getElementById('slider-skills'),
    link: document.getElementById('slider-link'),
    preview: document.getElementById('slider-preview'),
    prev: document.getElementById('slider-prev'),
    next: document.getElementById('slider-next')

};

/**
 * Слайдер сайтов на странице Works
 * Получаем данные о работах по запросу /worklist
 *
 */
window.addEventListener('load', function () {
    $.getJSON("/workslist", function (data) {
        var sliderGoUp = document.getElementById('slider__go-up');
        var sliderGoDown = document.getElementById('slider__go-down');

        if (sliderGoUp && sliderGoDown) {
            var worksSlider = new WorksSlider(data.works, templateElements);
            worksSlider.init();
            document.getElementById('slider__go-up').addEventListener("click", function () {
                return worksSlider.next();
            });
            document.getElementById('slider__go-down').addEventListener("click", function () {
                return worksSlider.next();
            });
        }
    });
});

/**
* Hamburger button transform
* @type {Element}
*/

var heroHamburger = document.getElementById("hero-hamburger");
var overlay = document.getElementById("overlay");
if (heroHamburger) {
    heroHamburger.addEventListener("click", function () {
        this.classList.toggle('hamburger_active');
        overlay.classList.toggle('open');
    });
}

var slideMenu = document.getElementById("slide-menu");
if (slideMenu) {
    slideMenu.addEventListener("click", function () {
        return slideMenu.classList.toggle('slide-menu_collapse');
    });
}

/**
 * Табы в админке
 */

$('.admin__tabs-controls-link').on('click', function (e) {
    e.preventDefault();

    var item = $(this).closest('.admin__tabs-controls-item');

    var contentItem = $('.admin__tabs-item');
    var itemPosition = item.index();

    contentItem.eq(itemPosition).addClass('admin__tabs-item_active').siblings().removeClass('admin__tabs-item_active');

    item.addClass('admin__tabs-controls-item_active').siblings().removeClass('admin__tabs-controls-item_active');
});

$('.admin-tabs__file-input').each(function () {
    var $input = $(this),
        $label = $input.next('label'),
        labelVal = $label.html();

    $input.on('change', function (e) {
        var fileName = '';

        if (e.target.value) fileName = e.target.value.split('\\').pop();
        console.log(fileName);

        if (fileName) $label.html(fileName);else $label.html(labelVal);
    });

    // Firefox bug fix
    $input.on('focus', function () {
        $input.addClass('has-focus');
    }).on('blur', function () {
        $input.removeClass('has-focus');
    });
});

function sendAjaxJson(url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        var result = JSON.parse(xhr.responseText);
        cb(result.status);
    };
    xhr.send(JSON.stringify(data));
}

/**
 * Skills
 */
var formSkills = document.querySelector('#admin-skills');

if (formSkills) {
    formSkills.addEventListener('submit', prepareSendPostSkills);
}

function prepareSendPostSkills(e) {
    e.preventDefault();

    var resultContainer = document.querySelector('.admin-tab__skills-status');
    var skillsGroups = $('.admin-tabs__skills');

    var data = [];
    $.each(skillsGroups, function (index, value) {
        var dataItem = {};
        dataItem.id = $(value).data('id');

        var skillsList = $('.admin-tabs__skill-row', value);
        var skills = {};
        $.each(skillsList, function (index, value) {
            var input = $('.admin-tabs__text-input', value);
            var inputName = $(input).attr('name');
            var inputValue = $(input).val();
            skills[inputName] = inputValue;
        });

        dataItem.skills = skills;
        data.push(dataItem);
    });

    resultContainer.innerHTML = 'Sending...';
    sendAjaxJson('/setskills', data, function (data) {
        resultContainer.innerHTML = data;
    });
}

/**
 * Blog
 */
var formBlog = document.querySelector('#admin-blog');

if (formBlog) {
    formBlog.addEventListener('submit', prepareSendPostBlog);
}

function prepareSendPostBlog(e) {
    e.preventDefault();

    var resultContainer = document.querySelector('.admin-tab__blog-status');
    var data = {
        title: document.getElementById('blog-item-name').value,
        date: document.getElementById('blog-item-date').value,
        text: document.getElementById('blog-item-text').value
    };
    resultContainer.innerHTML = 'Sending...';
    sendAjaxJson('/addpost', data, function (data) {
        resultContainer.innerHTML = data;
        document.querySelector('#admin-blog').reset();
    });
}

/**
 *  Загрузка картинок
 */

var formUpload = document.querySelector('#admin-works');

function fileUpload(url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.onload = function (e) {
        var result = JSON.parse(xhr.responseText);
        cb(result.status);
    };

    xhr.send(data);
}

function prepareSendFile(e) {
    e.preventDefault();
    var resultContainer = document.querySelector('.admin-tab__works-status');
    var formData = new FormData();
    var file = document.querySelector('#works-image-upload').files[0];
    var title = document.querySelector('#works-title').value;

    var skills = document.querySelector('#works-skills').value;

    var link = document.querySelector('#works-link').value;

    formData.append('photo', file, file.name);
    formData.append('title', title);
    formData.append('skills', skills);
    formData.append('link', link);

    resultContainer.innerHTML = 'Uploading...';
    fileUpload('/upload', formData, function (data) {
        resultContainer.innerHTML = data;
        document.querySelector('#admin-works').reset();
        $('.admin__tabs__file-input-label').text('Загрузить картинку');
    });
}

if (formUpload) {
    formUpload.addEventListener('submit', prepareSendFile);
}
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_7b0f1f99.js","/")
},{"./blog_menu":5,"./blur":6,"./flip_box":8,"./google_map":9,"./parallax_mouse":10,"./parallax_scroll":11,"./preloader":12,"./works_slider":14,"buffer":2,"rH1JPG":4}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

function flipBox(flipBox, authorizateBtn) {
    if (flipBox && authorizateBtn) {
        authorizateBtn.addEventListener('click', function () {
            flipBox.classList.toggle('hover');
        });
    }
}

module.exports = flipBox;
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/flip_box.js","/")
},{"buffer":2,"rH1JPG":4}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

/**
 * Google map
 */
function initMap() {
    var markerPos = {lat: 50.479144, lng: 34.965221};
    var center = {lat: 47.589144, lng: 28.965221};
    var mapContainer =document.getElementById('map');

    if (!mapContainer) {
        return;
    }

    var map = new google.maps.Map(mapContainer, {
        zoom: 6,
        center: center,
        disableDefaultUI: true,
        scrollwheel: false,
        styles: [{"stylers":[{"hue":"#61dac9"},{"saturation":3}]},{"featureType":"water","stylers":[{"color":"#61dac9"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},
            {featureType:"administrative",elementType:"labels",stylers:[{visibility:"on"}]},{featureType:"road",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]}]
    });
    var marker = new google.maps.Marker({
        position: markerPos,
        map: map,
        icon: "/assets/img/icons/map_marker.png"
    });
}

module.exports = initMap;
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/google_map.js","/")
},{"buffer":2,"rH1JPG":4}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

class ParallaxMouse {

    constructor( parallaxContainer ) {
        this.parallaxContainer = parallaxContainer;
    }

    start() {
        if (this.parallaxContainer) {
            let layers = this.parallaxContainer.children;

            window.addEventListener('mousemove', function (e) {
                let pageX = e.pageX,
                    pageY = e.pageY,
                    initialX = (window.innerWidth /2) - pageX,
                    initialY = (window.innerHeight /2) - pageY;

                Array.from(layers).forEach(function(layer, i) {
                    let divider = i / 100,
                        positionX = initialX * divider,
                        positionY = initialY * divider;

                    layer.style.transform = 'translate3d(' + positionX +'px, ' + positionY +'px, 0)';
                });
            });
        }

    }
}

module.exports = ParallaxMouse;
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/parallax_mouse.js","/")
},{"buffer":2,"rH1JPG":4}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

class ParallaxScroll {

    constructor( bg, user, sectionText ) {
        this.bg = bg;
        this.user = user;
        this.sectionText = sectionText;
    }

    start() {
        if (this.bg && this.user && this.sectionText) {
            let that = this;

            window.addEventListener('scroll', function () {
                let wScroll = window.pageYOffset;
                that.move(that.bg, wScroll, 45);
                that.move(that.sectionText, wScroll, 20);
                that.move(that.user, wScroll, 3);
            });
        }
    }

    move(block, windowScroll, strafeAmount) {
        var strafe = windowScroll / - strafeAmount-50 + '%';
        var transformString = 'translate3d(-50%, ' + strafe + ', 0)';
        var style = block.style;

        style.transform = transformString;
    }

}

module.exports = ParallaxScroll;
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/parallax_scroll.js","/")
},{"buffer":2,"rH1JPG":4}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

class Image {
    constructor(element, progress) {
        this.element = element;
        this.imageSrc = element.src;
        this.element.src = '';
        this.progress = progress;
    }

    load() {
        let that = this;
        return new Promise(function(resolve,reject) {
            that.element.src = that.imageSrc;
            that.element.onload = function() {
                that.progress.increment();
                resolve(that.element);
            };
            that.element.onerror = function(e) {
                that.progress.increment();
                resolve(that.element); // Даже если не получилось загрузить, все равно продолжаем
            };
        })
    }
}

class Progress {
    constructor(imagesCount, preloader, preloaderPercents) {
        this.preloaderPercents = preloaderPercents;
        this.imagesCount = imagesCount;
        this.loadedCount = 0;
        this.preloader = preloader;
    }

    increment() {
        this.loadedCount++;
        this.showPercent();
        if (this.loadedCount == this.imagesCount) {
            this.hidePreloader();
        }
    }

    showPercent() {
        let percent = Math.ceil(this.loadedCount / this.imagesCount * 100);
        this.preloaderPercents.innerText = percent + '%';
    }

    hidePreloader() {
        setTimeout(()=> this.preloader.classList.toggle('hidden'), 300);
    }
}

class Preloader {

    constructor(imagesContainer, preloader, preloaderPercents) {
        if (imagesContainer && preloader, preloaderPercents) {
            let imgElems = Array.prototype.slice.call(imagesContainer.getElementsByTagName('img'));
            this.progress = new Progress(imgElems.length, preloader, preloaderPercents);

            this.images = [];
            imgElems.forEach(imageElem => this.images.push(new Image(imageElem, this.progress)));
        }
    }

    // Придумал загружать картинки последовательно, чтоб красивее отображались проценты,
    // хотя реально это будет дольше
    loadImages() {
        let images = this.images;
        let promise = images[0].load();

        for (let i= 1; i < images.length; i++) {
            promise = promise.then(() => {
                return images[i].load();
            });
        }
    }

    init() {
        if (this.images) {
            this.loadImages();
        }
    }
}

module.exports =  Preloader;
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/preloader.js","/")
},{"buffer":2,"rH1JPG":4}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by freeelk on 05.03.17.
 */


var aviatitle = {
    generate: function (string, blockId) {
        var wordsArray = string.split(' '),
            stringArray = string.split(''),
            sentence = [],
            word = '';

        var block = $('#'+ blockId);

        block.text('');

        wordsArray.forEach(function (currentWord) {
            var wordsArray = currentWord.split('');

            wordsArray.forEach(function (letter) {
                var letterHtml = '<span class="letter-span">' + letter + '</span>';

                word += letterHtml;
            });

            var wordHTML = '<span class="letter-word">' + word + '</span>'

            sentence.push(wordHTML);
            word = '';
        });

        block.append(sentence.join(' '));

        // анимация появления
        var letters = block.find('.letter-span'),
            counter = 0,
            timer,
            duration = 500 / stringArray.length;

        function showLetters() {
            var currentLetter = letters.eq(counter);

            currentLetter.addClass('active');
            counter++;

            if (typeof timer !== 'undefined') {
                clearTimeout(timer);
            }

            timer = setTimeout(showLetters, duration);
        }

        showLetters();

    }
}

module.exports = aviatitle;
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/text_animation.js","/")
},{"buffer":2,"rH1JPG":4}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by freeelk on 05.03.17.
 */

'use strict';

var textAnimation = require('./text_animation');

const PATH_TO_PREVIEWS = '/assets/img/content/slider/';

class SlideButton {
    constructor(currentImgSrc, cssClasses) {
        this.cssClasses = cssClasses;

        let image = this.getElementByClassName(this.cssClasses.shownCssClass);
        image.src = currentImgSrc;
    }

    slideNext(nextImgSrc) {
        let image1 = this.getElementByClassName(this.cssClasses.shownCssClass);
        let image2 = this.getElementByClassName(this.cssClasses.belowCssClass);

        if (!(image1 && image2)) {
            return;
        }

        image2.src = nextImgSrc;
        image1.classList.remove('no-transition');
        image2.classList.remove('no-transition');
        image1.classList.remove(this.cssClasses.shownCssClass);
        image1.classList.add(this.cssClasses.aboveCssClass);
        image2.classList.add(this.cssClasses.shownCssClass);
        image2.classList.remove(this.cssClasses.belowCssClass);

        let that = this;

        image1.addEventListener("transitionend", restorePositions, false);

        function restorePositions() {
            image1.classList.add('no-transition');
            image1.classList.remove(that.cssClasses.aboveCssClass);
            image1.classList.add(that.cssClasses.belowCssClass);
            image1.removeEventListener("transitionend", restorePositions);
        }
    }

    slidePrev(prevImgSrc) {
        let image1 = this.getElementByClassName(this.cssClasses.shownCssClass);
        let image2 = this.getElementByClassName(this.cssClasses.aboveCssClass);

        if (!(image1 && image2)) {
            return;
        }

        image2.src = prevImgSrc;
        image1.classList.remove('no-transition');
        image2.classList.remove('no-transition');
        image1.classList.remove(this.cssClasses.shownCssClass);
        image1.classList.add(this.cssClasses.belowCssClass);
        image2.classList.add(this.cssClasses.shownCssClass);
        image2.classList.remove(this.cssClasses.aboveCssClass);


        let that = this;

        image1.addEventListener("transitionend", restorePositions, false);

        function restorePositions() {
            image1.classList.add('no-transition');
            image1.classList.remove(that.cssClasses.belowCssClass);
            image1.classList.add(that.cssClasses.aboveCssClass);
            image1.removeEventListener("transitionend", restorePositions);
        }
    }

    getElementByClassName(className) {
        let elements = document.getElementsByClassName(className);
        return elements[0];
    }

}

class WorksSlider {
    constructor(data, templateElements) {
        this.data = data;
        this.templateElements = templateElements;
        this.currentItem = 0;

        //console.log(this.data);

        let leftSlideButtonCssClasses = {
            shownCssClass: 'slider__switch-img_left_shown',
            aboveCssClass: 'slider__switch-img_left_above',
            belowCssClass: 'slider__switch-img_left_below'
        };

        this.leftSlideButton = new SlideButton(
            PATH_TO_PREVIEWS + this.getData(this.nextCount()).preview,
            leftSlideButtonCssClasses
        );



        let rightSlideButtonCssClasses = {
            shownCssClass: 'slider__switch-img_right_shown',
            aboveCssClass: 'slider__switch-img_right_above',
            belowCssClass: 'slider__switch-img_right_below'
        };

        this.rightSlideButton = new SlideButton(
            PATH_TO_PREVIEWS + this.getData(this.prevCount()).preview,
            rightSlideButtonCssClasses
        );
    }

    showItem() {
        let currentData = this.getData();

        this.leftSlideButton.slideNext(PATH_TO_PREVIEWS + this.getData(this.nextCount()).preview);
        this.rightSlideButton.slidePrev(PATH_TO_PREVIEWS + this.getData(this.prevCount()).preview)

        this.templateElements.link.href = currentData.link;
        this.templateElements.preview.src = PATH_TO_PREVIEWS + currentData.preview;
        textAnimation.generate(currentData.title, this.templateElements.title.id);
        textAnimation.generate(currentData.skills, this.templateElements.skills.id);

    }

    nextCount() {
        return this.currentItem == this.data.length - 1 ? 0 : this.currentItem + 1;
    }

    prevCount() {
        return this.currentItem == 0 ? this.data.length - 1 : this.currentItem - 1;
    }

    next(){
        this.currentItem = this.nextCount();
        this.showItem();
    }

    prev(){
        this.currentItem = this.prevCount();
        this.showItem();
    }

    getData(currentItem = this.currentItem) {
        return this.data[currentItem];
    }

    init(itemNumber = 0) {
        this.currentItem = itemNumber;
        this.showItem();
    }

}

module.exports = WorksSlider;

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/works_slider.js","/")
},{"./text_animation":13,"buffer":2,"rH1JPG":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJpbml0TWFwIiwicmVxdWlyZSIsImZsaXBHcmVldGluZ0JveCIsIlBhcmFsbGF4U2Nyb2xsIiwiUGFyYWxsYXhNb3VzZSIsIkJsdXIiLCJQcmVsb2FkZXIiLCJzY3JvbGxNZW51IiwiV29ya3NTbGlkZXIiLCJwcmVsb2FkZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5pdCIsIiQiLCJzdWJtaXQiLCJwcmVwYXJlQXV0aCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInJlc3VsdENvbnRhaW5lciIsInByb3AiLCJ2YWwiLCJ0ZXh0IiwiZGF0YSIsImxvZ2luIiwidmFsdWUiLCJwYXNzd29yZCIsInNlbmRBamF4SnNvbiIsImZvcm1NYWlsIiwicXVlcnlTZWxlY3RvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJwcmVwYXJlU2VuZE1haWwiLCJuYW1lIiwiZW1haWwiLCJtZXNzYWdlIiwiaW5uZXJIVE1MIiwic2VuZE1haWxEYXRhIiwidXJsIiwiY2IiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25sb2FkIiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0Iiwic3RhdHVzIiwic2VuZCIsInN0cmluZ2lmeSIsInBhcmFsbGF4U2Nyb2xsIiwic3RhcnQiLCJwYXJhbGxheE1vdXNlIiwid3JhcHBlciIsImZvcm0iLCJibHVyIiwibGVuZ3RoIiwidGl0bGUiLCJza2lsbHMiLCJsaW5rIiwicHJldmlldyIsInRlbXBsYXRlRWxlbWVudHMiLCJwcmV2IiwibmV4dCIsIndpbmRvdyIsImdldEpTT04iLCJzbGlkZXJHb1VwIiwic2xpZGVyR29Eb3duIiwid29ya3NTbGlkZXIiLCJ3b3JrcyIsImhlcm9IYW1idXJnZXIiLCJvdmVybGF5IiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwic2xpZGVNZW51Iiwib24iLCJpdGVtIiwiY2xvc2VzdCIsImNvbnRlbnRJdGVtIiwiaXRlbVBvc2l0aW9uIiwiaW5kZXgiLCJlcSIsImFkZENsYXNzIiwic2libGluZ3MiLCJyZW1vdmVDbGFzcyIsImVhY2giLCIkaW5wdXQiLCIkbGFiZWwiLCJsYWJlbFZhbCIsImh0bWwiLCJmaWxlTmFtZSIsInRhcmdldCIsInNwbGl0IiwicG9wIiwiY29uc29sZSIsImxvZyIsImZvcm1Ta2lsbHMiLCJwcmVwYXJlU2VuZFBvc3RTa2lsbHMiLCJza2lsbHNHcm91cHMiLCJkYXRhSXRlbSIsImlkIiwic2tpbGxzTGlzdCIsImlucHV0IiwiaW5wdXROYW1lIiwiYXR0ciIsImlucHV0VmFsdWUiLCJwdXNoIiwiZm9ybUJsb2ciLCJwcmVwYXJlU2VuZFBvc3RCbG9nIiwiZGF0ZSIsInJlc2V0IiwiZm9ybVVwbG9hZCIsImZpbGVVcGxvYWQiLCJwcmVwYXJlU2VuZEZpbGUiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiZmlsZSIsImZpbGVzIiwiYXBwZW5kIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJQSxVQUFVQyxRQUFRLGNBQVIsQ0FBZDtBQUNBLElBQUlDLGtCQUFrQkQsUUFBUSxZQUFSLENBQXRCO0FBQ0EsSUFBSUUsaUJBQWlCRixRQUFRLG1CQUFSLENBQXJCO0FBQ0EsSUFBSUcsZ0JBQWdCSCxRQUFRLGtCQUFSLENBQXBCO0FBQ0EsSUFBSUksT0FBT0osUUFBUSxRQUFSLENBQVg7QUFDQSxJQUFJSyxZQUFZTCxRQUFRLGFBQVIsQ0FBaEI7QUFDQSxJQUFJTSxhQUFhTixRQUFRLGFBQVIsQ0FBakI7QUFDQSxJQUFJTyxjQUFjUCxRQUFRLGdCQUFSLENBQWxCOztBQUdBLElBQUlRLFlBQVksSUFBSUgsU0FBSixDQUNaSSxTQUFTQyxjQUFULENBQXdCLFVBQXhCLENBRFksRUFFWkQsU0FBU0MsY0FBVCxDQUF3QixXQUF4QixDQUZZLEVBR1pELFNBQVNDLGNBQVQsQ0FBd0Isb0JBQXhCLENBSFksQ0FBaEI7QUFLQUYsVUFBVUcsSUFBVjs7QUFHQTs7O0FBR0FaOztBQUVBOzs7QUFHQUUsZ0JBQWdCUSxTQUFTQyxjQUFULENBQXdCLGVBQXhCLENBQWhCLEVBQTBERCxTQUFTQyxjQUFULENBQXdCLHNCQUF4QixDQUExRDtBQUNBVCxnQkFBZ0JRLFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEIsQ0FBaEIsRUFBMERELFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEIsQ0FBMUQ7O0FBR0E7OztBQUdBOzs7Ozs7Ozs7Ozs7QUFhQUUsRUFBRyxnQkFBSCxFQUFzQkMsTUFBdEIsQ0FBNkJDLFdBQTdCO0FBQ0E7Ozs7OztBQU1BLFNBQVNBLFdBQVQsQ0FBcUJDLENBQXJCLEVBQXdCO0FBQ3BCQSxNQUFFQyxjQUFGOztBQUVBLFFBQUlDLGtCQUFrQkwsRUFBRSxxQkFBRixDQUF0Qjs7QUFFQSxRQUFLLEVBQUVBLEVBQUUsV0FBRixFQUFlTSxJQUFmLENBQXFCLFNBQXJCLEtBQXNDTixFQUFFLG9DQUFGLEVBQXdDLGdCQUF4QyxFQUEwRE8sR0FBMUQsTUFBbUUsQ0FBM0csQ0FBTCxFQUFxSDtBQUNqSFAsVUFBRUssZUFBRixFQUFtQkcsSUFBbkIsQ0FBd0Isc0JBQXhCO0FBQ0E7QUFDSDs7QUFFRCxRQUFJQyxPQUFPO0FBQ1BDLGVBQU8sS0FBS0EsS0FBTCxDQUFXQyxLQURYO0FBRVBDLGtCQUFVLEtBQUtBLFFBQUwsQ0FBY0Q7QUFGakIsS0FBWDs7QUFLQTtBQUNBWCxNQUFFSyxlQUFGLEVBQW1CRyxJQUFuQixDQUF3QixZQUF4QjtBQUNBSyxpQkFBYSxRQUFiLEVBQXVCSixJQUF2QixFQUE2QixVQUFVQSxJQUFWLEVBQWdCO0FBQ3pDVCxVQUFFSyxlQUFGLEVBQW1CRyxJQUFuQixDQUF3QkMsSUFBeEI7QUFDSCxLQUZEO0FBR0g7O0FBRUQ7Ozs7QUFJQSxJQUFNSyxXQUFXakIsU0FBU2tCLGFBQVQsQ0FBdUIsa0JBQXZCLENBQWpCOztBQUVBLElBQUlELFFBQUosRUFBYztBQUNWQSxhQUFTRSxnQkFBVCxDQUEwQixRQUExQixFQUFvQ0MsZUFBcEM7QUFDSDs7QUFFRCxTQUFTQSxlQUFULENBQXlCZCxDQUF6QixFQUE0QjtBQUN4QkEsTUFBRUMsY0FBRjtBQUNBLFFBQUlDLGtCQUFrQlIsU0FBU2tCLGFBQVQsQ0FBdUIscUJBQXZCLENBQXRCO0FBQ0EsUUFBSU4sT0FBTztBQUNQUyxjQUFNSixTQUFTSSxJQUFULENBQWNQLEtBRGI7QUFFUFEsZUFBT0wsU0FBU0ssS0FBVCxDQUFlUixLQUZmO0FBR1BILGNBQU1NLFNBQVNNLE9BQVQsQ0FBaUJUO0FBSGhCLEtBQVg7QUFLQU4sb0JBQWdCZ0IsU0FBaEIsR0FBNEIsWUFBNUI7QUFDQUMsaUJBQWEsVUFBYixFQUF5QmIsSUFBekIsRUFBK0IsVUFBVUEsSUFBVixFQUFnQjtBQUMzQ0osd0JBQWdCZ0IsU0FBaEIsR0FBNEJaLElBQTVCO0FBQ0gsS0FGRDtBQUdIOztBQUVELFNBQVNhLFlBQVQsQ0FBc0JDLEdBQXRCLEVBQTJCZCxJQUEzQixFQUFpQ2UsRUFBakMsRUFBcUM7QUFDakMsUUFBSUMsTUFBTSxJQUFJQyxjQUFKLEVBQVY7QUFDQUQsUUFBSUUsSUFBSixDQUFTLE1BQVQsRUFBaUJKLEdBQWpCLEVBQXNCLElBQXRCO0FBQ0FFLFFBQUlHLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLGtCQUFyQztBQUNBSCxRQUFJSSxNQUFKLEdBQWEsVUFBVTFCLENBQVYsRUFBYTtBQUN0QixZQUFJMkIsU0FBU0MsS0FBS0MsS0FBTCxDQUFXUCxJQUFJUSxZQUFmLENBQWI7QUFDQVQsV0FBR00sT0FBT0ksTUFBVjtBQUNILEtBSEQ7QUFJQVQsUUFBSVUsSUFBSixDQUFTSixLQUFLSyxTQUFMLENBQWUzQixJQUFmLENBQVQ7QUFDSDs7QUFJRDs7Ozs7QUFLQSxJQUFJNEIsaUJBQWlCLElBQUkvQyxjQUFKLENBQ2pCTyxTQUFTa0IsYUFBVCxDQUF1QixlQUF2QixDQURpQixFQUVqQmxCLFNBQVNrQixhQUFULENBQXVCLGlCQUF2QixDQUZpQixFQUdqQmxCLFNBQVNrQixhQUFULENBQXVCLHlCQUF2QixDQUhpQixDQUFyQjtBQUtBc0IsZUFBZUMsS0FBZjs7QUFFQTs7Ozs7QUFLQSxJQUFJQyxnQkFBZ0IsSUFBSWhELGFBQUosQ0FBa0JNLFNBQVNDLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBbEIsQ0FBcEI7QUFDQXlDLGNBQWNELEtBQWQ7O0FBRUEsSUFBSUUsVUFBVTNDLFNBQVNrQixhQUFULENBQXVCLGFBQXZCLENBQWQ7QUFDQSxJQUFJMEIsT0FBTzVDLFNBQVNrQixhQUFULENBQXVCLG1CQUF2QixDQUFYO0FBQ0EsSUFBSTJCLE9BQU8sSUFBSWxELElBQUosQ0FBU2dELE9BQVQsRUFBa0JDLElBQWxCLEVBQXdCLEdBQXhCLENBQVg7QUFDQUMsS0FBS0osS0FBTDs7QUFFQTs7OztBQUlBLElBQUl0QyxFQUFFLE9BQUYsRUFBVzJDLE1BQVgsR0FBb0IsQ0FBcEIsSUFDQTNDLEVBQUUsa0JBQUYsRUFBc0IyQyxNQUF0QixHQUErQixDQUQvQixJQUVBM0MsRUFBRSxrQkFBRixFQUFzQjJDLE1BQXRCLEdBQStCLENBRm5DLEVBRXNDO0FBQ2xDakQsZUFBV0ssSUFBWDtBQUNIOztBQUdELElBQUlVLE9BQU8sQ0FDUDtBQUNJbUMsV0FBTyxpQkFEWDtBQUVJQyxZQUFRLHVCQUZaO0FBR0lDLFVBQU0sa0JBSFY7QUFJSUMsYUFBUztBQUpiLENBRE8sRUFPUDtBQUNJSCxXQUFPLGdCQURYO0FBRUlDLFlBQVEsK0JBRlo7QUFHSUMsVUFBTSxrQkFIVjtBQUlJQyxhQUFTO0FBSmIsQ0FQTyxFQWFQO0FBQ0lILFdBQU8sd0JBRFg7QUFFSUMsWUFBUSxVQUZaO0FBR0lDLFVBQU0sa0JBSFY7QUFJSUMsYUFBUztBQUpiLENBYk8sRUFtQlA7QUFDSUgsV0FBTyx3QkFEWDtBQUVJQyxZQUFRLFdBRlo7QUFHSUMsVUFBTSxrQkFIVjtBQUlJQyxhQUFTO0FBSmIsQ0FuQk8sQ0FBWDs7QUE0QkEsSUFBSUMsbUJBQW1CO0FBQ25CSixXQUFPL0MsU0FBU0MsY0FBVCxDQUF3QixjQUF4QixDQURZO0FBRW5CK0MsWUFBUWhELFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEIsQ0FGVztBQUduQmdELFVBQU1qRCxTQUFTQyxjQUFULENBQXdCLGFBQXhCLENBSGE7QUFJbkJpRCxhQUFTbEQsU0FBU0MsY0FBVCxDQUF3QixnQkFBeEIsQ0FKVTtBQUtuQm1ELFVBQU1wRCxTQUFTQyxjQUFULENBQXdCLGFBQXhCLENBTGE7QUFNbkJvRCxVQUFNckQsU0FBU0MsY0FBVCxDQUF3QixhQUF4Qjs7QUFOYSxDQUF2Qjs7QUFXQTs7Ozs7QUFLQXFELE9BQU9uQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxZQUFZO0FBQ3hDaEIsTUFBRW9ELE9BQUYsQ0FBVyxZQUFYLEVBQXlCLFVBQVUzQyxJQUFWLEVBQWlCO0FBQ3RDLFlBQUk0QyxhQUFheEQsU0FBU0MsY0FBVCxDQUF3QixlQUF4QixDQUFqQjtBQUNBLFlBQUl3RCxlQUFlekQsU0FBU0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FBbkI7O0FBRUEsWUFBSXVELGNBQWNDLFlBQWxCLEVBQWdDO0FBQzVCLGdCQUFJQyxjQUFjLElBQUk1RCxXQUFKLENBQWdCYyxLQUFLK0MsS0FBckIsRUFBNEJSLGdCQUE1QixDQUFsQjtBQUNBTyx3QkFBWXhELElBQVo7QUFDQUYscUJBQVNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNrQixnQkFBekMsQ0FBMEQsT0FBMUQsRUFBbUU7QUFBQSx1QkFBS3VDLFlBQVlMLElBQVosRUFBTDtBQUFBLGFBQW5FO0FBQ0FyRCxxQkFBU0MsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkNrQixnQkFBM0MsQ0FBNEQsT0FBNUQsRUFBcUU7QUFBQSx1QkFBS3VDLFlBQVlMLElBQVosRUFBTDtBQUFBLGFBQXJFO0FBQ0g7QUFDSixLQVZEO0FBV0gsQ0FaRDs7QUFnQkE7Ozs7O0FBS0EsSUFBSU8sZ0JBQWdCNUQsU0FBU0MsY0FBVCxDQUF3QixnQkFBeEIsQ0FBcEI7QUFDQSxJQUFJNEQsVUFBVTdELFNBQVNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBZDtBQUNBLElBQUkyRCxhQUFKLEVBQW1CO0FBQ2ZBLGtCQUFjekMsZ0JBQWQsQ0FBK0IsT0FBL0IsRUFBd0MsWUFBVTtBQUM5QyxhQUFLMkMsU0FBTCxDQUFlQyxNQUFmLENBQXNCLGtCQUF0QjtBQUNBRixnQkFBUUMsU0FBUixDQUFrQkMsTUFBbEIsQ0FBeUIsTUFBekI7QUFDSCxLQUhEO0FBSUg7O0FBRUQsSUFBSUMsWUFBWWhFLFNBQVNDLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBaEI7QUFDQSxJQUFJK0QsU0FBSixFQUFlO0FBQ1hBLGNBQVU3QyxnQkFBVixDQUEyQixPQUEzQixFQUFvQztBQUFBLGVBQU02QyxVQUFVRixTQUFWLENBQW9CQyxNQUFwQixDQUEyQixxQkFBM0IsQ0FBTjtBQUFBLEtBQXBDO0FBQ0g7O0FBRUQ7Ozs7QUFJQTVELEVBQUUsNEJBQUYsRUFBZ0M4RCxFQUFoQyxDQUFtQyxPQUFuQyxFQUE0QyxVQUFTM0QsQ0FBVCxFQUFXO0FBQ25EQSxNQUFFQyxjQUFGOztBQUVBLFFBQUkyRCxPQUFPL0QsRUFBRSxJQUFGLEVBQVFnRSxPQUFSLENBQWdCLDRCQUFoQixDQUFYOztBQUVBLFFBQUlDLGNBQWNqRSxFQUFFLG1CQUFGLENBQWxCO0FBQ0EsUUFBSWtFLGVBQWVILEtBQUtJLEtBQUwsRUFBbkI7O0FBRUFGLGdCQUFZRyxFQUFaLENBQWVGLFlBQWYsRUFDS0csUUFETCxDQUNjLHlCQURkLEVBRUtDLFFBRkwsR0FHS0MsV0FITCxDQUdpQix5QkFIakI7O0FBS0FSLFNBQUtNLFFBQUwsQ0FBYyxrQ0FBZCxFQUNLQyxRQURMLEdBRUtDLFdBRkwsQ0FFaUIsa0NBRmpCO0FBR0gsQ0FoQkQ7O0FBa0JBdkUsRUFBRyx5QkFBSCxFQUErQndFLElBQS9CLENBQXFDLFlBQ3JDO0FBQ0ksUUFBSUMsU0FBVXpFLEVBQUcsSUFBSCxDQUFkO0FBQUEsUUFDSTBFLFNBQVVELE9BQU92QixJQUFQLENBQWEsT0FBYixDQURkO0FBQUEsUUFFSXlCLFdBQVdELE9BQU9FLElBQVAsRUFGZjs7QUFJQUgsV0FBT1gsRUFBUCxDQUFXLFFBQVgsRUFBcUIsVUFBVTNELENBQVYsRUFDckI7QUFDSSxZQUFJMEUsV0FBVyxFQUFmOztBQUVBLFlBQUkxRSxFQUFFMkUsTUFBRixDQUFTbkUsS0FBYixFQUNJa0UsV0FBVzFFLEVBQUUyRSxNQUFGLENBQVNuRSxLQUFULENBQWVvRSxLQUFmLENBQXNCLElBQXRCLEVBQTZCQyxHQUE3QixFQUFYO0FBQ0FDLGdCQUFRQyxHQUFSLENBQVlMLFFBQVo7O0FBRUosWUFBSUEsUUFBSixFQUNJSCxPQUFPRSxJQUFQLENBQWFDLFFBQWIsRUFESixLQUdJSCxPQUFPRSxJQUFQLENBQWFELFFBQWI7QUFDUCxLQVpEOztBQWNBO0FBQ0FGLFdBQ0tYLEVBREwsQ0FDUyxPQURULEVBQ2tCLFlBQVU7QUFBRVcsZUFBT0osUUFBUCxDQUFpQixXQUFqQjtBQUFpQyxLQUQvRCxFQUVLUCxFQUZMLENBRVMsTUFGVCxFQUVpQixZQUFVO0FBQUVXLGVBQU9GLFdBQVAsQ0FBb0IsV0FBcEI7QUFBb0MsS0FGakU7QUFHSCxDQXhCRDs7QUE0QkEsU0FBUzFELFlBQVQsQ0FBc0JVLEdBQXRCLEVBQTJCZCxJQUEzQixFQUFpQ2UsRUFBakMsRUFBcUM7QUFDakMsUUFBSUMsTUFBTSxJQUFJQyxjQUFKLEVBQVY7QUFDQUQsUUFBSUUsSUFBSixDQUFTLE1BQVQsRUFBaUJKLEdBQWpCLEVBQXNCLElBQXRCO0FBQ0FFLFFBQUlHLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLGtCQUFyQztBQUNBSCxRQUFJSSxNQUFKLEdBQWEsVUFBVTFCLENBQVYsRUFBYTtBQUN0QixZQUFJMkIsU0FBU0MsS0FBS0MsS0FBTCxDQUFXUCxJQUFJUSxZQUFmLENBQWI7QUFDQVQsV0FBR00sT0FBT0ksTUFBVjtBQUNILEtBSEQ7QUFJQVQsUUFBSVUsSUFBSixDQUFTSixLQUFLSyxTQUFMLENBQWUzQixJQUFmLENBQVQ7QUFDSDs7QUFFRDs7O0FBR0EsSUFBTTBFLGFBQWF0RixTQUFTa0IsYUFBVCxDQUF1QixlQUF2QixDQUFuQjs7QUFFQSxJQUFJb0UsVUFBSixFQUFnQjtBQUNaQSxlQUFXbkUsZ0JBQVgsQ0FBNEIsUUFBNUIsRUFBc0NvRSxxQkFBdEM7QUFDSDs7QUFFRCxTQUFTQSxxQkFBVCxDQUErQmpGLENBQS9CLEVBQWtDO0FBQzlCQSxNQUFFQyxjQUFGOztBQUVBLFFBQUlDLGtCQUFrQlIsU0FBU2tCLGFBQVQsQ0FBdUIsMkJBQXZCLENBQXRCO0FBQ0EsUUFBSXNFLGVBQWVyRixFQUFFLHFCQUFGLENBQW5COztBQUVBLFFBQUlTLE9BQU8sRUFBWDtBQUNBVCxNQUFFd0UsSUFBRixDQUFPYSxZQUFQLEVBQXFCLFVBQVNsQixLQUFULEVBQWdCeEQsS0FBaEIsRUFBc0I7QUFDdkMsWUFBSTJFLFdBQVcsRUFBZjtBQUNBQSxpQkFBU0MsRUFBVCxHQUFjdkYsRUFBRVcsS0FBRixFQUFTRixJQUFULENBQWMsSUFBZCxDQUFkOztBQUVBLFlBQUkrRSxhQUFheEYsRUFBRSx3QkFBRixFQUE0QlcsS0FBNUIsQ0FBakI7QUFDQSxZQUFJa0MsU0FBUyxFQUFiO0FBQ0E3QyxVQUFFd0UsSUFBRixDQUFPZ0IsVUFBUCxFQUFtQixVQUFTckIsS0FBVCxFQUFnQnhELEtBQWhCLEVBQXNCO0FBQ3JDLGdCQUFJOEUsUUFBUXpGLEVBQUUseUJBQUYsRUFBNkJXLEtBQTdCLENBQVo7QUFDQSxnQkFBSStFLFlBQVkxRixFQUFFeUYsS0FBRixFQUFTRSxJQUFULENBQWMsTUFBZCxDQUFoQjtBQUNBLGdCQUFJQyxhQUFhNUYsRUFBRXlGLEtBQUYsRUFBU2xGLEdBQVQsRUFBakI7QUFDQXNDLG1CQUFPNkMsU0FBUCxJQUFvQkUsVUFBcEI7QUFDSCxTQUxEOztBQU9BTixpQkFBU3pDLE1BQVQsR0FBa0JBLE1BQWxCO0FBQ0FwQyxhQUFLb0YsSUFBTCxDQUFVUCxRQUFWO0FBQ0gsS0FmRDs7QUFpQkFqRixvQkFBZ0JnQixTQUFoQixHQUE0QixZQUE1QjtBQUNBUixpQkFBYSxZQUFiLEVBQTJCSixJQUEzQixFQUFpQyxVQUFVQSxJQUFWLEVBQWdCO0FBQzdDSix3QkFBZ0JnQixTQUFoQixHQUE0QlosSUFBNUI7QUFDSCxLQUZEO0FBR0g7O0FBR0Q7OztBQUdBLElBQU1xRixXQUFXakcsU0FBU2tCLGFBQVQsQ0FBdUIsYUFBdkIsQ0FBakI7O0FBRUEsSUFBSStFLFFBQUosRUFBYztBQUNWQSxhQUFTOUUsZ0JBQVQsQ0FBMEIsUUFBMUIsRUFBb0MrRSxtQkFBcEM7QUFDSDs7QUFFRCxTQUFTQSxtQkFBVCxDQUE2QjVGLENBQTdCLEVBQWdDO0FBQzVCQSxNQUFFQyxjQUFGOztBQUVBLFFBQUlDLGtCQUFrQlIsU0FBU2tCLGFBQVQsQ0FBdUIseUJBQXZCLENBQXRCO0FBQ0EsUUFBSU4sT0FBTztBQUNQbUMsZUFBTy9DLFNBQVNDLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDYSxLQUQxQztBQUVQcUYsY0FBTW5HLFNBQVNDLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDYSxLQUZ6QztBQUdQSCxjQUFNWCxTQUFTQyxjQUFULENBQXdCLGdCQUF4QixFQUEwQ2E7QUFIekMsS0FBWDtBQUtBTixvQkFBZ0JnQixTQUFoQixHQUE0QixZQUE1QjtBQUNBUixpQkFBYSxVQUFiLEVBQXlCSixJQUF6QixFQUErQixVQUFVQSxJQUFWLEVBQWdCO0FBQzNDSix3QkFBZ0JnQixTQUFoQixHQUE0QlosSUFBNUI7QUFDQVosaUJBQVNrQixhQUFULENBQXVCLGFBQXZCLEVBQXNDa0YsS0FBdEM7QUFDSCxLQUhEO0FBSUg7O0FBR0Q7Ozs7QUFJQSxJQUFNQyxhQUFhckcsU0FBU2tCLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBbkI7O0FBRUEsU0FBU29GLFVBQVQsQ0FBb0I1RSxHQUFwQixFQUF5QmQsSUFBekIsRUFBK0JlLEVBQS9CLEVBQW1DO0FBQy9CLFFBQUlDLE1BQU0sSUFBSUMsY0FBSixFQUFWO0FBQ0FELFFBQUlFLElBQUosQ0FBUyxNQUFULEVBQWlCSixHQUFqQixFQUFzQixJQUF0Qjs7QUFFQUUsUUFBSUksTUFBSixHQUFhLFVBQVUxQixDQUFWLEVBQWE7QUFDdEIsWUFBSTJCLFNBQVNDLEtBQUtDLEtBQUwsQ0FBV1AsSUFBSVEsWUFBZixDQUFiO0FBQ0FULFdBQUdNLE9BQU9JLE1BQVY7QUFDSCxLQUhEOztBQUtBVCxRQUFJVSxJQUFKLENBQVMxQixJQUFUO0FBQ0g7O0FBRUQsU0FBUzJGLGVBQVQsQ0FBeUJqRyxDQUF6QixFQUE0QjtBQUN4QkEsTUFBRUMsY0FBRjtBQUNBLFFBQUlDLGtCQUFrQlIsU0FBU2tCLGFBQVQsQ0FBdUIsMEJBQXZCLENBQXRCO0FBQ0EsUUFBSXNGLFdBQVcsSUFBSUMsUUFBSixFQUFmO0FBQ0EsUUFBSUMsT0FBTzFHLFNBQ05rQixhQURNLENBQ1EscUJBRFIsRUFFTnlGLEtBRk0sQ0FFQSxDQUZBLENBQVg7QUFHQSxRQUFJNUQsUUFBUS9DLFNBQ1BrQixhQURPLENBQ08sY0FEUCxFQUVQSixLQUZMOztBQUlBLFFBQUlrQyxTQUFTaEQsU0FDUmtCLGFBRFEsQ0FDTSxlQUROLEVBRVJKLEtBRkw7O0FBSUEsUUFBSW1DLE9BQU9qRCxTQUNOa0IsYUFETSxDQUNRLGFBRFIsRUFFTkosS0FGTDs7QUFJQTBGLGFBQVNJLE1BQVQsQ0FBZ0IsT0FBaEIsRUFBeUJGLElBQXpCLEVBQStCQSxLQUFLckYsSUFBcEM7QUFDQW1GLGFBQVNJLE1BQVQsQ0FBZ0IsT0FBaEIsRUFBeUI3RCxLQUF6QjtBQUNBeUQsYUFBU0ksTUFBVCxDQUFnQixRQUFoQixFQUEwQjVELE1BQTFCO0FBQ0F3RCxhQUFTSSxNQUFULENBQWdCLE1BQWhCLEVBQXdCM0QsSUFBeEI7O0FBRUF6QyxvQkFBZ0JnQixTQUFoQixHQUE0QixjQUE1QjtBQUNBOEUsZUFBVyxTQUFYLEVBQXNCRSxRQUF0QixFQUFnQyxVQUFVNUYsSUFBVixFQUFnQjtBQUM1Q0osd0JBQWdCZ0IsU0FBaEIsR0FBNEJaLElBQTVCO0FBQ0FaLGlCQUFTa0IsYUFBVCxDQUF1QixjQUF2QixFQUF1Q2tGLEtBQXZDO0FBQ0FqRyxVQUFFLGdDQUFGLEVBQW9DUSxJQUFwQyxDQUF5QyxvQkFBekM7QUFDSCxLQUpEO0FBS0g7O0FBRUQsSUFBSTBGLFVBQUosRUFBZ0I7QUFDWkEsZUFBV2xGLGdCQUFYLENBQTRCLFFBQTVCLEVBQXNDb0YsZUFBdEM7QUFDSCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmxldCBpbml0TWFwID0gcmVxdWlyZSgnLi9nb29nbGVfbWFwJyk7XG5sZXQgZmxpcEdyZWV0aW5nQm94ID0gcmVxdWlyZSgnLi9mbGlwX2JveCcpO1xubGV0IFBhcmFsbGF4U2Nyb2xsID0gcmVxdWlyZSgnLi9wYXJhbGxheF9zY3JvbGwnKTtcbmxldCBQYXJhbGxheE1vdXNlID0gcmVxdWlyZSgnLi9wYXJhbGxheF9tb3VzZScpO1xubGV0IEJsdXIgPSByZXF1aXJlKCcuL2JsdXInKTtcbmxldCBQcmVsb2FkZXIgPSByZXF1aXJlKCcuL3ByZWxvYWRlcicpO1xubGV0IHNjcm9sbE1lbnUgPSByZXF1aXJlKCcuL2Jsb2dfbWVudScpO1xubGV0IFdvcmtzU2xpZGVyID0gcmVxdWlyZSgnLi93b3Jrc19zbGlkZXInKTtcblxuXG5sZXQgcHJlbG9hZGVyID0gbmV3IFByZWxvYWRlcihcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFyYWxsYXgnKSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJlbG9hZGVyJyksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlci1wZXJjZW50cycpXG4pO1xucHJlbG9hZGVyLmluaXQoKTtcblxuXG4vKipcbiAqINCa0LDRgNGC0LAgR29vZ2xlINC90LAg0YHRgtGA0LDQvdC40YbQtSBBYm91dFxuICovXG5pbml0TWFwKCk7XG5cbi8qKlxuICogINCf0LXRgNC10LrQu9GO0YfQtdC90LjQtSBGbGlwLdCx0L7QutGB0LAg0L3QsCDQuNC90LTQtdC60YHQvdC+0Lkg0YHRgtGA0LDQvdC40YbQtVxuICovXG5mbGlwR3JlZXRpbmdCb3goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmVldGluZy1mbGlwXCIpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JlZXRpbmdfX2F0aG9yaXphdGUnKSk7XG5mbGlwR3JlZXRpbmdCb3goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmVldGluZy1mbGlwXCIpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG8taW5kZXgtcGFnZScpKTtcblxuXG4vKipcbiAqINCk0L7RgNC80LAg0LDQstGC0L7RgNC40LfQsNGG0LjQuFxuICovXG4vKlxuJCggXCIjYXV0aG9yaXphdGlvblwiICkuc3VibWl0KGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICBpZiAoICEoJChcIiNub19yb2JvdFwiKS5wcm9wKCBcImNoZWNrZWRcIiApICYmICAoJCgnaW5wdXRbbmFtZT1ub19yb2JvdF9yYWRpb106Y2hlY2tlZCcsICcjYXV0aG9yaXphdGlvbicpLnZhbCgpID09IDEpKSkge1xuICAgICAgICAkKFwiI3ZhbGlkYXRpb24tbWVzc2FnZVwiKS50ZXh0KCcg0KDQvtCx0L7RgtGLINC90LDQvCDQvdC1INC90YPQttC90YsnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKFwiI3ZhbGlkYXRpb24tbWVzc2FnZVwiKS50ZXh0KCfQktC10YDRjiwg0YfRgtC+INGH0LXQu9C+0LLQtdC6LiDQodCw0LHQvNC40YIg0YDQtdCw0LvQuNC30YPRjiDQv9C+0LfQttC1Jyk7XG4gICAgfTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59KTtcbiovXG5cblxuJCggXCIjYXV0aG9yaXphdGlvblwiICkuc3VibWl0KHByZXBhcmVBdXRoKTtcbi8qXG5jb25zdCAgZm9ybUxvZ2luID0gJChcIiNhdXRob3JpemF0aW9uXCIpO1xuaWYgKGZvcm1Mb2dpbikge1xuICAgIGZvcm1Mb2dpbi5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBwcmVwYXJlQXV0aCk7XG59Ki9cblxuZnVuY3Rpb24gcHJlcGFyZUF1dGgoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGxldCByZXN1bHRDb250YWluZXIgPSAkKCcjdmFsaWRhdGlvbi1tZXNzYWdlJyk7XG5cbiAgICBpZiAoICEoJChcIiNub19yb2JvdFwiKS5wcm9wKCBcImNoZWNrZWRcIiApICYmICAoJCgnaW5wdXRbbmFtZT1ub19yb2JvdF9yYWRpb106Y2hlY2tlZCcsICcjYXV0aG9yaXphdGlvbicpLnZhbCgpID09IDEpKSkge1xuICAgICAgICAkKHJlc3VsdENvbnRhaW5lcikudGV4dCgnINCg0L7QsdC+0YLRiyDQvdCw0Lwg0L3QtSDQvdGD0LbQvdGLJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9O1xuXG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIGxvZ2luOiB0aGlzLmxvZ2luLnZhbHVlLFxuICAgICAgICBwYXNzd29yZDogdGhpcy5wYXNzd29yZC52YWx1ZVxuICAgIH07XG5cbiAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuICAgICQocmVzdWx0Q29udGFpbmVyKS50ZXh0KCdTZW5kaW5nLi4uJyk7XG4gICAgc2VuZEFqYXhKc29uKCcvbG9naW4nLCBkYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAkKHJlc3VsdENvbnRhaW5lcikudGV4dChkYXRhKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiDQpNC+0YDQvNCwINC+0YLQv9GA0LDQstC60Lgg0YHQvtC+0LHRidC10L3QuNGPXG4gKi9cblxuY29uc3QgZm9ybU1haWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29ubmVjdC1tZS1mb3JtJyk7XG5cbmlmIChmb3JtTWFpbCkge1xuICAgIGZvcm1NYWlsLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHByZXBhcmVTZW5kTWFpbCk7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVTZW5kTWFpbChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCByZXN1bHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdmFsaWRhdGlvbi1tZXNzYWdlJyk7XG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIG5hbWU6IGZvcm1NYWlsLm5hbWUudmFsdWUsXG4gICAgICAgIGVtYWlsOiBmb3JtTWFpbC5lbWFpbC52YWx1ZSxcbiAgICAgICAgdGV4dDogZm9ybU1haWwubWVzc2FnZS52YWx1ZVxuICAgIH07XG4gICAgcmVzdWx0Q29udGFpbmVyLmlubmVySFRNTCA9ICdTZW5kaW5nLi4uJztcbiAgICBzZW5kTWFpbERhdGEoJy9jb250YWN0JywgZGF0YSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmVzdWx0Q29udGFpbmVyLmlubmVySFRNTCA9IGRhdGE7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRNYWlsRGF0YSh1cmwsIGRhdGEsIGNiKSB7XG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNiKHJlc3VsdC5zdGF0dXMpO1xuICAgIH07XG4gICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG5cblxuLyoqXG4gKiDQn9Cw0YDQsNC70LvQsNC60YEg0L/QviDQv9GA0L7QutGA0YPRgtC60LUg0YHRgtGA0LDQvdC40YbRi1xuICpcbiAqIEB0eXBlIHtwYXJhbGxheFNjcm9sbH1cbiAqL1xubGV0IHBhcmFsbGF4U2Nyb2xsID0gbmV3IFBhcmFsbGF4U2Nyb2xsKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZXJvX19iZy1pbWcnKSxcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVyby10aXRsZS1waWMnKSxcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVyb19fYXV0aG9yLWNvbnRhaW5lcicpXG4pO1xucGFyYWxsYXhTY3JvbGwuc3RhcnQoKTtcblxuLyoqXG4gKiDQn9Cw0YDQsNC70LvQsNC60YEg0L/QviDQtNCy0LjQttC10L3QuNGOINC80YvRiNC60LhcbiAqXG4gKiBAdHlwZSB7cGFyYWxsYXhNb3VzZX1cbiAqL1xubGV0IHBhcmFsbGF4TW91c2UgPSBuZXcgUGFyYWxsYXhNb3VzZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFyYWxsYXgnKSk7XG5wYXJhbGxheE1vdXNlLnN0YXJ0KCk7XG5cbnZhciB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbm5lY3QtbWUnKTtcbnZhciBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbm5lY3QtbWVfX2JsdXInKTtcbmxldCBibHVyID0gbmV3IEJsdXIod3JhcHBlciwgZm9ybSwgNjI1KTtcbmJsdXIuc3RhcnQoKTtcblxuLyoqXG4gKiAg0KHQutGA0L7Qu9C7INC80LXQvdGOINC90LAg0YHRgtGA0LDQvdC40YbQtSDQsdC70L7Qs9CwXG4gKi9cblxuaWYgKCQoJy5uZXdzJykubGVuZ3RoID4gMCAmJlxuICAgICQoJy5ibG9nX19tZW51LWl0ZW0nKS5sZW5ndGggPiAwICYmXG4gICAgJCgnLmJsb2dfX3dyYXAtbWVudScpLmxlbmd0aCA+IDApIHtcbiAgICBzY3JvbGxNZW51LmluaXQoKTtcbn1cblxuXG5sZXQgZGF0YSA9IFtcbiAgICB7XG4gICAgICAgIHRpdGxlOiAn0J/RgNC40LzQtdGAINGB0LDQudGC0LAgIDEnLFxuICAgICAgICBza2lsbHM6ICdodG1sLCBjc3MsIGphdmFzY3JpcHQnLFxuICAgICAgICBsaW5rOiAnaHR0cDovL3NpdGUxLmNvbScsXG4gICAgICAgIHByZXZpZXc6ICcxLnBuZydcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdGl0bGU6ICfQodCw0LnRgiAyLiDQn9GA0LjQvNC10YAnLFxuICAgICAgICBza2lsbHM6ICdodG1sLCBjc3MsIGphdmFzY3JpcHQsIGpRdWVyeScsXG4gICAgICAgIGxpbms6ICdodHRwOi8vc2l0ZTIuY29tJyxcbiAgICAgICAgcHJldmlldzogJzIucG5nJ1xuICAgIH0sXG4gICAge1xuICAgICAgICB0aXRsZTogJ9Ch0LDQudGCIDMg0JXRidC1INC+0LTQuNC9INC/0YDQuNC80LXRgCcsXG4gICAgICAgIHNraWxsczogJ0FuZ3VsYXIyJyxcbiAgICAgICAgbGluazogJ2h0dHA6Ly9zaXRlMy5jb20nLFxuICAgICAgICBwcmV2aWV3OiAnMy5wbmcnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpdGxlOiAn0KHQsNC50YIgNCDQp9C10YLRgNCy0LXRgNGC0YvQuSDRgdCw0LnRgicsXG4gICAgICAgIHNraWxsczogJ3BocCwgWWlpMicsXG4gICAgICAgIGxpbms6ICdodHRwOi8vc2l0ZTQuY29tJyxcbiAgICAgICAgcHJldmlldzogJzQucG5nJ1xuICAgIH1cbl07XG5cblxubGV0IHRlbXBsYXRlRWxlbWVudHMgPSB7XG4gICAgdGl0bGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbGlkZXItdGl0bGUnKSxcbiAgICBza2lsbHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbGlkZXItc2tpbGxzJyksXG4gICAgbGluazogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlci1saW5rJyksXG4gICAgcHJldmlldzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlci1wcmV2aWV3JyksXG4gICAgcHJldjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlci1wcmV2JyksXG4gICAgbmV4dDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlci1uZXh0JyksXG5cbn07XG5cblxuLyoqXG4gKiDQodC70LDQudC00LXRgCDRgdCw0LnRgtC+0LIg0L3QsCDRgdGC0YDQsNC90LjRhtC1IFdvcmtzXG4gKiDQn9C+0LvRg9GH0LDQtdC8INC00LDQvdC90YvQtSDQviDRgNCw0LHQvtGC0LDRhSDQv9C+INC30LDQv9GA0L7RgdGDIC93b3JrbGlzdFxuICpcbiAqL1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJC5nZXRKU09OKCBcIi93b3Jrc2xpc3RcIiwgZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgIGxldCBzbGlkZXJHb1VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlcl9fZ28tdXAnKTtcbiAgICAgICAgbGV0IHNsaWRlckdvRG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbGlkZXJfX2dvLWRvd24nKTtcblxuICAgICAgICBpZiAoc2xpZGVyR29VcCAmJiBzbGlkZXJHb0Rvd24pIHtcbiAgICAgICAgICAgIGxldCB3b3Jrc1NsaWRlciA9IG5ldyBXb3Jrc1NsaWRlcihkYXRhLndvcmtzLCB0ZW1wbGF0ZUVsZW1lbnRzKTtcbiAgICAgICAgICAgIHdvcmtzU2xpZGVyLmluaXQoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbGlkZXJfX2dvLXVwJykuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpPT4gd29ya3NTbGlkZXIubmV4dCgpKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbGlkZXJfX2dvLWRvd24nKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk9PiB3b3Jrc1NsaWRlci5uZXh0KCkpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuXG5cbi8qKlxuKiBIYW1idXJnZXIgYnV0dG9uIHRyYW5zZm9ybVxuKiBAdHlwZSB7RWxlbWVudH1cbiovXG5cbnZhciBoZXJvSGFtYnVyZ2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZXJvLWhhbWJ1cmdlclwiKTtcbnZhciBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVybGF5XCIpO1xuaWYgKGhlcm9IYW1idXJnZXIpIHtcbiAgICBoZXJvSGFtYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2hhbWJ1cmdlcl9hY3RpdmUnKTtcbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG4gICAgfSk7XG59XG5cbnZhciBzbGlkZU1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlLW1lbnVcIik7XG5pZiAoc2xpZGVNZW51KSB7XG4gICAgc2xpZGVNZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzbGlkZU1lbnUuY2xhc3NMaXN0LnRvZ2dsZSgnc2xpZGUtbWVudV9jb2xsYXBzZScpKTtcbn1cblxuLyoqXG4gKiDQotCw0LHRiyDQsiDQsNC00LzQuNC90LrQtVxuICovXG5cbiQoJy5hZG1pbl9fdGFicy1jb250cm9scy1saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgbGV0IGl0ZW0gPSAkKHRoaXMpLmNsb3Nlc3QoJy5hZG1pbl9fdGFicy1jb250cm9scy1pdGVtJyk7XG5cbiAgICBsZXQgY29udGVudEl0ZW0gPSAkKCcuYWRtaW5fX3RhYnMtaXRlbScpO1xuICAgIGxldCBpdGVtUG9zaXRpb24gPSBpdGVtLmluZGV4KCk7XG5cbiAgICBjb250ZW50SXRlbS5lcShpdGVtUG9zaXRpb24pXG4gICAgICAgIC5hZGRDbGFzcygnYWRtaW5fX3RhYnMtaXRlbV9hY3RpdmUnKVxuICAgICAgICAuc2libGluZ3MoKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FkbWluX190YWJzLWl0ZW1fYWN0aXZlJyk7XG5cbiAgICBpdGVtLmFkZENsYXNzKCdhZG1pbl9fdGFicy1jb250cm9scy1pdGVtX2FjdGl2ZScpXG4gICAgICAgIC5zaWJsaW5ncygpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWRtaW5fX3RhYnMtY29udHJvbHMtaXRlbV9hY3RpdmUnKTtcbn0pO1xuXG4kKCAnLmFkbWluLXRhYnNfX2ZpbGUtaW5wdXQnICkuZWFjaCggZnVuY3Rpb24oKVxue1xuICAgIHZhciAkaW5wdXRcdCA9ICQoIHRoaXMgKSxcbiAgICAgICAgJGxhYmVsXHQgPSAkaW5wdXQubmV4dCggJ2xhYmVsJyApLFxuICAgICAgICBsYWJlbFZhbCA9ICRsYWJlbC5odG1sKCk7XG5cbiAgICAkaW5wdXQub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggZSApXG4gICAge1xuICAgICAgICB2YXIgZmlsZU5hbWUgPSAnJztcblxuICAgICAgICBpZiggZS50YXJnZXQudmFsdWUgKVxuICAgICAgICAgICAgZmlsZU5hbWUgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCggJ1xcXFwnICkucG9wKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlTmFtZSk7XG5cbiAgICAgICAgaWYoIGZpbGVOYW1lIClcbiAgICAgICAgICAgICRsYWJlbC5odG1sKCBmaWxlTmFtZSApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAkbGFiZWwuaHRtbCggbGFiZWxWYWwgKTtcbiAgICB9KTtcblxuICAgIC8vIEZpcmVmb3ggYnVnIGZpeFxuICAgICRpbnB1dFxuICAgICAgICAub24oICdmb2N1cycsIGZ1bmN0aW9uKCl7ICRpbnB1dC5hZGRDbGFzcyggJ2hhcy1mb2N1cycgKTsgfSlcbiAgICAgICAgLm9uKCAnYmx1cicsIGZ1bmN0aW9uKCl7ICRpbnB1dC5yZW1vdmVDbGFzcyggJ2hhcy1mb2N1cycgKTsgfSk7XG59KTtcblxuXG5cbmZ1bmN0aW9uIHNlbmRBamF4SnNvbih1cmwsIGRhdGEsIGNiKSB7XG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNiKHJlc3VsdC5zdGF0dXMpO1xuICAgIH07XG4gICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG4vKipcbiAqIFNraWxsc1xuICovXG5jb25zdCBmb3JtU2tpbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkbWluLXNraWxscycpO1xuXG5pZiAoZm9ybVNraWxscykge1xuICAgIGZvcm1Ta2lsbHMuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgcHJlcGFyZVNlbmRQb3N0U2tpbGxzKTtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZVNlbmRQb3N0U2tpbGxzKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBsZXQgcmVzdWx0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkbWluLXRhYl9fc2tpbGxzLXN0YXR1cycpO1xuICAgIGxldCBza2lsbHNHcm91cHMgPSAkKCcuYWRtaW4tdGFic19fc2tpbGxzJyk7XG5cbiAgICBsZXQgZGF0YSA9IFtdO1xuICAgICQuZWFjaChza2lsbHNHcm91cHMsIGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSl7XG4gICAgICAgIGxldCBkYXRhSXRlbSA9IHt9O1xuICAgICAgICBkYXRhSXRlbS5pZCA9ICQodmFsdWUpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgbGV0IHNraWxsc0xpc3QgPSAkKCcuYWRtaW4tdGFic19fc2tpbGwtcm93JywgdmFsdWUpO1xuICAgICAgICBsZXQgc2tpbGxzID0ge307XG4gICAgICAgICQuZWFjaChza2lsbHNMaXN0LCBmdW5jdGlvbihpbmRleCwgdmFsdWUpe1xuICAgICAgICAgICAgbGV0IGlucHV0ID0gJCgnLmFkbWluLXRhYnNfX3RleHQtaW5wdXQnLCB2YWx1ZSk7XG4gICAgICAgICAgICBsZXQgaW5wdXROYW1lID0gJChpbnB1dCkuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSAkKGlucHV0KS52YWwoKTtcbiAgICAgICAgICAgIHNraWxsc1tpbnB1dE5hbWVdID0gaW5wdXRWYWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGF0YUl0ZW0uc2tpbGxzID0gc2tpbGxzO1xuICAgICAgICBkYXRhLnB1c2goZGF0YUl0ZW0pO1xuICAgIH0pO1xuXG4gICAgcmVzdWx0Q29udGFpbmVyLmlubmVySFRNTCA9ICdTZW5kaW5nLi4uJztcbiAgICBzZW5kQWpheEpzb24oJy9zZXRza2lsbHMnLCBkYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXN1bHRDb250YWluZXIuaW5uZXJIVE1MID0gZGF0YTtcbiAgICB9KTtcbn1cblxuXG4vKipcbiAqIEJsb2dcbiAqL1xuY29uc3QgZm9ybUJsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRtaW4tYmxvZycpO1xuXG5pZiAoZm9ybUJsb2cpIHtcbiAgICBmb3JtQmxvZy5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBwcmVwYXJlU2VuZFBvc3RCbG9nKTtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZVNlbmRQb3N0QmxvZyhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgbGV0IHJlc3VsdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZG1pbi10YWJfX2Jsb2ctc3RhdHVzJyk7XG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIHRpdGxlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmxvZy1pdGVtLW5hbWUnKS52YWx1ZSxcbiAgICAgICAgZGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jsb2ctaXRlbS1kYXRlJykudmFsdWUsXG4gICAgICAgIHRleHQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdibG9nLWl0ZW0tdGV4dCcpLnZhbHVlXG4gICAgfTtcbiAgICByZXN1bHRDb250YWluZXIuaW5uZXJIVE1MID0gJ1NlbmRpbmcuLi4nO1xuICAgIHNlbmRBamF4SnNvbignL2FkZHBvc3QnLCBkYXRhLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXN1bHRDb250YWluZXIuaW5uZXJIVE1MID0gZGF0YTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkbWluLWJsb2cnKS5yZXNldCgpO1xuICAgIH0pO1xufVxuXG5cbi8qKlxuICogINCX0LDQs9GA0YPQt9C60LAg0LrQsNGA0YLQuNC90L7QulxuICovXG5cbmNvbnN0IGZvcm1VcGxvYWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRtaW4td29ya3MnKTtcblxuZnVuY3Rpb24gZmlsZVVwbG9hZCh1cmwsIGRhdGEsIGNiKSB7XG4gICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcblxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY2IocmVzdWx0LnN0YXR1cyk7XG4gICAgfTtcblxuICAgIHhoci5zZW5kKGRhdGEpO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlU2VuZEZpbGUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgcmVzdWx0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkbWluLXRhYl9fd29ya3Mtc3RhdHVzJyk7XG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgbGV0IGZpbGUgPSBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcignI3dvcmtzLWltYWdlLXVwbG9hZCcpXG4gICAgICAgIC5maWxlc1swXTtcbiAgICBsZXQgdGl0bGUgPSBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcignI3dvcmtzLXRpdGxlJylcbiAgICAgICAgLnZhbHVlO1xuXG4gICAgbGV0IHNraWxscyA9IGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKCcjd29ya3Mtc2tpbGxzJylcbiAgICAgICAgLnZhbHVlO1xuXG4gICAgbGV0IGxpbmsgPSBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcignI3dvcmtzLWxpbmsnKVxuICAgICAgICAudmFsdWU7XG5cbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3Bob3RvJywgZmlsZSwgZmlsZS5uYW1lKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3RpdGxlJywgdGl0bGUpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnc2tpbGxzJywgc2tpbGxzKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2xpbmsnLCBsaW5rKTtcblxuICAgIHJlc3VsdENvbnRhaW5lci5pbm5lckhUTUwgPSAnVXBsb2FkaW5nLi4uJztcbiAgICBmaWxlVXBsb2FkKCcvdXBsb2FkJywgZm9ybURhdGEsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJlc3VsdENvbnRhaW5lci5pbm5lckhUTUwgPSBkYXRhO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRtaW4td29ya3MnKS5yZXNldCgpO1xuICAgICAgICAkKCcuYWRtaW5fX3RhYnNfX2ZpbGUtaW5wdXQtbGFiZWwnKS50ZXh0KCfQl9Cw0LPRgNGD0LfQuNGC0Ywg0LrQsNGA0YLQuNC90LrRgycpO1xuICAgIH0pO1xufVxuXG5pZiAoZm9ybVVwbG9hZCkge1xuICAgIGZvcm1VcGxvYWQuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgcHJlcGFyZVNlbmRGaWxlKTtcbn0iXX0=
