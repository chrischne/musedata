function museData() {

  function my() {
    // generate chart here, using `width` and `height`
  }

  my.connection = function(url) {
    console.log('museData.connection');
    if (!arguments.length) {
      console.log('museData.connection: no url for websocket specified');
      return null;
    }
    return museConnector(url);
  };

  my.dummyData = function(interval) {
    if (!arguments.length) {
      return dummyConnector();
    }
    return dummyConnector(interval);
  };

  return my;

};



function museConnector(_url) {

  var url = _url;
  // var ws = null;
  var socket = null;
  var callbacks = [];
  var dataContainer = [];

  function my() {
    console.log('museConnector.my');
  }


  my.start = function() {
    console.log('museConnector.start');
    //ws = new WebSocket(url);
    socket = io.connect(url);
    console.log('socket', socket);
    // ws.onmessage = this.onMsg;
    socket.on('muse', this.onMsg);

    return my;
  }

  my.stop = function() {
    console.log('museConnector.stop');
    ws.onclose = function() {};
    ws.close();
    ws = null;
  }

  my.listenTo = function(_id, _cb) {
    console.log('museConnector.listenTo');
    //maybe here better to make and objec {id: callback: }
    //or maybe better not. 
    callbacks[_id] = _cb;
    return my;
  }

  my.onMsg = function(obj) {
    //console.log('museConnector.onMsg: ',obj);
    //var msg = obj.split(',');

    //convert numbers to numbers
    var msg = obj.map(function(d) {
      if (isNaN(d)) {
        return d;
      }
      return +d;
    });



    var id = msg[0];
    //  console.log('id',id);
    var cback = callbacks[id];

    if (cback) {
      cback(msg);
    }

    return my;

  }

  my.disconnect = function() {
    console.log('museConnector.disconnect');
    ws.close();
  }

  return my;

}


function dummyConnector(interval) {

  console.log('dummyConnector');
  var ws = null;
  var interval = interval ? interval : (1000 / 250);
  var callbacks = [];
  var intervalID = null;
  var data = [];
  var msgIndex = 0;

  //contains the registered data to listen to
  var dataContainer = [];


  function my() {

    //console.log('my');


  }

  /*my.listenTo = function(_id, _cb) {
    console.log('dummyConnector.listenTo');

    callbacks[_id] = _cb;
    console.log('callbacks', callbacks);
    return my;
  }*/

  my.listenTo = function(_id) {
    console.log('dummyConnector.listenTo');

    //check if we already registered _id
    if (!callbacks[_id]) {
      callbacks[_id] = getCallback(_id);
      dataContainer[_id] = {};
    } else {
      console.log('already listening to ' + _id);
    }
  }

  my.onMsg = function() {
    // console.log('dummyConnector.genMsg');

    if (msgIndex >= data.length) {
      msgIndex = 0;
      console.log('resetting msgIndex to ' + msgIndex);
    }
    var msg = data[msgIndex];
    msgIndex++;


    msg.shift();


    var id = msg[0];

    var cback = callbacks[id];

    if (cback) {
      var jsonobj = cback(msg);
      dataContainer[jsonobj.id] = jsonobj;
    }
    return my;
  }

  my.start = function() {
    console.log('dummyConnector.start');
    data = exampleData();
    intervalID = setInterval(this.onMsg, interval);
    return my;

  }

  my.stop = function() {
    console.log('dummyConnector.stop');
    clearInterval(intervalID);
    return my;
  }

  my.get = function(_id) {
    if (!dataContainer[_id]) {
      console.log('museData: no data available for id ' + _id);
      console.log('make sure you call museData().listenTo( ' + _id + ')');
      return {
        id: _id,
        value: 0
      };
    }

    return dataContainer[_id];
  }



  return my;

};


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
    var _values = msg.shift();
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
    '/muse/elements/theta_absolute': regularParserMean,
    '/muse/elements/is_good': regularParser,
  };

  return fn[_id] ? fn[_id] : emptyParser;
}



function calcMean(arr) {
  return calcSum(arr) / arr.length;
}

function calcSum(arr) {
  return arr.reduce(function(previousValue, currentValue) {
    return currentValue + previousValue;
  });
}