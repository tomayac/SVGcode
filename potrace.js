// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = function(status, toThrow) {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === 'object';
ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

var nodeFS;
var nodePath;

if (ENVIRONMENT_IS_NODE) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = require('path').dirname(scriptDirectory) + '/';
  } else {
    scriptDirectory = __dirname + '/';
  }

// include: node_shell_read.js


read_ = function shell_read(filename, binary) {
  var ret = tryParseAsDataURI(filename);
  if (ret) {
    return binary ? ret : ret.toString();
  }
  if (!nodeFS) nodeFS = require('fs');
  if (!nodePath) nodePath = require('path');
  filename = nodePath['normalize'](filename);
  return nodeFS['readFileSync'](filename, binary ? null : 'utf8');
};

readBinary = function readBinary(filename) {
  var ret = read_(filename, true);
  if (!ret.buffer) {
    ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
};

// end include: node_shell_read.js
  if (process['argv'].length > 1) {
    thisProgram = process['argv'][1].replace(/\\/g, '/');
  }

  arguments_ = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  process['on']('unhandledRejection', abort);

  quit_ = function(status) {
    process['exit'](status);
  };

  Module['inspect'] = function () { return '[Emscripten Module object]'; };

} else
if (ENVIRONMENT_IS_SHELL) {

  if (typeof read != 'undefined') {
    read_ = function shell_read(f) {
      var data = tryParseAsDataURI(f);
      if (data) {
        return intArrayToString(data);
      }
      return read(f);
    };
  }

  readBinary = function readBinary(f) {
    var data;
    data = tryParseAsDataURI(f);
    if (data) {
      return data;
    }
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit === 'function') {
    quit_ = function(status) {
      quit(status);
    };
  }

  if (typeof print !== 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console === 'undefined') console = /** @type{!Console} */({});
    console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
    console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr !== 'undefined' ? printErr : print);
  }

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document !== 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }

  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {

// include: web_or_worker_shell_read.js


  read_ = function(url) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
    } catch (err) {
      var data = tryParseAsDataURI(url);
      if (data) {
        return intArrayToString(data);
      }
      throw err;
    }
  };

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = function(url) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
      } catch (err) {
        var data = tryParseAsDataURI(url);
        if (data) {
          return data;
        }
        throw err;
      }
    };
  }

  readAsync = function(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      var data = tryParseAsDataURI(url);
      if (data) {
        onload(data.buffer);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };

// end include: web_or_worker_shell_read.js
  }

  setWindowTitle = function(title) { document.title = title };
} else
{
  throw new Error('environment detection error');
}

// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);

