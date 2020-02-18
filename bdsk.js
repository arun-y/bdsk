var bleno = require('bleno');

bleno.on('stateChange', function (state) {
	console.log('on -> stateChange: ' + state);
	if (state === 'poweredOn') {
		bleno.startAdvertising('BDSK', ['1803']);
	} else {
		bleno.stopAdvertising();
	}
});

bleno.on('advertisingStart', function (error) {
	console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

	if (!error) {
		bleno.setServices([
			// link loss service
			new bleno.PrimaryService({
				uuid: '1803',
				characteristics: [
					// Alert Level
					new bleno.Characteristic({
						value: 0,
						uuid: '2A06',
						properties: ['read', 'write'],
						onReadRequest: function (offset, callback) {
							console.log('link loss.alert level READ:');
							data = [ 0x10 ];
							var octets = new Uint8Array(data);
							console.log(octets);
							callback(this.RESULT_SUCCESS, octets);
						},
						onWriteRequest: function (data, offset, withoutResponse, callback) {
							console.log("link loss.alert level WRITE "+data[0]);
							this.value = data;
							
							callback(this.RESULT_SUCCESS);
						}
					})
				]
			}),
			// immediate alert service
			new bleno.PrimaryService({
				uuid: '1802',
				characteristics: [
					// Alert Level
					new bleno.Characteristic({
						value: 0,
						uuid: '2A06',
						properties: ['writeWithoutResponse'],
						onWriteRequest: function (data, offset, withoutResponse, callback) {
							console.log("immediate alert.alert level WRITE "+data[0]);
							callback(this.RESULT_SUCCESS);
						}
					})
				]
			}),
			// proximity monitoring service
			new bleno.PrimaryService({
				uuid: '3E099910293F11E493BDAFD0FE6D1DFD',
				characteristics: [
					//client proximity
					new bleno.Characteristic({
						value: 0,
						uuid: '3E099911293F11E493BDAFD0FE6D1DFD',
						properties: ['writeWithoutResponse'],
						onWriteRequest: function (data, offset, withoutResponse, callback) {
							console.log("proxymity monitoring.client proximity WRITE "+data[0]);
							callback(this.RESULT_SUCCESS);
						}
					})
				]
			}),
		]);
	}
});

bleno.on('servicesSet', function (error) {
	console.log('on -> servicesSet: ' + (error ? 'error' + error : 'success'));
});

bleno.on('accept', function (clientAddress) {
	console.log('on -> accept, client: ' + clientAddress);
});

bleno.on('disconnect', function (clientAddress) {
	console.log("Disconnected from address: " + clientAddress);
});

			
	


