/**

  javascript interface to muse 
  works with dummy data when no muse device is available
  and uses socket.io to connect to a real muse device

  Version: 2.0.0
  
*/
function musedata() {

  var defaultURL = 'http://127.0.0.1:8081';

  //TODO change my to md
  function md() {
    // generate chart here, using `width` and `height`
  }

  md.connect = function(url) {
    //TODO connect to default url when no url is given
    console.log('museData.connect');
   /* if (!arguments.length) {
      console.log('museData.connection: no url for websocket specified');
      return null;
    }*/
    console.log('arguments.length',arguments.length);
    var _url = arguments.length == 0 ? defaultURL : url;
    return museConnection(_url);
  };

  //TODO change to fakeData
  md.fake = function() {
      return fakeConnection();
  };

  return md;

}



function museConnection(_url) {

  var url = _url;
  // var ws = null;
  var socket = null;
  var callbacks = [];

  //contains the current data for each listened id
  var dataContainer = [];

  function my() {
    console.log('museConnector.my');
  }

  //TODO, call this already in the beginning or so, so the user doesnt have to do it
  my.start = function() {
    console.log('museConnector.start');
    //ws = new WebSocket(url);
    console.log('url',url);
    socket = io.connect(url);
    console.log('socket', socket);
    // ws.onmessage = this.onMsg;
    socket.on('muse', this.onMsg);

    return my;
  };

  my.stop = function() {
    console.log('museConnector.stop');
    /*ws.onclose = function() {};
    ws.close();
    ws = null;*/
    socket.disconnect();
  };

  my.listenTo = function(_id) {
    console.log('museConnector.listenTo');
    //maybe here better to make and objec {id: callback: }
    //or maybe better not. 
    //  callbacks[_id] = _cb;
    //return my;

    //check if we already registered _id
    if (!callbacks[_id]) {
      callbacks[_id] = getCallback(_id);
      dataContainer[_id] = {};
    } else {
      console.log('already listening to ' + _id);
    }
  };

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
      var jsonobj = cback(msg);
      dataContainer[jsonobj.id] = jsonobj;
    }

    return my;

  };

  my.disconnect = function() {
    console.log('museConnector.disconnect');
    ws.close();
  };

  //TODO invoke a listenTo if id is not there, lazy init
  //maybe make a list of valid ids
  //and if id is not in the list, then throw and error
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
  };

  return my;

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
      console.log('now listening to ' + _id);
    } else {
      console.log('already listening to ' + _id);
    }

  };

  var secondround = false;

  my.onMsg = function() {
    // console.log('dummyConnector.onMsg',msgIndex,data.length);

    if (msgIndex >= data.length) {
      msgIndex = 0;
      console.log('resetting msgIndex to ' + msgIndex);
      secondround = true;
    }
    var msg = data[msgIndex].slice();

    msgIndex++;


    msg.shift();

    /*if(secondround){
      console.log('msg',msg);
    }*/



    var id = msg[0];



    var cback = callbacks[id];

    if (cback) {

      var jsonobj = cback(msg);
      //console.log(jsonobj);
      dataContainer[jsonobj.id] = jsonobj;
    }
    return my;
  };

  my.start = function() {
    console.log('dummyConnector.start');
    data = exampleData();
    intervalID = setInterval(this.onMsg, interval);
    return my;

  };

  my.stop = function() {
    console.log('dummyConnector.stop');
    clearInterval(intervalID);
    return my;
  };

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
  };



  return my;

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
    //  console.log('arrParser: id: ' + _id );
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



function calcMean(arr) {
  return calcSum(arr) / arr.length;
}

function calcSum(arr) {
  return arr.reduce(function(previousValue, currentValue) {
    return currentValue + previousValue;
  });
}