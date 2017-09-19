/**

  javascript interface to muse 
  works with dummy data when no muse device is available
  and uses socket.io to connect to a real muse device

  Version: 2.0.0
  
*/
function musedata() {

  var defaultURL = 'http://127.0.0.1:8081';

  function md() {}

  md.connect = function(url) {
    console.log('museData.connect');
    var _url = arguments.length == 0 ? defaultURL : url;
    return museConnection(_url);
  };

  md.fake = function() {
    return fakeConnection();
  };

  return md;
}

function museConnection(_url) {

  var url = _url;
  var socket = null;
  var callbacks = [];

  //contains the current data for each listened id
  var dataContainer = [];

  function my() {}

  //TODO, call this already in the beginning or so, so the user doesnt have to do it
  my.start = function() {
    console.log('museConnection.start()');
    console.log('url', url);
    socket = io.connect(url);
    console.log('socket', socket);
    socket.on('muse', this.onMsg);

    return my;
  };

  my.stop = function() {
    console.log('museConnection.stop()');
    socket.disconnect();
  };

  my.listenTo = function(_id) {
    console.log('museConnection.listenTo()');

    //check if we already registered _id
    if (!callbacks[_id]) {
      callbacks[_id] = getCallback(_id);
      dataContainer[_id] = {};
    } else {
      console.log('already listening to ' + _id);
    }
  };

  my.onMsg = function(obj) {
    //convert numbers to numbers
    var msg = obj.map(function(d) {
      return isNaN(d) ? d : +d;
    });

    var id = msg[0];
    var cback = callbacks[id];

    if (cback) {
      var jsonobj = cback(msg);
      dataContainer[jsonobj.id] = jsonobj;
    }

    return my;
  };

  my.disconnect = function() {
    console.log('museConnection.disconnect()');
    ws.close();
  };

  my.get = function(_id) {
    if (!dataContainer[_id]) {
      console.log('invoking listenTo ' + _id);
      my.listenTo(_id);
      return zeroObj(_id);
    }

    return dataContainer[_id];
  };

  my.init = function() {
    my.start();
    return my;
  }

  return my.init();
}

function fakeConnection() {

  console.log('fakeConnection');

  var ws = null;
  var interval = 1000 / 250;
  var callbacks = [];
  var intervalID = null;
  var data = [];
  var msgIndex = 0;

  //contains the current data for each listened id
  var dataContainer = [];


  function my() {}

  my.listenTo = function(_id) {
    console.log('fakeConnection.listenTo()');

    //check if we already registered _id
    if (!callbacks[_id]) {
      callbacks[_id] = getCallback(_id);
      dataContainer[_id] = {};
    } else {
      console.log('already listening to ' + _id);
    }
  };

  my.onMsg = function() {
    if (msgIndex >= data.length) {
      msgIndex = 0;
      console.log('resetting msgIndex to ' + msgIndex);
    }
    var msg = data[msgIndex].slice();

    msgIndex++;
    msg.shift();

    var id = msg[0];
    var cback = callbacks[id];

    if (cback) {
      var jsonobj = cback(msg);
      dataContainer[jsonobj.id] = jsonobj;
    }
    return my;
  };

  my.start = function() {
    console.log('fakeConnection.start()');
    data = exampleData();
    intervalID = setInterval(this.onMsg, interval);
    return my;

  };

  my.stop = function() {
    console.log('fakeConnection.stop()');
    clearInterval(intervalID);
    return my;
  };

  my.get = function(_id) {
    if (!dataContainer[_id]) {
      console.log('invoking listenTo ' + _id);
      my.listenTo(_id);
      return zeroObj(_id);
    }
    return dataContainer[_id];
  };

  my.init = function() {
    my.start();
    return my;
  }

  return my.init();
}


