/** @license React v0.0.0-experimental-2ff27ec11
 * react-server-flight.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== "production") {
  module.exports = function $$$reconciler($$$hostConfig) {
    var exports = {};
'use strict';

// This is a host config that's used for the `react-server` package on npm.
// It is only used by third-party renderers.
//
// Its API lets you pass the host config as an argument.
// However, inside the `react-server` we treat host config as a module.
// This file is a shim between two worlds.
//
// It works because the `react-server` bundle is wrapped in something like:
//
// module.exports = function ($$$config) {
//   /* renderer code */
// }
//
// So `$$$config` looks like a global variable, but it's
// really an argument to a top-level wrapping function.
// eslint-disable-line no-undef
var scheduleWork = $$$hostConfig.scheduleWork;
var beginWriting = $$$hostConfig.beginWriting;
var writeChunk = $$$hostConfig.writeChunk;
var completeWriting = $$$hostConfig.completeWriting;
var flushBuffered = $$$hostConfig.flushBuffered;
var close = $$$hostConfig.close;
var convertStringToBuffer = $$$hostConfig.convertStringToBuffer;

// This file is an intermediate layer to translate between Flight
var stringify = JSON.stringify;

function serializeRowHeader(tag, id) {
  return tag + id.toString(16) + ':';
}

function processErrorChunk(request, id, message, stack) {
  var errorInfo = {
    message: message,
    stack: stack
  };
  var row = serializeRowHeader('E', id) + stringify(errorInfo) + '\n';
  return convertStringToBuffer(row);
}
function processModelChunk(request, id, model) {
  var json = stringify(model, request.toJSON);
  var row;

  if (id === 0) {
    row = json + '\n';
  } else {
    row = serializeRowHeader('J', id) + json + '\n';
  }

  return convertStringToBuffer(row);
}

// eslint-disable-line no-undef
// eslint-disable-line no-undef
// eslint-disable-line no-undef
var resolveModuleMetaData = $$$hostConfig.resolveModuleMetaData;

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = 0xeac7;
var REACT_PORTAL_TYPE = 0xeaca;
var REACT_FRAGMENT_TYPE = 0xeacb;
var REACT_STRICT_MODE_TYPE = 0xeacc;
var REACT_PROFILER_TYPE = 0xead2;
var REACT_PROVIDER_TYPE = 0xeacd;
var REACT_CONTEXT_TYPE = 0xeace;
var REACT_FORWARD_REF_TYPE = 0xead0;
var REACT_SUSPENSE_TYPE = 0xead1;
var REACT_SUSPENSE_LIST_TYPE = 0xead8;
var REACT_MEMO_TYPE = 0xead3;
var REACT_LAZY_TYPE = 0xead4;
var REACT_BLOCK_TYPE = 0xead9;
var REACT_SERVER_BLOCK_TYPE = 0xeada;
var REACT_FUNDAMENTAL_TYPE = 0xead5;
var REACT_RESPONDER_TYPE = 0xead6;
var REACT_SCOPE_TYPE = 0xead7;

if (typeof Symbol === 'function' && Symbol.for) {
  var symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor('react.element');
  REACT_PORTAL_TYPE = symbolFor('react.portal');
  REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
  REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
  REACT_PROFILER_TYPE = symbolFor('react.profiler');
  REACT_PROVIDER_TYPE = symbolFor('react.provider');
  REACT_CONTEXT_TYPE = symbolFor('react.context');
  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
  REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
  REACT_MEMO_TYPE = symbolFor('react.memo');
  REACT_LAZY_TYPE = symbolFor('react.lazy');
  REACT_BLOCK_TYPE = symbolFor('react.block');
  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
  REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
  REACT_RESPONDER_TYPE = symbolFor('react.responder');
  REACT_SCOPE_TYPE = symbolFor('react.scope');
}

