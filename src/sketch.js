
//var muse = null;

var STATE_REAL = 'real';
var STATE_FAKE = 'fake';
var state = STATE_REAL;

function setup() {
    createCanvas(800, 600);
    frameRate(5);
    if(state == STATE_REAL){
        muse = musedata.connect();
        //muse.connect();
    }
    else {
        muse = musedata.fake();
    }
}

function draw() {

    background(255);

    if(muse == null){
        console.log('muse == null');
        background('red');
        return;
    }
    

    if(state == STATE_REAL){
    	background('pink');
    }
    else if(state == STATE_FAKE){
        background('green');
    }
    else {
        console.log('state == ' + state);
        background('red');
        return;
    }

    console.log('state: ' + state);


    //TODO make convenience functions
    //muse.alpha(), muse.horseshoe()
    var eeg = muse.get('/muse/eeg');
    var alpha_relative = muse.get('/muse/elements/alpha_relative');
    var beta_relative = muse.get('/muse/elements/beta_relative');
    var delta_relative = muse.get('/muse/elements/delta_relative');
    var gamma_relative = muse.get('/muse/elements/gamma_relative');
    var theta_relative = muse.get('/muse/elements/theta_relative');
    var horseshoe = muse.get('/muse/elements/horseshoe');
    var is_good = muse.get('/muse/elements/is_good');
    var blink = muse.get('/muse/elements/blink');
    var jaw_clench = muse.get('/muse/elements/jaw_clench');
    var touching_forehead = muse.get('/muse/elements/touching_forehead');
    var concentration = muse.get('/muse/elements/experimental/concentration');
    var mellow = muse.get('/muse/elements/experimental/mellow');
    var raw_fft0 = muse.get('/muse/elements/raw_fft0');
    var raw_fft1 = muse.get('/muse/elements/raw_fft1');
    var raw_fft2 = muse.get('/muse/elements/raw_fft2');
    var raw_fft3 = muse.get('/muse/elements/raw_fft3');
    var alpha_absolute = muse.get('/muse/elements/alpha_absolute');
    var beta_absolute = muse.get('/muse/elements/beta_absolute');
    var delta_absolute = muse.get('/muse/elements/delta_absolute');
    var gamma_absolute = muse.get('/muse/elements/gamma_absolute');
    var theta_absolute = muse.get('/muse/elements/theta_absolute');


    push();
    var gap = 20;
    var left = 50;
    translate(left, gap);
    text('Muse Data ' + state + '   ( type key to switch between fake and real data )', 0, 0);

    push();
    translate(0, gap);
    translate(0, gap);
    drawElectrodes(eeg);
    translate(0, gap);
    drawElectrodes(delta_relative);
    translate(0, gap);
    drawElectrodes(theta_relative);
    translate(0, gap);
    drawElectrodes(alpha_relative);
    translate(0, gap);
    drawElectrodes(beta_relative);
    translate(0, gap);
    drawElectrodes(gamma_relative);
    translate(0, gap);
    drawElectrodes(delta_absolute);
    translate(0, gap);
    drawElectrodes(theta_absolute);
    translate(0, gap);
    drawElectrodes(alpha_absolute);
    translate(0, gap);
    drawElectrodes(beta_absolute);
    translate(0, gap);
    drawElectrodes(gamma_absolute);
    translate(0, gap);
    drawOneValue(blink);
    translate(0, gap);
    drawElectrodes(is_good);
    translate(0, gap);
    drawOneValue(jaw_clench);
    translate(0, gap);
    drawOneValue(touching_forehead);
    translate(0, gap);
    drawOneValue(concentration);
    translate(0, gap);
    drawOneValue(mellow);
    translate(0, gap);
    drawRawFFT(raw_fft0);
    translate(0, gap);
    drawRawFFT(raw_fft1);
    translate(0, gap);
    drawRawFFT(raw_fft2);
    translate(0, gap);
    drawRawFFT(raw_fft3);
    pop();
}


function keyTyped() {
    noLoop();
    console.log('key' + key);
    if (state == STATE_REAL) {
        state = STATE_FAKE;
        muse.stop();
        muse = null;
        muse = musedata.fake();
    } else if (state == STATE_FAKE) {
        state = STATE_REAL;
        muse.stop();
        muse = null;
        muse = musedata.connect();
    }
    loop();
}

function drawOneValue(data) {
    if (!data || !data.id) {
        text('no data', 0, 0);
        return;
    }
    var s = oneValueString(data);
    text(s, 0, 0);
}

function drawElectrodes(data) {
    if (!data || !data.id) {
        text('no data', 0, 0);
        return;
    }
    var s = electrodeString(data);
    text(s, 0, 0);
    //console.log(data);
}

function drawRawFFT(data) {
    if (!data || !data.id) {
        text('no data', 0, 0);
        return;
    }
    var s = rawFFTString(data);
    text(s, 0, 0);
}

function electrodeString(d) {
    var prec = 3;
    return d.id + '     leftEar: ' + nf(d.leftEar, null, prec) + '     leftFront: ' + nf(d.leftFront, null, prec) + '     rightFront: ' + nf(d.rightFront, null, prec) + '     rightEar: ' + nf(d.rightEar, null, prec);
}

function oneValueString(d) {
    return d.id + '     ' + d.value;
}

function rawFFTString(d) {
    var selection = d.values.slice(0, 10);
    selection = selection.map(function(a) {
        return nf(a, null, 1);
    });
    var arrstring = selection.join(' ');
    return d.id + '     ' + arrstring;
}