// Merge back in the overrides
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];
if (!Object.getOwnPropertyDescriptor(Module, 'arguments')) {
  Object.defineProperty(Module, 'arguments', {
    configurable: true,
    get: function() {
      abort('Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}

if (Module['thisProgram']) thisProgram = Module['thisProgram'];
if (!Object.getOwnPropertyDescriptor(Module, 'thisProgram')) {
  Object.defineProperty(Module, 'thisProgram', {
    configurable: true,
    get: function() {
      abort('Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}

if (Module['quit']) quit_ = Module['quit'];
if (!Object.getOwnPropertyDescriptor(Module, 'quit')) {
  Object.defineProperty(Module, 'quit', {
    configurable: true,
    get: function() {
      abort('Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] === 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] === 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] === 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] === 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] === 'undefined', 'Module.read option was removed (modify read_ in JS)');
assert(typeof Module['readAsync'] === 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] === 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] === 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
assert(typeof Module['TOTAL_MEMORY'] === 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');

if (!Object.getOwnPropertyDescriptor(Module, 'read')) {
  Object.defineProperty(Module, 'read', {
    configurable: true,
    get: function() {
      abort('Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}

if (!Object.getOwnPropertyDescriptor(Module, 'readAsync')) {
  Object.defineProperty(Module, 'readAsync', {
    configurable: true,
    get: function() {
      abort('Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}

if (!Object.getOwnPropertyDescriptor(Module, 'readBinary')) {
  Object.defineProperty(Module, 'readBinary', {
    configurable: true,
    get: function() {
      abort('Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}

if (!Object.getOwnPropertyDescriptor(Module, 'setWindowTitle')) {
  Object.defineProperty(Module, 'setWindowTitle', {
    configurable: true,
    get: function() {
      abort('Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';




var STACK_ALIGN = 16;

function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
  return Math.ceil(size / factor) * factor;
}

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length-1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = Number(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}

// include: runtime_functions.js


// Wraps a JS function as a wasm function with a given signature.
function convertJsFunctionToWasm(func, sig) {

  // If the type reflection proposal is available, use the new
  // "WebAssembly.Function" constructor.
  // Otherwise, construct a minimal wasm module importing the JS function and
  // re-exporting it.
  if (typeof WebAssembly.Function === "function") {
    var typeNames = {
      'i': 'i32',
      'j': 'i64',
      'f': 'f32',
      'd': 'f64'
    };
    var type = {
      parameters: [],
      results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
    };
    for (var i = 1; i < sig.length; ++i) {
      type.parameters.push(typeNames[sig[i]]);
    }
    return new WebAssembly.Function(type, func);
  }

  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSection = [
    0x01, // id: section,
    0x00, // length: 0 (placeholder)
    0x01, // count: 1
    0x60, // form: func
  ];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  // Write the overall length of the type section back into the section header
  // (excepting the 2 bytes for the section id and length)
  typeSection[1] = typeSection.length - 2;

  // Rest of the module is static
  var bytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
  ].concat(typeSection, [
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  ]));

   // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    'e': {
      'f': func
    }
  });
  var wrappedFunc = instance.exports['f'];
  return wrappedFunc;
}

var freeTableIndexes = [];

// Weak map of functions in the table to their indexes, created on first use.
var functionsInTableMap;

function getEmptyTableSlot() {
  // Reuse a free index if there is one, otherwise grow.
  if (freeTableIndexes.length) {
    return freeTableIndexes.pop();
  }
  // Grow the table
  try {
    wasmTable.grow(1);
  } catch (err) {
    if (!(err instanceof RangeError)) {
      throw err;
    }
    throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
  }
  return wasmTable.length - 1;
}

// Add a wasm function to the table.
function addFunctionWasm(func, sig) {
  // Check if the function is already in the table, to ensure each function
  // gets a unique index. First, create the map if this is the first use.
  if (!functionsInTableMap) {
    functionsInTableMap = new WeakMap();
    for (var i = 0; i < wasmTable.length; i++) {
      var item = wasmTable.get(i);
      // Ignore null values.
      if (item) {
        functionsInTableMap.set(item, i);
      }
    }
  }
  if (functionsInTableMap.has(func)) {
    return functionsInTableMap.get(func);
  }

  // It's not in the table, add it now.

  var ret = getEmptyTableSlot();

  // Set the new value.
  try {
    // Attempting to call this with JS function will cause of table.set() to fail
    wasmTable.set(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    assert(typeof sig !== 'undefined', 'Missing signature argument to addFunction: ' + func);
    var wrapped = convertJsFunctionToWasm(func, sig);
    wasmTable.set(ret, wrapped);
  }

  functionsInTableMap.set(func, ret);

  return ret;
}

function removeFunction(index) {
  functionsInTableMap.delete(wasmTable.get(index));
  freeTableIndexes.push(index);
}

// 'sig' parameter is required for the llvm backend but only when func is not
// already a WebAssembly function.
function addFunction(func, sig) {
  assert(typeof func !== 'undefined');

  return addFunctionWasm(func, sig);
}

// end include: runtime_functions.js
// include: runtime_debug.js


// end include: runtime_debug.js
function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

var tempRet0 = 0;

var setTempRet0 = function(value) {
  tempRet0 = value;
};

var getTempRet0 = function() {
  return tempRet0;
};

function getCompilerSetting(name) {
  throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work';
}



// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
if (!Object.getOwnPropertyDescriptor(Module, 'wasmBinary')) {
  Object.defineProperty(Module, 'wasmBinary', {
    configurable: true,
    get: function() {
      abort('Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}
var noExitRuntime = Module['noExitRuntime'] || true;
if (!Object.getOwnPropertyDescriptor(Module, 'noExitRuntime')) {
  Object.defineProperty(Module, 'noExitRuntime', {
    configurable: true,
    get: function() {
      abort('Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}

if (typeof WebAssembly !== 'object') {
  abort('no native wasm support detected');
}

// include: runtime_safe_heap.js


// In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
// In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

/** @param {number} ptr
    @param {number} value
    @param {string} type
    @param {number|boolean=} noSafe */
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)] = value; break;
      case 'i8': HEAP8[((ptr)>>0)] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)] = tempI64[0],HEAP32[(((ptr)+(4))>>2)] = tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @param {number} ptr
    @param {string} type
    @param {number|boolean=} noSafe */
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}

// end include: runtime_safe_heap.js
// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

// C calling interface.
/** @param {string|null=} returnType
    @param {Array=} argTypes
    @param {Arguments|Array=} args
    @param {Object=} opts */
function ccall(ident, returnType, argTypes, args, opts) {
  // For fast lookup of conversion functions
  var toC = {
    'string': function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    'array': function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };

  function convertReturnValue(ret) {
    if (returnType === 'string') return UTF8ToString(ret);
    if (returnType === 'boolean') return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== 'array', 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);

  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}

/** @param {string=} returnType
    @param {Array=} argTypes
    @param {Object=} opts */
function cwrap(ident, returnType, argTypes, opts) {
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
function _malloc() {
  abort("malloc() called but not included in the build - add '_malloc' to EXPORTED_FUNCTIONS");
}
function _free() {
  // Show a helpful error since we used to include free by default in the past.
  abort("free() called but not included in the build - add '_free' to EXPORTED_FUNCTIONS");
}

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data.
// @allocator: How to allocate memory, see ALLOC_*
/** @type {function((Uint8Array|Array<number>), number)} */
function allocate(slab, allocator) {
  var ret;
  assert(typeof allocator === 'number', 'allocate no longer takes a type argument')
  assert(typeof slab !== 'number', 'allocate no longer takes a number as arg0')

  if (allocator == ALLOC_STACK) {
    ret = stackAlloc(slab.length);
  } else {
    ret = abort('malloc was not included, but is needed in allocate. Adding "_malloc" to EXPORTED_FUNCTIONS should fix that. This may be a bug in the compiler, please file an issue.');;
  }

  if (slab.subarray || slab.slice) {
    HEAPU8.set(/** @type {!Uint8Array} */(slab), ret);
  } else {
    HEAPU8.set(new Uint8Array(slab), ret);
  }
  return ret;
}

// include: runtime_strings.js


// runtime_strings.js: Strings related runtime functions that are part of both MINIMAL_RUNTIME and regular runtime.

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    var str = '';
    // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    while (idx < endPtr) {
      // For UTF8 byte structure, see:
      // http://en.wikipedia.org/wiki/UTF-8#Description
      // https://www.ietf.org/rfc/rfc2279.txt
      // https://tools.ietf.org/html/rfc3629
      var u0 = heap[idx++];
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      var u1 = heap[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      var u2 = heap[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }

      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
  return str;
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 0xC0 | (u >> 6);
      heap[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 0xE0 | (u >> 12);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      if (u >= 0x200000) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x1FFFFF).');
      heap[outIdx++] = 0xF0 | (u >> 18);
      heap[outIdx++] = 0x80 | ((u >> 12) & 63);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) ++len;
    else if (u <= 0x7FF) len += 2;
    else if (u <= 0xFFFF) len += 3;
    else len += 4;
  }
  return len;
}

// end include: runtime_strings.js
// include: runtime_strings_extra.js


// runtime_strings_extra.js: Strings related runtime functions that are available only in regular runtime.

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAPU8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

function UTF16ToString(ptr, maxBytesToRead) {
  assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  var maxIdx = idx + maxBytesToRead / 2;
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var str = '';

    // If maxBytesToRead is not passed explicitly, it will be undefined, and the for-loop's condition
    // will always evaluate to true. The loop is then terminated on the first null char.
    for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) break;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }

    return str;
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)] = codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)] = 0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr, maxBytesToRead) {
  assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
  var i = 0;

  var str = '';
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(i >= maxBytesToRead / 4)) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0) break;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
  return str;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)] = codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)] = 0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = abort('malloc was not included, but is needed in allocateUTF8. Adding "_malloc" to EXPORTED_FUNCTIONS should fix that. This may be a bug in the compiler, please file an issue.');;
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated
    @param {boolean=} dontAddNull */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
  HEAP8.set(array, buffer);
}

/** @param {boolean=} dontAddNull */
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[((buffer++)>>0)] = str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)] = 0;
}

// end include: runtime_strings_extra.js
// Memory management

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP,
/** @type {ArrayBuffer} */
  buffer,
/** @type {Int8Array} */
  HEAP8,
/** @type {Uint8Array} */
  HEAPU8,
/** @type {Int16Array} */
  HEAP16,
/** @type {Uint16Array} */
  HEAPU16,
/** @type {Int32Array} */
  HEAP32,
/** @type {Uint32Array} */
  HEAPU32,
/** @type {Float32Array} */
  HEAPF32,
/** @type {Float64Array} */
  HEAPF64;

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var TOTAL_STACK = 5242880;
if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime')

var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;
if (!Object.getOwnPropertyDescriptor(Module, 'INITIAL_MEMORY')) {
  Object.defineProperty(Module, 'INITIAL_MEMORY', {
    configurable: true,
    get: function() {
      abort('Module.INITIAL_MEMORY has been replaced with plain INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)')
    }
  });
}

assert(INITIAL_MEMORY >= TOTAL_STACK, 'INITIAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
       'JS engine does not provide full typed array support');

// If memory is defined in wasm, the user can't provide it.
assert(!Module['wasmMemory'], 'Use of `wasmMemory` detected.  Use -s IMPORTED_MEMORY to define wasmMemory externally');
assert(INITIAL_MEMORY == 16777216, 'Detected runtime INITIAL_MEMORY setting.  Use -s IMPORTED_MEMORY to define wasmMemory dynamically');

// include: runtime_init_table.js
// In regular non-RELOCATABLE mode the table is exported
// from the wasm module and this will be assigned once
// the exports are available.
var wasmTable;

// end include: runtime_init_table.js
// include: runtime_stack_check.js


// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // The stack grows downwards
  HEAPU32[(max >> 2)+1] = 0x2135467;
  HEAPU32[(max >> 2)+2] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAP32[0] = 0x63736d65; /* 'emsc' */
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  var cookie1 = HEAPU32[(max >> 2)+1];
  var cookie2 = HEAPU32[(max >> 2)+2];
  if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x' + cookie2.toString(16) + ' ' + cookie1.toString(16));
  }
  // Also test the global address 0 for integrity.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
}

// end include: runtime_stack_check.js
// include: runtime_assertions.js


// Endianness check (note: assumes compiler arch was little-endian)
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';
})();

function abortFnPtrError(ptr, sig) {
	abort("Invalid function pointer " + ptr + " called with signature '" + sig + "'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this). Build with ASSERTIONS=2 for more info.");
}

// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;
var runtimeExited = false;

__ATINIT__.push({ func: function() { ___wasm_call_ctors() } });

function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  checkStackCookie();
  assert(!runtimeInitialized);
  runtimeInitialized = true;


  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();

  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  checkStackCookie();
  runtimeExited = true;
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');

// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err('dependency: ' + dep);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data

/** @param {string|number=} what */
function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what += '';
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  var output = 'abort(' + what + ') at ' + stackTrace();
  what = output;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  var e = new WebAssembly.RuntimeError(what);

  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// {{MEM_INITIALIZER}}

// include: memoryprofiler.js


// end include: memoryprofiler.js
// show errors on likely calls to FS when it was not included
var FS = {
  error: function() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1');
  },
  init: function() { FS.error() },
  createDataFile: function() { FS.error() },
  createPreloadedFile: function() { FS.error() },
  createLazyFile: function() { FS.error() },
  open: function() { FS.error() },
  mkdev: function() { FS.error() },
  registerDevice: function() { FS.error() },
  analyzePath: function() { FS.error() },
  loadFilesFromDB: function() { FS.error() },

  ErrnoError: function ErrnoError() { FS.error() },
};
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

// include: URIUtils.js


function hasPrefix(str, prefix) {
  return String.prototype.startsWith ?
      str.startsWith(prefix) :
      str.indexOf(prefix) === 0;
}

// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  return hasPrefix(filename, dataURIPrefix);
}

var fileURIPrefix = "file://";

// Indicates whether filename is delivered via file protocol (as opposed to http/https)
function isFileURI(filename) {
  return hasPrefix(filename, fileURIPrefix);
}

// end include: URIUtils.js
function createExportWrapper(name, fixedasm) {
  return function() {
    var displayName = name;
    var asm = fixedasm;
    if (!fixedasm) {
      asm = Module['asm'];
    }
    assert(runtimeInitialized, 'native function `' + displayName + '` called before runtime initialization');
    assert(!runtimeExited, 'native function `' + displayName + '` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    if (!asm[name]) {
      assert(asm[name], 'exported native function `' + displayName + '` not found');
    }
    return asm[name].apply(null, arguments);
  };
}

var wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAAB74GAgAAiYAF/AX9gAn9/AX9gA39/fwF/YAF/AGACf38AYAABf2ADf39/AGAEf39/fwF/YAV/f39/fwF/YAN/fn8BfmAAAGAEf39/fwBgBX9/f39/AGACf38BfGADf39/AXxgBH9+fn8AYAN/fHwAYAZ/fH9/f38Bf2ACfn8Bf2AEf39/fwF8YAJ/fABgBH98f38AYAZ/fH9/f38AYAZ/f39/f38Bf2AHf39/f39/fwF/YAd/f39/fH9/AX9gBH9+f38Bf2ACf3wBf2ADfn9/AX9gAXwBfmAEf39+fwF+YAZ/f39/f38BfGACfn4BfGACfH8BfAK8gYCAAAcDZW52BGV4aXQAAxZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAAWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAHA2VudhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwAAADZW52FWVtc2NyaXB0ZW5fbWVtY3B5X2JpZwACA2VudgtzZXRUZW1wUmV0MAADFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAIA5OBgIAAkQEKBwsHBgYGDAQEBgUDAwMBBAIAAwIIBAQDAQECCwQEBAABABcBAwQBAAEDAQAAAAADFBsBAQIBDgwNFQ0OGQYNExMfFg4QEAUBAAEBAQkCAAkAAAAAAgIFCgAhCBgGAAscEhIMAhEEHQIABwIDAAEBAgECAwMABQ8gDwADAQEBBAACAgACAAMACgUFBQMAHggaBIWAgIAAAXABCgoFh4CAgAABAYACgIACBpOAgIAAA38BQdDKwAILfwFBAAt/AUEACwfrgYCAAA0GbWVtb3J5AgARX193YXNtX2NhbGxfY3RvcnMABwZmZmx1c2gAWBBfX2Vycm5vX2xvY2F0aW9uAE4Fc3RhcnQAKhlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQAJc3RhY2tTYXZlAJIBDHN0YWNrUmVzdG9yZQCTAQpzdGFja0FsbG9jAJQBFWVtc2NyaXB0ZW5fc3RhY2tfaW5pdACPARllbXNjcmlwdGVuX3N0YWNrX2dldF9mcmVlAJABGGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2VuZACRAQxkeW5DYWxsX2ppamkAlgEJj4CAgAABAEEB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dCBtIHRqIXUgdSgCACF2IAMoAvQBIXcgAygC7AEheEEDIXkgeCB5dCF6IHcgemoheyB7KAIAIXwgdiB8ayF9QQMhfiB9IH5sIX9BAyGAASB/IIABaiGBASADKAL0ASGCASADKALsASGDAUEBIYQBIIMBIIQBaiGFASADKALwASGGASCFASCGARA6IYcBQQMhiAEghwEgiAF0IYkBIIIBIIkBaiGKASCKASgCBCGLASADKAL0ASGMASADKALsASGNAUEDIY4BII0BII4BdCGPASCMASCPAWohkAEgkAEoAgQhkQEgiwEgkQFrIZIBIIEBIJIBaiGTAUECIZQBIJMBIJQBbSGVASADIJUBNgLMASADKALMASGWAUHQASGXASADIJcBaiGYASCYASGZAUECIZoBIJYBIJoBdCGbASCZASCbAWohnAEgnAEoAgAhnQFBASGeASCdASCeAWohnwEgnAEgnwE2AgBBACGgASADIKABNgKwAUEAIaEBIAMgoQE2ArQBQQAhogEgAyCiATYCuAFBACGjASADIKMBNgK8ASADKAKYASGkASADKALsASGlAUECIaYBIKUBIKYBdCGnASCkASCnAWohqAEgqAEoAgAhqQEgAyCpATYC5AEgAygC7AEhqgEgAyCqATYC4AECQAJAA0AgAygC9AEhqwEgAygC5AEhrAFBAyGtASCsASCtAXQhrgEgqwEgrgFqIa8BIK8BKAIAIbABIAMoAvQBIbEBIAMoAuABIbIBQQMhswEgsgEgswF0IbQBILEBILQBaiG1ASC1ASgCACG2ASCwASC2AWshtwFBACG4ASC3ASG5ASC4ASG6ASC5ASC6AUohuwFBASG8ASC7ASC8AXEhvQECQAJAIL0BRQ0AQQEhvgEgvgEhvwEMAQsgAygC9AEhwAEgAygC5AEhwQFBAyHCASDBASDCAXQhwwEgwAEgwwFqIcQBIMQBKAIAIcUBIAMoAvQBIcYBIAMoAuABIccBQQMhyAEgxwEgyAF0IckBIMYBIMkBaiHKASDKASgCACHLASDFASDLAWshzAFBACHNASDMASHOASDNASHPASDOASDPAUgh0AFBfyHRAUEAIdIBQQEh0wEg0AEg0wFxIdQBINEBINIBINQBGyHVASDVASG/AQsgvwEh1gFBAyHXASDWASDXAWwh2AFBAyHZASDYASDZAWoh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IAVB0ABqIAVBoAFqIAMgBBBjIQEgB0UNACAAQQBBACAAKAIkEQIAGiAAQQA2AjAgACAHNgIsIABBADYCHCAAQQA2AhAgACgCFCEDIABBADYCFCABQX8gAxshAQsgACAAKAIAIgMgBnI2AgBBfyABIANBIHEbIQEgAkUNACAAEI0BCyAFQdABaiQAIAELixICD38BfiMAQdAAayIHJAAgByABNgJMIAdBN2ohCCAHQThqIQlBACEKQQAhC0EAIQECQANAAkAgC0EASA0AAkAgAUH/////ByALa0wNABBOQT02AgBBfyELDAELIAEgC2ohCwsgBygCTCIMIQECQAJAAkACQAJAIAwtAAAiDUUNAANAAkACQAJAIA1B/wFxIg0NACABIQ0MAQsgDUElRw0BIAEhDQNAIAEtAAFBJUcNASAHIAFBAmoiDjYCTCANQQFqIQ0gAS0AAiEPIA4hASAPQSVGDQALCyANIAxrIQECQCAARQ0AIAAgDCABEGQLIAENByAHKAJMLAABEGAhASAHKAJMIQ0CQAJAIAFFDQAgDS0AAkEkRw0AIA1BA2ohASANLAABQVBqIRBBASEKDAELIA1BAWohAUF/IRALIAcgATYCTEEAIRECQAJAIAEsAAAiD0FgaiIOQR9NDQAgASENDAELQQAhESABIQ1BASAOdCIOQYnRBHFFDQADQCAHIAFBAWoiDTYCTCAOIBFyIREgASwAASIPQWBqIg5BIE8NASANIQFBASAOdCIOQYnRBHENAAsLAkACQCAPQSpHDQACQAJAIA0sAAEQYEUNACAHKAJMIg0tAAJBJEcNACANLAABQQJ0IARqQcB+akEKNgIAIA1BA2ohASANLAABQQN0IANqQYB9aigCACESQQEhCgwBCyAKDQZBACEKQQAhEgJAIABFDQAgAiACKAIAIgFBBGo2AgAgASgCACESCyAHKAJMQQFqIQELIAcgATYCTCASQX9KDQFBACASayESIBFBgMAAciERDAELIAdBzABqEGUiEkEASA0EIAcoAkwhAQtBfyETAkAgAS0AAEEuRw0AAkAgAS0AAUEqRw0AAkAgASwAAhBgRQ0AIAcoAkwiAS0AA0EkRw0AIAEsAAJBAnQgBGpBwH5qQQo2AgAgASwAAkEDdCADakGAfWooAgAhEyAHIAFBBGoiATYCTAwCCyAKDQUCQAJA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IABBAWohACACQX9qIgJBAEchAyACRQ0BIABBA3ENAAsLIANFDQELAkAgAC0AACABQf8BcUYNACACQQRJDQAgAUH/AXFBgYKECGwhBANAIAAoAgAgBHMiA0F/cyADQf/9+3dqcUGAgYKEeHENASAAQQRqIQAgAkF8aiICQQNLDQALCyACRQ0AIAFB/wFxIQMDQAJAIAAtAAAgA0cNACAADwsgAEEBaiEAIAJBf2oiAg0ACwtBAAsUAAJAIAANAEEADwsgACABQQAQeQuhAgEBf0EBIQMCQAJAIABFDQAgAUH/AE0NAQJAAkAQfSgCrAEoAgANACABQYB/cUGAvwNGDQMQTkEZNgIADAELAkAgAUH/D0sNACAAIAFBP3FBgAFyOgABIAAgAUEGdkHAAXI6AABBAg8LAkACQCABQYCwA0kNACABQYBAcUGAwANHDQELIAAgAUE/cUGAAXI6AAIgACABQQx2QeABcjoAACAAIAFBBnZBP3FBgAFyOgABQQMPCwJAIAFBgIB8akH//z9LDQAgACABQT9xQYABcjoAAyAAIAFBEnZB8AFyOgAAIAAgAUEGdkE/cUGAAXI6AAIgACABQQx2QT9xQYABcjoAAUEEDwsQTkEZNgIAC0F/IQMLIAMPCyAAIAE6AABBAQsCAAsCAAsVAAJAIAANAEEADwsQTiAANgIAQX8LBQBBgCQLUwEBfgJAAkAgA0HAAHFFDQAgAiADQUBqrYghAUIAIQIMAQsgA0UNACACQcAAIANrrYYgASADrSIEiIQhASACIASIIQILIAAgATcDACAAIAI3AwgL6QMCAn8CfiMAQSBrIgIkAAJAAkAgAUL///////////8AgyIEQoCAgICAgMD/Q3wgBEKAgICAgIDAgLx/fFoNACAAQjyIIAFCBIaEIQQCQCAAQv//////////D4MiAEKBgICAgICAgAhUDQAgBEKBgICAgICAgMAAfCEFDAILIARCgICAgICAgIDAAHwhBSAAQoCAgICAgICACIVCAFINASAFIARCAYN8IQUMAQsCQCAAUCAEQoCAgICAgMD//wBUIARCgICAgICAwP//AFEbDQAgAEI8iCABQgSGhEL/////////A4NCgICAgICAgPz/AIQhBQwBC0KAgICAgICA+P8AIQUgBEL///////+//8MAVg0AQgAhBSAEQjCIpyID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bGFyZ2UgZm9yIGRhdGEgdHlwZQBObyBzcGFjZSBsZWZ0IG9uIGRldmljZQBPdXQgb2YgbWVtb3J5AFJlc291cmNlIGJ1c3kASW50ZXJydXB0ZWQgc3lzdGVtIGNhbGwAUmVzb3VyY2UgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGUASW52YWxpZCBzZWVrAENyb3NzLWRldmljZSBsaW5rAFJlYWQtb25seSBmaWxlIHN5c3RlbQBEaXJlY3Rvcnkgbm90IGVtcHR5AENvbm5lY3Rpb24gcmVzZXQgYnkgcGVlcgBPcGVyYXRpb24gdGltZWQgb3V0AENvbm5lY3Rpb24gcmVmdXNlZABIb3N0IGlzIGRvd24ASG9zdCBpcyB1bnJlYWNoYWJsZQBBZGRyZXNzIGluIHVzZQBCcm9rZW4gcGlwZQBJL08gZXJyb3IATm8gc3VjaCBkZXZpY2Ugb3IgYWRkcmVzcwBCbG9jayBkZXZpY2UgcmVxdWlyZWQATm8gc3VjaCBkZXZpY2UATm90IGEgZGlyZWN0b3J5AElzIGEgZGlyZWN0b3J5AFRleHQgZmlsZSBidXN5AEV4ZWMgZm9ybWF0IGVycm9yAEludmFsaWQgYXJndW1lbnQAQXJndW1lbnQgbGlzdCB0b28gbG9uZwBTeW1ib2xpYyBsaW5rIGxvb3AARmlsZW5hbWUgdG9vIGxvbmcAVG9vIG1hbnkgb3BlbiBmaWxlcyBpbiBzeXN0ZW0ATm8gZmlsZSBkZXNjcmlwdG9ycyBhdmFpbGFibGUAQmFkIGZpbGUgZGVzY3JpcHRvcgBObyBjaGlsZCBwcm9jZXNzAEJhZCBhZGRyZXNzAEZpbGUgdG9vIGxhcmdlAFRvbyBtYW55IGxpbmtzAE5vIGxvY2tzIGF2YWlsYWJsZQBSZXNvdXJjZSBkZWFkbG9jayB3b3VsZCBvY2N1cgBTdGF0ZSBub3QgcmVjb3ZlcmFibGUAUHJldmlvdXMgb3duZXIgZGllZABPcGVyYXRpb24gY2FuY2VsZWQARnVuY3Rpb24gbm90IGltcGxlbWVudGVkAE5vIG1lc3NhZ2Ugb2YgZGVzaXJlZCB0eXBlAElkZW50aWZpZXIgcmVtb3ZlZABEZXZpY2Ugbm90IGEgc3RyZWFtAE5vIGRhdGEgYXZhaWxhYmxlAERldmljZSB0aW1lb3V0AE91dCBvZiBzdHJlYW1zIHJlc291cmNlcwBMaW5rIGhhcyBiZWVuIHNldmVyZWQAUHJvdG9jb2wgZXJyb3IAQmFkIG1lc3NhZ2UARmlsZSBkZXNjcmlwdG9yIGluIGJhZCBzdGF0ZQBOb3QgYSBzb2NrZXQARGVzdGluYXRpb24gYWRkcmVzcyByZXF1aXJlZABNZXNzYWdlIHRvbyBsYXJnZQBQcm90b2NvbCB3cm9uZyB0eXBlIGZvciBzb2NrZXQAUHJvdG9jb2wgbm90IGF2YWlsYWJsZQBQcm90b2NvbCBub3Qgc3VwcG9ydGVkAFNvY2tldCB0eXBlIG5vdCBzdXBwb3J0ZWQATm90IHN1cHBvcnRlZABQcm90b2NvbCBmYW1pbHkgbm90IHN1cHBvcnRlZABBZGRyZXNzIGZhbWlseSBub3Qgc3VwcG9ydGVkIGJ5IHByb3RvY29sAEFkZHJlc3Mgbm90IGF2YWlsYWJsZQBOZXR3b3JrIGlzIGRvd24ATmV0d29yayB1bnJlYWNoYWJsZQBDb25uZWN0aW9uIHJlc2V0IGJ5IG5ldHdvcmsAQ29ubmVjdGlvbiBhYm9ydGVkAE5vIGJ1ZmZlciBzcGFjZSBhdmFpbGFibGUAU29ja2V0IGlzIGNvbm5lY3RlZABTb2NrZXQgbm90IGNvbm5lY3RlZABDYW5ub3Qgc2VuZCBhZnRlciBzb2NrZXQgc2h1dGRvd24AT3BlcmF0aW9uIGFscmVhZHkgaW4gcHJvZ3Jlc3MAT3BlcmF0aW9uIGluIHByb2dyZXNzAFN0YWxlIGZpbGUgaGFuZGxlAFJlbW90ZSBJL08gZXJyb3IAUXVvdGEgZXhjZWVkZWQATm8gbWVkaXVtIGZvdW5kAFdyb25nIG1lZGl1bSB0eXBlAE5vIGVycm9yIGluZm9ybWF0aW9uAABwEQAALSsgICAwWDB4AChudWxsKQAAAAAAAAAAAAAAAAAAAAARAAoAERERAAAAAAUAAAAAAAAJAAAAAAsAAAAAAAAAABEADwoREREDCgcAAQAJCwsAAAkGCwAACwAGEQAAABEREQAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAARAAoKERERAAoAAAIACQsAAAAJAAsAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAADAAAAAAMAAAAAAkMAAAAAAAMAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAA0AAAAEDQAAAAAJDgAAAAAADgAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAPAAAAAA8AAAAACRAAAAAAABAAABAAABIAAAASEhIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAAABISEgAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAAoAAAAACgAAAAAJCwAAAAAACwAACwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAMAAAAAAwAAAAACQwAAAAAAAwAAAwAADAxMjM0NTY3ODlBQkNERUYtMFgrMFggMFgtMHgrMHggMHgAaW5mAElORgBuYW4ATkFOAC4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHoIguAAwEAAAAAAAAABQAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAMAAAAMIwAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUCVQAA==';
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinary(file) {
  try {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    var binary = tryParseAsDataURI(file);
    if (binary) {
      return binary;
    }
    if (readBinary) {
      return readBinary(file);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  // If we don't have the binary yet, try to to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch === 'function'
      && !isFileURI(wasmBinaryFile)
    ) {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(function () {
          return getBinary(wasmBinaryFile);
      });
    }
    else {
      if (readAsync) {
        // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
        return new Promise(function(resolve, reject) {
          readAsync(wasmBinaryFile, function(response) { resolve(new Uint8Array(/** @type{!ArrayBuffer} */(response))) }, reject)
        });
      }
    }
  }

  // Otherwise, getBinary should be able to get it synchronously
  return Promise.resolve().then(function() { return getBinary(wasmBinaryFile); });
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg,
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    var exports = instance.exports;

    Module['asm'] = exports;

    wasmMemory = Module['asm']['memory'];
    assert(wasmMemory, "memory not found in wasm exports");
    // This assertion doesn't hold when emscripten is run in --post-link
    // mode.
    // TODO(sbc): Read INITIAL_MEMORY out of the wasm file in post-link mode.
    //assert(wasmMemory.buffer.byteLength === 16777216);
    updateGlobalBufferAndViews(wasmMemory.buffer);

    wasmTable = Module['asm']['__indirect_function_table'];
    assert(wasmTable, "table not found in wasm exports");

    removeRunDependency('wasm-instantiate');
  }
  // we can't run yet (except in a pthread, where we have a custom sync instantiator)
  addRunDependency('wasm-instantiate');

  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiatedSource(output) {
    // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    receiveInstance(output['instance']);
  }

  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);

      // Warn on some common problems.
      if (isFileURI(wasmBinaryFile)) {
        err('warning: Loading from a file URI (' + wasmBinaryFile + ') is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing');
      }
      abort(reason);
    });
  }

  // Prefer streaming instantiation if available.
  function instantiateAsync() {
    if (!wasmBinary &&
        typeof WebAssembly.instantiateStreaming === 'function' &&
        !isDataURI(wasmBinaryFile) &&
        // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
        !isFileURI(wasmBinaryFile) &&
        typeof fetch === 'function') {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
        var result = WebAssembly.instantiateStreaming(response, info);
        return result.then(receiveInstantiatedSource, function(reason) {
            // We expect the most common failure cause to be a bad MIME type for the binary,
            // in which case falling back to ArrayBuffer instantiation should work.
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            return instantiateArrayBuffer(receiveInstantiatedSource);
          });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiatedSource);
    }
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
  // to any other async startup actions they are performing.
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
      return false;
    }
  }

  instantiateAsync();
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// === Body ===

var ASM_CONSTS = {

};






  function callRuntimeCallbacks(callbacks) {
      while(callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == 'function') {
          callback(Module); // Pass the module as the first argument.
          continue;
        }
        var func = callback.func;
        if (typeof func === 'number') {
          if (callback.arg === undefined) {
            wasmTable.get(func)();
          } else {
            wasmTable.get(func)(callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }

  function demangle(func) {
      warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
      return func;
    }

  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
    }

  function jsStackTrace() {
      var error = new Error();
      if (!error.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
          throw new Error();
        } catch(e) {
          error = e;
        }
        if (!error.stack) {
          return '(no stack trace available)';
        }
      }
      return error.stack.toString();
    }

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return demangleAll(js);
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

  function _emscripten_get_heap_size() {
      return HEAPU8.length;
    }

  function emscripten_realloc_buffer(size) {
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16); // .grow() takes a delta compared to the previous size
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1 /*success*/;
      } catch(e) {
        console.error('emscripten_realloc_buffer: Attempted to grow heap from ' + buffer.byteLength  + ' bytes to ' + size + ' bytes, but got error: ' + e);
      }
      // implicit 0 return to save code size (caller will cast "undefined" into 0
      // anyhow)
    }
  function _emscripten_resize_heap(requestedSize) {
      var oldSize = _emscripten_get_heap_size();
      // With pthreads, races can happen (another thread might increase the size in between), so return a failure, and let the caller retry.
      assert(requestedSize > oldSize);

      // Memory resize rules:
      // 1. Always increase heap size to at least the requested size, rounded up to next page multiple.
      // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap geometrically: increase the heap size according to
      //                                         MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%),
      //                                         At most overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
      // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap linearly: increase the heap size by at least MEMORY_GROWTH_LINEAR_STEP bytes.
      // 3. Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
      // 4. If we were unable to allocate as much memory, it may be due to over-eager decision to excessively reserve due to (3) above.
      //    Hence if an allocation fails, cut down on the amount of excess growth, in an attempt to succeed to perform a smaller allocation.

      // A limit was set for how much we can grow. We should not exceed that
      // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
      // In CAN_ADDRESS_2GB mode, stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate full 4GB Wasm memories, the size will wrap
      // back to 0 bytes in Wasm side for any code that deals with heap sizes, which would require special casing all heap size related code to treat
      // 0 specially.
      var maxHeapSize = 2147483648;
      if (requestedSize > maxHeapSize) {
        err('Cannot enlarge memory, asked to go up to ' + requestedSize + ' bytes, but the limit is ' + maxHeapSize + ' bytes!');
        return false;
      }

      // Loop through potential heap size increases. If we attempt a too eager reservation that fails, cut down on the
      // attempted size and reserve a smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
      for(var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
        // but limit overreserving (default to capping at +96MB overgrowth at most)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );

        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));

        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {

          return true;
        }
      }
      err('Failed to grow the heap from ' + oldSize + ' bytes to ' + newSize + ' bytes, not enough memory!');
      return false;
    }

  function _exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      exit(status);
    }

  var SYSCALLS={mappings:{},buffers:[null,[],[]],printChar:function(stream, curr) {
        var buffer = SYSCALLS.buffers[stream];
        assert(buffer);
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      },varargs:undefined,get:function() {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },get64:function(low, high) {
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      }};
  function _fd_close(fd) {
      abort('it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM');
      return 0;
    }

  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  abort('it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM');
  }

  function flush_NO_FILESYSTEM() {
      // flush anything remaining in the buffers during shutdown
      if (typeof _fflush !== 'undefined') _fflush(0);
      var buffers = SYSCALLS.buffers;
      if (buffers[1].length) SYSCALLS.printChar(1, 10);
      if (buffers[2].length) SYSCALLS.printChar(2, 10);
    }
  function _fd_write(fd, iov, iovcnt, pnum) {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[(((iov)+(i*8))>>2)];
        var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
        for (var j = 0; j < len; j++) {
          SYSCALLS.printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAP32[((pnum)>>2)] = num
      return 0;
    }

  function _setTempRet0($i) {
      setTempRet0(($i) | 0);
    }
var ASSERTIONS = true;



/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}


// Copied from https://github.com/strophe/strophejs/blob/e06d027/src/polyfills.js#L149

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

/**
 * Decodes a base64 string.
 * @param {string} input The string to decode.
 */
var decodeBase64 = typeof atob === 'function' ? atob : function (input) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var output = '';
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input.length);
  return output;
};