function createRequest(model, destination, bundlerConfig) {
  var pingedSegments = [];
  var request = {
    destination: destination,
    bundlerConfig: bundlerConfig,
    nextChunkId: 0,
    pendingChunks: 0,
    pingedSegments: pingedSegments,
    completedJSONChunks: [],
    completedErrorChunks: [],
    flowing: false,
    toJSON: function (key, value) {
      return resolveModelToJSON(request, this, key, value);
    }
  };
  request.pendingChunks++;
  var rootSegment = createSegment(request, function () {
    return model;
  });
  pingedSegments.push(rootSegment);
  return request;
}

function attemptResolveElement(element) {
  var type = element.type;
  var props = element.props;

  if (typeof type === 'function') {
    // This is a server-side component.
    return type(props);
  } else if (typeof type === 'string') {
    // This is a host element. E.g. HTML.
    return [REACT_ELEMENT_TYPE, type, element.key, element.props];
  } else if (type[0] === REACT_SERVER_BLOCK_TYPE) {
    return [REACT_ELEMENT_TYPE, type, element.key, element.props];
  } else if (type === REACT_FRAGMENT_TYPE) {
    return element.props.children;
  } else {
    {
      {
        throw Error( "Unsupported type." );
      }
    }
  }
}

function pingSegment(request, segment) {
  var pingedSegments = request.pingedSegments;
  pingedSegments.push(segment);

  if (pingedSegments.length === 1) {
    scheduleWork(function () {
      return performWork(request);
    });
  }
}

function createSegment(request, query) {
  var id = request.nextChunkId++;
  var segment = {
    id: id,
    query: query,
    ping: function () {
      return pingSegment(request, segment);
    }
  };
  return segment;
}

function serializeIDRef(id) {
  return '$' + id.toString(16);
}

function escapeStringValue(value) {
  if (value[0] === '$' || value[0] === '@') {
    // We need to escape $ or @ prefixed strings since we use those to encode
    // references to IDs and as special symbol values.
    return '$' + value;
  } else {
    return value;
  }
}

function resolveModelToJSON(request, parent, key, value) {
  // Special Symbols
  switch (value) {
    case REACT_ELEMENT_TYPE:
      return '$';

    case REACT_SERVER_BLOCK_TYPE:
      return '@';

    case REACT_LAZY_TYPE:
    case REACT_BLOCK_TYPE:
      {
        {
          throw Error( "React Blocks (and Lazy Components) are expected to be replaced by a compiler on the server. Try configuring your compiler set up and avoid using React.lazy inside of Blocks." );
        }
      }

  }

  if (parent[0] === REACT_SERVER_BLOCK_TYPE) {
    // We're currently encoding part of a Block. Look up which key.
    switch (key) {
      case '1':
        {
          // Module reference
          var moduleReference = value;

          try {
            var moduleMetaData = resolveModuleMetaData(request.bundlerConfig, moduleReference);
            return moduleMetaData;
          } catch (x) {
            request.pendingChunks++;
            var errorId = request.nextChunkId++;
            emitErrorChunk(request, errorId, x);
            return serializeIDRef(errorId);
          }
        }

      case '2':
        {
          // Load function
          var load = value;

          try {
            // Attempt to resolve the data.
            return load();
          } catch (x) {
            if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
              // Something suspended, we'll need to create a new segment and resolve it later.
              request.pendingChunks++;
              var newSegment = createSegment(request, load);
              var ping = newSegment.ping;
              x.then(ping, ping);
              return serializeIDRef(newSegment.id);
            } else {
              // This load failed, encode the error as a separate row and reference that.
              request.pendingChunks++;

              var _errorId = request.nextChunkId++;

              emitErrorChunk(request, _errorId, x);
              return serializeIDRef(_errorId);
            }
          }
        }

      default:
        {
          {
            {
              throw Error( "A server block should never encode any other slots. This is a bug in React." );
            }
          }
        }
    }
  }

  if (typeof value === 'string') {
    return escapeStringValue(value);
  } // Resolve server components.


  while (typeof value === 'object' && value !== null && value.$$typeof === REACT_ELEMENT_TYPE) {
    // TODO: Concatenate keys of parents onto children.
    var element = value;

    try {
      // Attempt to render the server component.
      value = attemptResolveElement(element);
    } catch (x) {
      if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
        // Something suspended, we'll need to create a new segment and resolve it later.
        request.pendingChunks++;

        var _newSegment = createSegment(request, function () {
          return value;
        });

        var _ping = _newSegment.ping;
        x.then(_ping, _ping);
        return serializeIDRef(_newSegment.id);
      } else {
        // Something errored. Don't bother encoding anything up to here.
        throw x;
      }
    }
  }

  return value;
}

