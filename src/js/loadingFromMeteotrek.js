

Meteotrek.prototype.meteotrekGetData = function (serviceName, dataget) {
	// - Временные данные для соединения с сервером --------------------------------------
	var PASS = 'DBDD3E9B819FF76A48085AFF85B0B0988273AF0DA54E20CB1BB0930329FFC0E1';		//
	var LOGIN = 'globalgis';															//
	// -----------------------------------------------------------------------------------
	var send_data = '';
	var dataget = dataget || false;

	if(!dataget) {
		send_data = `'login=${LOGIN}&pass=${PASS}'`;
	} else {
		send_data = `'login=${LOGIN}&pass=${PASS}${dataget}'`;
	}

	return fetch(`${this.serviceUrl}${serviceName}`, {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
		},
		body: `${send_data}`
	})
		.then(r => r.json())
		.then(r => {
			if(r.RequestStatus === 200) {
				// console.log('r: ',r);
				return r.res || r;
			} else {
				console.error('Error: ', r.RequestDescription);
			}
		});
};