function getCallback(_id) {

  var emptyParser = function(msg) {
    return {};
  };

  var oneValueParser = function(msg) {
    return {
      id: msg[0],
      value: msg[1]
    };
  };

  var arrParser = function(msg) {
    var _id = msg[0];
    var _values = msg.slice(1);
    return {
      id: _id,
      values: _values
    };
  };

  var regularParser = function(msg) {
    return {
      id: msg[0],
      leftEar: msg[1],
      leftFront: msg[2],
      rightFront: msg[3],
      rightEar: msg[4]
    };
  };

  var regularParserMean = function(msg) {

    var obj = regularParser(msg);
    obj.mean = calcMean(msg.slice(1));
    return obj;
  };

  var fn = {
    '/muse/eeg': regularParserMean,
    '/muse/elements/alpha_relative': regularParserMean,
    '/muse/elements/beta_relative': regularParserMean,
    '/muse/elements/delta_relative': regularParserMean,
    '/muse/elements/gamma_relative': regularParserMean,
    '/muse/elements/theta_relative': regularParserMean,
    '/muse/elements/horseshoe': regularParser,
    '/muse/elements/is_good': regularParser,
    '/muse/elements/blink': oneValueParser,
    '/muse/elements/jaw_clench': oneValueParser,
    '/muse/elements/touching_forehead': oneValueParser,
    '/muse/elements/experimental/concentration': oneValueParser,
    '/muse/elements/experimental/mellow': oneValueParser,
    '/muse/elements/raw_fft0': arrParser,
    '/muse/elements/raw_fft1': arrParser,
    '/muse/elements/raw_fft2': arrParser,
    '/muse/elements/raw_fft3': arrParser,
    '/muse/elements/alpha_absolute': regularParserMean,
    '/muse/elements/beta_absolute': regularParserMean,
    '/muse/elements/delta_absolute': regularParserMean,
    '/muse/elements/gamma_absolute': regularParserMean,
    '/muse/elements/theta_absolute': regularParserMean
  };

  return fn[_id] ? fn[_id] : emptyParser;
}

function zeroObj(id) {

  var zeroes = {
    '/muse/eeg': {
      id: '/muse/eeg',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/alpha_relative': {
      id: '/muse/elements/alpha_relative',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/beta_relative': {
      id: '/muse/elements/beta_relative',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/delta_relative': {
      id: '/muse/elements/delta_relative',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/gamma_relative': {
      id: '/muse/elements/gamma_relative',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/theta_relative': {
      id: '/muse/elements/theta_relative',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/horseshoe': {
      id: '/muse/elements/horseshoe',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0
    },
    '/muse/elements/is_good': {
      id: '/muse/elements/is_good',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0
    },
    '/muse/elements/blink': {
      id: '/muse/elements/blink',
      value: 0
    },
    '/muse/elements/jaw_clench': {
      id: '/muse/elements/jaw_clench',
      value: 0
    },
    '/muse/elements/touching_forehead': {
      id: '/muse/elements/touching_forehead',
      value: 0
    },
    '/muse/elements/experimental/concentration': {
      id: '/muse/elements/experimental/concentration',
      value: 0
    },
    '/muse/elements/experimental/mellow': {
      id: '/muse/elements/experimental/mellow',
      value: 0
    },
    '/muse/elements/raw_fft0': {
      id: '/muse/elements/raw_fft0',
      values: []
    },
    '/muse/elements/raw_fft1': {
      id: '/muse/elements/raw_fft1',
      values: []
    },
    '/muse/elements/raw_fft2': {
      id: '/muse/elements/raw_fft2',
      values: []
    },
    '/muse/elements/raw_fft3': {
      id: '/muse/elements/raw_fft3',
      values: []
    },
    '/muse/elements/alpha_absolute': {
      id: '/muse/elements/alpha_absolute',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/beta_absolute': {
      id: '/muse/elements/beta_absolute',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/delta_absolute': {
      id: '/muse/elements/delta_absolute',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/gamma_absolute': {
      id: '/muse/elements/gamma_absolute',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    },
    '/muse/elements/theta_absolute': {
      id: '/muse/elements/theta_absolute',
      leftEar: 0,
      leftFront: 0,
      rightFront: 0,
      rightEar: 0,
      mean: 0
    }

  };

  return zeroes[id];
}

function calcMean(arr) {
  return calcSum(arr) / arr.length;
}

function calcSum(arr) {
  return arr.reduce(function(previousValue, currentValue) {
    return currentValue + previousValue;
  });
}