// Converts a string of base64 into a byte array.
// Throws error on invalid input.
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE === 'boolean' && ENVIRONMENT_IS_NODE) {
    var buf;
    try {
      // TODO: Update Node.js externs, Closure does not recognize the following Buffer.from()
      /**@suppress{checkTypes}*/
      buf = Buffer.from(s, 'base64');
    } catch (_) {
      buf = new Buffer(s, 'base64');
    }
    return new Uint8Array(buf['buffer'], buf['byteOffset'], buf['byteLength']);
  }

  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0 ; i < decoded.length ; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error('Converting base64 string to bytes failed.');
  }
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}


var asmLibraryArg = {
  "emscripten_memcpy_big": _emscripten_memcpy_big,
  "emscripten_resize_heap": _emscripten_resize_heap,
  "exit": _exit,
  "fd_close": _fd_close,
  "fd_seek": _fd_seek,
  "fd_write": _fd_write,
  "setTempRet0": _setTempRet0
};
var asm = createWasm();
/** @type {function(...*):?} */
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

/** @type {function(...*):?} */
var _fflush = Module["_fflush"] = createExportWrapper("fflush");

/** @type {function(...*):?} */
var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

/** @type {function(...*):?} */
var _start = Module["_start"] = createExportWrapper("start");

/** @type {function(...*):?} */
var stackSave = Module["stackSave"] = createExportWrapper("stackSave");

