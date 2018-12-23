

mapLandMeteotrek.prototype.meteotrekGetData = function (serviceName, dataget) {
	// meteotrek.com получение данных
	var SERVICE_URL = 'https://api.meteotrek.com/api/';
	// - Временные данные для соединения с сервером --------------------------------------
	// -----------------------------------------------------------------------------------
	var send_data = '';
	var dataget = dataget || false;

	if(!dataget) {
		send_data = `'login=${LOGIN}&pass=${PASS}'`;
	} else {
		send_data = `'login=${LOGIN}&pass=${PASS}${dataget}'`;
	}

	return fetch(`${SERVICE_URL}${serviceName}`, {
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
