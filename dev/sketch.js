
//connection to muse
//muse = museData().connection('http://127.0.0.1:8081');
		
//connection with dummyData
muse = museData().dummyData();
//muse = museData().dummyData(500);

//setting up callbacks to specific id's
//muse.listenTo('/muse/eeg',parseMsg);
muse.listenTo('/muse/eeg');
muse.listenTo('/muse//muse/elements/raw_fft0');
muse.listenTo('/muse/elements/experimental/mellow');
//muse.listenTo('/muse/elements/raw_fft0', parseMsg);

//start data transmission
muse.start();


function setup() {
  frameRate(1);
}

function draw() {
  

	var eeg = muse.get('/muse/eeg');
	console.log('eeg');
	console.log(eeg);

	var raw_fft0 = muse.get('/muse//muse/elements/raw_fft0');
	console.log('raw_fft0');
	console.log(raw_fft0);


	var mellow = muse.get('/muse/elements/experimental/mellow');
	console.log('mellow');
	console.log(mellow);


}

/*
put this callback into museData in order to make things easier

function parseMsg(msg) {
		console.log('parseMsg',msg);
		//console.log('this',this);
  
  
}
*/