/** @type {function(...*):?} */
var stackRestore = Module["stackRestore"] = createExportWrapper("stackRestore");

/** @type {function(...*):?} */
var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

/** @type {function(...*):?} */
var _emscripten_stack_init = Module["_emscripten_stack_init"] = function() {
  return (_emscripten_stack_init = Module["_emscripten_stack_init"] = Module["asm"]["emscripten_stack_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = function() {
  return (_emscripten_stack_get_free = Module["_emscripten_stack_get_free"] = Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = function() {
  return (_emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");





// === Auto-generated postamble setup entry stuff ===

if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString")) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString")) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ccall")) Module["ccall"] = function() { abort("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "cwrap")) Module["cwrap"] = function() { abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setValue")) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getValue")) Module["getValue"] = function() { abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocate")) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString")) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ToString")) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array")) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8")) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8")) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun")) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnInit")) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain")) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnExit")) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun")) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory")) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory")) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory")) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addRunDependency")) Module["addRunDependency"] = function() { abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "removeRunDependency")) Module["removeRunDependency"] = function() { abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createFolder")) Module["FS_createFolder"] = function() { abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createPath")) Module["FS_createPath"] = function() { abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createDataFile")) Module["FS_createDataFile"] = function() { abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createPreloadedFile")) Module["FS_createPreloadedFile"] = function() { abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLazyFile")) Module["FS_createLazyFile"] = function() { abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLink")) Module["FS_createLink"] = function() { abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createDevice")) Module["FS_createDevice"] = function() { abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_unlink")) Module["FS_unlink"] = function() { abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "getLEB")) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables")) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables")) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions")) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addFunction")) Module["addFunction"] = function() { abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "removeFunction")) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint")) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt")) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting")) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "print")) Module["print"] = function() { abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "printErr")) Module["printErr"] = function() { abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0")) Module["getTempRet0"] = function() { abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0")) Module["setTempRet0"] = function() { abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "callMain")) Module["callMain"] = function() { abort("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "abort")) Module["abort"] = function() { abort("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToNewUTF8")) Module["stringToNewUTF8"] = function() { abort("'stringToNewUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setFileTime")) Module["setFileTime"] = function() { abort("'setFileTime' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscripten_realloc_buffer")) Module["emscripten_realloc_buffer"] = function() { abort("'emscripten_realloc_buffer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ENV")) Module["ENV"] = function() { abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_CODES")) Module["ERRNO_CODES"] = function() { abort("'ERRNO_CODES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_MESSAGES")) Module["ERRNO_MESSAGES"] = function() { abort("'ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setErrNo")) Module["setErrNo"] = function() { abort("'setErrNo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "inetPton4")) Module["inetPton4"] = function() { abort("'inetPton4' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "inetNtop4")) Module["inetNtop4"] = function() { abort("'inetNtop4' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "inetPton6")) Module["inetPton6"] = function() { abort("'inetPton6' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "inetNtop6")) Module["inetNtop6"] = function() { abort("'inetNtop6' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readSockaddr")) Module["readSockaddr"] = function() { abort("'readSockaddr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeSockaddr")) Module["writeSockaddr"] = function() { abort("'writeSockaddr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "DNS")) Module["DNS"] = function() { abort("'DNS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getHostByName")) Module["getHostByName"] = function() { abort("'getHostByName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GAI_ERRNO_MESSAGES")) Module["GAI_ERRNO_MESSAGES"] = function() { abort("'GAI_ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "Protocols")) Module["Protocols"] = function() { abort("'Protocols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "Sockets")) Module["Sockets"] = function() { abort("'Sockets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getRandomDevice")) Module["getRandomDevice"] = function() { abort("'getRandomDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "traverseStack")) Module["traverseStack"] = function() { abort("'traverseStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UNWIND_CACHE")) Module["UNWIND_CACHE"] = function() { abort("'UNWIND_CACHE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "withBuiltinMalloc")) Module["withBuiltinMalloc"] = function() { abort("'withBuiltinMalloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgsArray")) Module["readAsmConstArgsArray"] = function() { abort("'readAsmConstArgsArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgs")) Module["readAsmConstArgs"] = function() { abort("'readAsmConstArgs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "mainThreadEM_ASM")) Module["mainThreadEM_ASM"] = function() { abort("'mainThreadEM_ASM' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_q")) Module["jstoi_q"] = function() { abort("'jstoi_q' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_s")) Module["jstoi_s"] = function() { abort("'jstoi_s' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getExecutableName")) Module["getExecutableName"] = function() { abort("'getExecutableName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "listenOnce")) Module["listenOnce"] = function() { abort("'listenOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "autoResumeAudioContext")) Module["autoResumeAudioContext"] = function() { abort("'autoResumeAudioContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "dynCallLegacy")) Module["dynCallLegacy"] = function() { abort("'dynCallLegacy' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getDynCaller")) Module["getDynCaller"] = function() { abort("'getDynCaller' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "callRuntimeCallbacks")) Module["callRuntimeCallbacks"] = function() { abort("'callRuntimeCallbacks' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "reallyNegative")) Module["reallyNegative"] = function() { abort("'reallyNegative' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "unSign")) Module["unSign"] = function() { abort("'unSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "reSign")) Module["reSign"] = function() { abort("'reSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "formatString")) Module["formatString"] = function() { abort("'formatString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "PATH")) Module["PATH"] = function() { abort("'PATH' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "PATH_FS")) Module["PATH_FS"] = function() { abort("'PATH_FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SYSCALLS")) Module["SYSCALLS"] = function() { abort("'SYSCALLS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "syscallMmap2")) Module["syscallMmap2"] = function() { abort("'syscallMmap2' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "syscallMunmap")) Module["syscallMunmap"] = function() { abort("'syscallMunmap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getSocketFromFD")) Module["getSocketFromFD"] = function() { abort("'getSocketFromFD' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getSocketAddress")) Module["getSocketAddress"] = function() { abort("'getSocketAddress' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "JSEvents")) Module["JSEvents"] = function() { abort("'JSEvents' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerKeyEventCallback")) Module["registerKeyEventCallback"] = function() { abort("'registerKeyEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "specialHTMLTargets")) Module["specialHTMLTargets"] = function() { abort("'specialHTMLTargets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "maybeCStringToJsString")) Module["maybeCStringToJsString"] = function() { abort("'maybeCStringToJsString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "findEventTarget")) Module["findEventTarget"] = function() { abort("'findEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "findCanvasEventTarget")) Module["findCanvasEventTarget"] = function() { abort("'findCanvasEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getBoundingClientRect")) Module["getBoundingClientRect"] = function() { abort("'getBoundingClientRect' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillMouseEventData")) Module["fillMouseEventData"] = function() { abort("'fillMouseEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerMouseEventCallback")) Module["registerMouseEventCallback"] = function() { abort("'registerMouseEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerWheelEventCallback")) Module["registerWheelEventCallback"] = function() { abort("'registerWheelEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerUiEventCallback")) Module["registerUiEventCallback"] = function() { abort("'registerUiEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerFocusEventCallback")) Module["registerFocusEventCallback"] = function() { abort("'registerFocusEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillDeviceOrientationEventData")) Module["fillDeviceOrientationEventData"] = function() { abort("'fillDeviceOrientationEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerDeviceOrientationEventCallback")) Module["registerDeviceOrientationEventCallback"] = function() { abort("'registerDeviceOrientationEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillDeviceMotionEventData")) Module["fillDeviceMotionEventData"] = function() { abort("'fillDeviceMotionEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerDeviceMotionEventCallback")) Module["registerDeviceMotionEventCallback"] = function() { abort("'registerDeviceMotionEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "screenOrientation")) Module["screenOrientation"] = function() { abort("'screenOrientation' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillOrientationChangeEventData")) Module["fillOrientationChangeEventData"] = function() { abort("'fillOrientationChangeEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerOrientationChangeEventCallback")) Module["registerOrientationChangeEventCallback"] = function() { abort("'registerOrientationChangeEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillFullscreenChangeEventData")) Module["fillFullscreenChangeEventData"] = function() { abort("'fillFullscreenChangeEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerFullscreenChangeEventCallback")) Module["registerFullscreenChangeEventCallback"] = function() { abort("'registerFullscreenChangeEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerRestoreOldStyle")) Module["registerRestoreOldStyle"] = function() { abort("'registerRestoreOldStyle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "hideEverythingExceptGivenElement")) Module["hideEverythingExceptGivenElement"] = function() { abort("'hideEverythingExceptGivenElement' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "restoreHiddenElements")) Module["restoreHiddenElements"] = function() { abort("'restoreHiddenElements' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setLetterbox")) Module["setLetterbox"] = function() { abort("'setLetterbox' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "currentFullscreenStrategy")) Module["currentFullscreenStrategy"] = function() { abort("'currentFullscreenStrategy' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "restoreOldWindowedStyle")) Module["restoreOldWindowedStyle"] = function() { abort("'restoreOldWindowedStyle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "softFullscreenResizeWebGLRenderTarget")) Module["softFullscreenResizeWebGLRenderTarget"] = function() { abort("'softFullscreenResizeWebGLRenderTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "doRequestFullscreen")) Module["doRequestFullscreen"] = function() { abort("'doRequestFullscreen' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillPointerlockChangeEventData")) Module["fillPointerlockChangeEventData"] = function() { abort("'fillPointerlockChangeEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerPointerlockChangeEventCallback")) Module["registerPointerlockChangeEventCallback"] = function() { abort("'registerPointerlockChangeEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerPointerlockErrorEventCallback")) Module["registerPointerlockErrorEventCallback"] = function() { abort("'registerPointerlockErrorEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "requestPointerLock")) Module["requestPointerLock"] = function() { abort("'requestPointerLock' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillVisibilityChangeEventData")) Module["fillVisibilityChangeEventData"] = function() { abort("'fillVisibilityChangeEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerVisibilityChangeEventCallback")) Module["registerVisibilityChangeEventCallback"] = function() { abort("'registerVisibilityChangeEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerTouchEventCallback")) Module["registerTouchEventCallback"] = function() { abort("'registerTouchEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillGamepadEventData")) Module["fillGamepadEventData"] = function() { abort("'fillGamepadEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerGamepadEventCallback")) Module["registerGamepadEventCallback"] = function() { abort("'registerGamepadEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerBeforeUnloadEventCallback")) Module["registerBeforeUnloadEventCallback"] = function() { abort("'registerBeforeUnloadEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "fillBatteryEventData")) Module["fillBatteryEventData"] = function() { abort("'fillBatteryEventData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "battery")) Module["battery"] = function() { abort("'battery' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerBatteryEventCallback")) Module["registerBatteryEventCallback"] = function() { abort("'registerBatteryEventCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setCanvasElementSize")) Module["setCanvasElementSize"] = function() { abort("'setCanvasElementSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getCanvasElementSize")) Module["getCanvasElementSize"] = function() { abort("'getCanvasElementSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "polyfillSetImmediate")) Module["polyfillSetImmediate"] = function() { abort("'polyfillSetImmediate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "demangle")) Module["demangle"] = function() { abort("'demangle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "demangleAll")) Module["demangleAll"] = function() { abort("'demangleAll' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "jsStackTrace")) Module["jsStackTrace"] = function() { abort("'jsStackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getEnvStrings")) Module["getEnvStrings"] = function() { abort("'getEnvStrings' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "checkWasiClock")) Module["checkWasiClock"] = function() { abort("'checkWasiClock' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "flush_NO_FILESYSTEM")) Module["flush_NO_FILESYSTEM"] = function() { abort("'flush_NO_FILESYSTEM' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64")) Module["writeI53ToI64"] = function() { abort("'writeI53ToI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Clamped")) Module["writeI53ToI64Clamped"] = function() { abort("'writeI53ToI64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Signaling")) Module["writeI53ToI64Signaling"] = function() { abort("'writeI53ToI64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Clamped")) Module["writeI53ToU64Clamped"] = function() { abort("'writeI53ToU64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Signaling")) Module["writeI53ToU64Signaling"] = function() { abort("'writeI53ToU64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromI64")) Module["readI53FromI64"] = function() { abort("'readI53FromI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromU64")) Module["readI53FromU64"] = function() { abort("'readI53FromU64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "convertI32PairToI53")) Module["convertI32PairToI53"] = function() { abort("'convertI32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "convertU32PairToI53")) Module["convertU32PairToI53"] = function() { abort("'convertU32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "uncaughtExceptionCount")) Module["uncaughtExceptionCount"] = function() { abort("'uncaughtExceptionCount' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exceptionLast")) Module["exceptionLast"] = function() { abort("'exceptionLast' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exceptionCaught")) Module["exceptionCaught"] = function() { abort("'exceptionCaught' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ExceptionInfoAttrs")) Module["ExceptionInfoAttrs"] = function() { abort("'ExceptionInfoAttrs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ExceptionInfo")) Module["ExceptionInfo"] = function() { abort("'ExceptionInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "CatchInfo")) Module["CatchInfo"] = function() { abort("'CatchInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exception_addRef")) Module["exception_addRef"] = function() { abort("'exception_addRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exception_decRef")) Module["exception_decRef"] = function() { abort("'exception_decRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "Browser")) Module["Browser"] = function() { abort("'Browser' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "funcWrappers")) Module["funcWrappers"] = function() { abort("'funcWrappers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setMainLoop")) Module["setMainLoop"] = function() { abort("'setMainLoop' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "FS")) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "mmapAlloc")) Module["mmapAlloc"] = function() { abort("'mmapAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "MEMFS")) Module["MEMFS"] = function() { abort("'MEMFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "TTY")) Module["TTY"] = function() { abort("'TTY' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "PIPEFS")) Module["PIPEFS"] = function() { abort("'PIPEFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SOCKFS")) Module["SOCKFS"] = function() { abort("'SOCKFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "_setNetworkCallback")) Module["_setNetworkCallback"] = function() { abort("'_setNetworkCallback' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "tempFixedLengthArray")) Module["tempFixedLengthArray"] = function() { abort("'tempFixedLengthArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "miniTempWebGLFloatBuffers")) Module["miniTempWebGLFloatBuffers"] = function() { abort("'miniTempWebGLFloatBuffers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "heapObjectForWebGLType")) Module["heapObjectForWebGLType"] = function() { abort("'heapObjectForWebGLType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "heapAccessShiftForWebGLHeap")) Module["heapAccessShiftForWebGLHeap"] = function() { abort("'heapAccessShiftForWebGLHeap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GL")) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGet")) Module["emscriptenWebGLGet"] = function() { abort("'emscriptenWebGLGet' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "computeUnpackAlignedImageSize")) Module["computeUnpackAlignedImageSize"] = function() { abort("'computeUnpackAlignedImageSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetTexPixelData")) Module["emscriptenWebGLGetTexPixelData"] = function() { abort("'emscriptenWebGLGetTexPixelData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetUniform")) Module["emscriptenWebGLGetUniform"] = function() { abort("'emscriptenWebGLGetUniform' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetVertexAttrib")) Module["emscriptenWebGLGetVertexAttrib"] = function() { abort("'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeGLArray")) Module["writeGLArray"] = function() { abort("'writeGLArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "AL")) Module["AL"] = function() { abort("'AL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_unicode")) Module["SDL_unicode"] = function() { abort("'SDL_unicode' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_ttfContext")) Module["SDL_ttfContext"] = function() { abort("'SDL_ttfContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_audio")) Module["SDL_audio"] = function() { abort("'SDL_audio' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL")) Module["SDL"] = function() { abort("'SDL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_gfx")) Module["SDL_gfx"] = function() { abort("'SDL_gfx' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLUT")) Module["GLUT"] = function() { abort("'GLUT' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "EGL")) Module["EGL"] = function() { abort("'EGL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLFW_Window")) Module["GLFW_Window"] = function() { abort("'GLFW_Window' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLFW")) Module["GLFW"] = function() { abort("'GLFW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLEW")) Module["GLEW"] = function() { abort("'GLEW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "IDBStore")) Module["IDBStore"] = function() { abort("'IDBStore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "runAndAbortIfError")) Module["runAndAbortIfError"] = function() { abort("'runAndAbortIfError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "warnOnce")) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackSave")) Module["stackSave"] = function() { abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackRestore")) Module["stackRestore"] = function() { abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc")) Module["stackAlloc"] = function() { abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString")) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii")) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString")) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16")) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16")) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString")) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32")) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32")) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8")) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8OnStack")) Module["allocateUTF8OnStack"] = function() { abort("'allocateUTF8OnStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;
if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromBase64")) Module["intArrayFromBase64"] = function() { abort("'intArrayFromBase64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "tryParseAsDataURI")) Module["tryParseAsDataURI"] = function() { abort("'tryParseAsDataURI' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL")) Object.defineProperty(Module, "ALLOC_NORMAL", { configurable: true, get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK")) Object.defineProperty(Module, "ALLOC_STACK", { configurable: true, get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });

var calledRun;

/**
 * @constructor
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}

var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  _emscripten_stack_init();
  writeStackCookie();
}

/** @type {function(Array=)} */
function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }

  stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}