function emitErrorChunk(request, id, error) {
  // TODO: We should not leak error messages to the client in prod.
  // Give this an error code instead and log on the server.
  // We can serialize the error in DEV as a convenience.
  var message;
  var stack = '';

  try {
    if (error instanceof Error) {
      message = '' + error.message;
      stack = '' + error.stack;
    } else {
      message = 'Error: ' + error;
    }
  } catch (x) {
    message = 'An error occurred but serializing the error message failed.';
  }

  var processedChunk = processErrorChunk(request, id, message, stack);
  request.completedErrorChunks.push(processedChunk);
}

function retrySegment(request, segment) {
  var query = segment.query;
  var value;

  try {
    value = query();

    while (typeof value === 'object' && value !== null && value.$$typeof === REACT_ELEMENT_TYPE) {
      // TODO: Concatenate keys of parents onto children.
      var element = value; // Attempt to render the server component.
      // Doing this here lets us reuse this same segment if the next component
      // also suspends.

      segment.query = function () {
        return value;
      };

      value = attemptResolveElement(element);
    }

    var processedChunk = processModelChunk(request, segment.id, value);
    request.completedJSONChunks.push(processedChunk);
  } catch (x) {
    if (typeof x === 'object' && x !== null && typeof x.then === 'function') {
      // Something suspended again, let's pick it back up later.
      var ping = segment.ping;
      x.then(ping, ping);
      return;
    } else {
      // This errored, we need to serialize this error to the
      emitErrorChunk(request, segment.id, x);
    }
  }
}

function performWork(request) {
  var pingedSegments = request.pingedSegments;
  request.pingedSegments = [];

  for (var i = 0; i < pingedSegments.length; i++) {
    var segment = pingedSegments[i];
    retrySegment(request, segment);
  }

  if (request.flowing) {
    flushCompletedChunks(request);
  }
}

var reentrant = false;

function flushCompletedChunks(request) {
  if (reentrant) {
    return;
  }

  reentrant = true;
  var destination = request.destination;
  beginWriting(destination);

  try {
    var jsonChunks = request.completedJSONChunks;
    var i = 0;

    for (; i < jsonChunks.length; i++) {
      request.pendingChunks--;
      var chunk = jsonChunks[i];

      if (!writeChunk(destination, chunk)) {
        request.flowing = false;
        i++;
        break;
      }
    }

    jsonChunks.splice(0, i);
    var errorChunks = request.completedErrorChunks;
    i = 0;

    for (; i < errorChunks.length; i++) {
      request.pendingChunks--;
      var _chunk = errorChunks[i];

      if (!writeChunk(destination, _chunk)) {
        request.flowing = false;
        i++;
        break;
      }
    }

    errorChunks.splice(0, i);
  } finally {
    reentrant = false;
    completeWriting(destination);
  }

  flushBuffered(destination);

  if (request.pendingChunks === 0) {
    // We're done.
    close(destination);
  }
}

function startWork(request) {
  request.flowing = true;
  scheduleWork(function () {
    return performWork(request);
  });
}
function startFlowing(request) {
  request.flowing = true;
  flushCompletedChunks(request);
}

exports.createRequest = createRequest;
exports.resolveModelToJSON = resolveModelToJSON;
exports.startFlowing = startFlowing;
exports.startWork = startWork;
    return exports;
  };
}
