//connection to muse
//muse = museData().connection('http://127.0.0.1:8081');

//connection with dummyData
muse = museData().dummyData();
//musefake = museData().dummyData();

muse.listenTo('/muse/eeg');
muse.listenTo('/muse/elements/alpha_relative');
muse.listenTo('/muse/elements/beta_relative');
muse.listenTo('/muse/elements/delta_relative');
muse.listenTo('/muse/elements/gamma_relative');
muse.listenTo('/muse/elements/theta_relative');
muse.listenTo('/muse/elements/horseshoe');
muse.listenTo('/muse/elements/is_good');
muse.listenTo('/muse/elements/blink');
muse.listenTo('/muse/elements/jaw_clench');
muse.listenTo('/muse/elements/touching_forehead');
muse.listenTo('/muse/elements/experimental/concentration');
muse.listenTo('/muse/elements/experimental/mellow');
muse.listenTo('/muse/elements/raw_fft0');
muse.listenTo('/muse/elements/raw_fft1');
muse.listenTo('/muse/elements/raw_fft2');
muse.listenTo('/muse/elements/raw_fft3');
muse.listenTo('/muse/elements/alpha_absolute');
muse.listenTo('/muse/elements/beta_absolute');
muse.listenTo('/muse/elements/delta_absolute');
muse.listenTo('/muse/elements/gamma_absolute');
muse.listenTo('/muse/elements/theta_absolute');


//start data transmission
muse.start();

var STATE_REAL = 'state_real';
var STATE_DUMMY = 'state_dummy';
var STATE = STATE_REAL;

function setup() {
	createCanvas(800,600);
	frameRate(10);

}

function draw() {

	background(255);


	/*if(STATE == STATE_REAL){
		realTest();
	}
	else if(STATE == STATE_DUMMY){
		dummyTest();
	}*/



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
text('Muse Data',20,20);
var gap = 20;
var left = 50;
push();
translate(gap,left);
drawElectrodes(eeg);
//drawElectrodes('delta_relative',delta_relative);
//drawElectrodes('theta_relative',theta_relative);
//drawElectrodes('alpha_relative',alpha_relative);
//drawElectrodes('beta_relative',beta_relative);
//drawElectrodes('gamma_relative',gamma_relative);
//drawElectrodes('delta_absolute',delta_absolute);
//drawElectrodes('theta_absolute',theta_absolute);
//drawElectrodes('alpha_absolute',alpha_absolute);
//drawElectrodes('beta_absolute',beta_absolute);
//drawElectrodes('gamma_absolute',gamma_absolute);
//drawOneValue('blink',blink);
//drawOneValue('is_good',is_good);
//drawOneValue('jaw_clench',jaw_clench);
//drawOneValue('touching_forehead',touching_forehead);
//drawOneValue('concentration',concentration);
//drawOneValue('mellow',mellow);
//drawRawFFT('raw_fft0',raw_fft0);
//drawRawFFT('raw_fft1',raw_fft1);
//drawRawFFT('raw_fft2',raw_fft2);
//drawRawFFT('raw_fft3',raw_fft3);
pop();
}

function drawElectrodes(data){

	if(!data || !data.id){
		text('no data',0,0);
		return;
	}
	var s = electrodeString(data);
	text(s,0,0);
	console.log(data);
	
}

function electrodeString(d){
	return d.id + '     leftEar: ' + nf(d.leftEar,null,1) + '     leftFront: ' + nf(d.leftFront,null,1) + '     rightFront: ' + nf(d.rightFront,null,1) + '     rightEar: ' + nf(d.rightEar,null,1); 	
}

/*
put this callback into museData in order to make things easier

function parseMsg(msg) {
		console.log('parseMsg',msg);
		//console.log('this',this);
  
  
}
*/