Module['run'] = run;

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = function(x) {
    has = true;
  }
  try { // it doesn't matter if it fails
    var flush = flush_NO_FILESYSTEM;
    if (flush) flush();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -s FORCE_FILESYSTEM=1)');
  }
}

/** @param {boolean|number=} implicit */
function exit(status, implicit) {
  checkUnflushedContent();

  // if this is just main exit-ing implicitly, and the status is 0, then we
  // don't need to do anything here and can just leave. if the status is
  // non-zero, though, then we need to report it.
  // (we may have warned about this earlier, if a situation justifies doing so)
  if (implicit && noExitRuntime && status === 0) {
    return;
  }

  if (noExitRuntime) {
    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
    if (!implicit) {
      var msg = 'program exited (with status: ' + status + '), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)';
      err(msg);
    }
  } else {

    EXITSTATUS = status;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);

    ABORT = true;
  }

  quit_(status, new ExitStatus(status));
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

run();





/**
 * This file will be inserted to generated output when building the library.
 */

/**
 * @param colorFilter return true if given pixel will be traced.
 * @param transform whether add the <transform /> tag to reduce generated svg length.
 * @param pathonly only returns concated path data.
 * @param turdsize suppress speckles of up to this many pixels.
 */
const defaultConfig = {
  colorFilter: (r, g, b, a) => a && 0.2126 * r + 0.7152 * g + 0.0722 * b < 128,
  transform: true,
  pathonly: false,
  turdsize: 2,
};

/**
 * @param config for customizing.
 * @returns merged config with default value.
 */
function buildConfig(config) {
  if (!config) {
    return Object.assign({}, defaultConfig);
  }
  let merged = Object.assign({}, config);
  for (let prop in defaultConfig) {
    if (!config.hasOwnProperty(prop)) {
      merged[prop] = defaultConfig[prop];
    }
  }
  return merged;
}

/**
 * @returns promise to wait for wasm loaded.
 */
function ready() {
  return new Promise((resolve) => {
    if (runtimeInitialized) {
      resolve();
      return;
    }
    Module.onRuntimeInitialized = () => {
      resolve();
    };
  });
}

/**
 * @param canvas to be converted for svg.
 * @param config for customizing.
 * @returns promise that emits a svg string or path data array.
 */
async function loadFromCanvas(canvas, config) {
  let ctx = canvas.getContext("2d");
  let imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  return loadFromImageData(imagedata, canvas.width, canvas.height, config);
}

/**
 * @param imagedata to be converted for svg.
 * @param width for the imageData.
 * @param height for the imageData.
 * @param config for customizing.
 * @returns promise that emits a svg string or path data array.
 */
async function loadFromImageData(imagedata, width, height, config) {
  let start = wrapStart();
  let data = new Array(Math.ceil(imagedata.length / 32)).fill(0);
  let c = buildConfig(config);

  for (let i = 0; i < imagedata.length; i += 4) {
    let r = imagedata[i],
      g = imagedata[i + 1],
      b = imagedata[i + 2],
      a = imagedata[i + 3];

    if (c.colorFilter(r, g, b, a)) {
      // each number contains 8 pixels from rightmost bit.
      let index = Math.floor(i / 4);
      data[Math.floor(index / 8)] += 1 << index % 8;
    }
  }

  await ready();
  let result = start(data, width, height, c.transform, c.pathonly, c.turdsize);

  if (c.pathonly) {
    return result
      .split("M")
      .filter((path) => path)
      .map((path) => "M" + path);
  }
  return result;
}

/**
 * @returns wrapped function for start.
 */
function wrapStart() {
  return cwrap("start", "string", [
    "array", // pixels
    "number", // width
    "number", // height
    "number", // transform
    "number", // pathonly
    "number", // turdsize
  ]);
}

// export the functions in server env.
if (typeof module !== "undefined") {
  module.exports = { loadFromCanvas, loadFromImageData };
}

