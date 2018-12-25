
mapLandMeteotrek.prototype.initDescription = function() {
	var that = this;
	var locale = this.locale;
	if(that.sensorsLibGet === undefined) {
		w2alert(locale['Server error, data can not be obtained']);
		if($('#error500').length) return;
		that.error500('#mts_main-content');
		return;
	} else {
		if($('#error500').length) {
			$('#error500').remove();
			$('#mts_main-content').removeClass('d-flex_column');
		}
	}
	
	$('#mts_main-content').w2grid({
			name: 'description_grid',
			show: { 
				toolbar: true,
				footer: true,
				lineNumbers : true
			},
			multiSearch: false,
			columns: [
				{ field: 'recid', caption: 'ID', size: '5%', sortable: true },
				{ field: 'name', caption: locale['Sens name'], size: '20%', sortable: true },
				{ field: 'description', caption: locale['Sens description'], size: '40%', sortable: true }
			],
			searches: [
				{ type: 'int',  field: 'recid', caption: 'ID' },
				{ type: 'text', field: 'name', caption: locale['Sens name'] },
				{ type: 'text', field: 'description', caption: locale['Sens description'] }
			],
			onReload: function(event) {
				console.log(event);
				w2ui['description_grid'].clear();
				that.meteotrekGetData('sensorslibget_20')
					.then((res) => {
						that.sensorsLibGet = res[0];
					})
					.then(() => addRows(that.sensorsLibGet));
			}
		});
		addRows(that.sensorsLibGet);

	function addRows(data) {
		var arr = [];
		for (var i = 0; i < data.sensorNum; i++) {
			arr.push({ recid: (+data.Sensor[i].ID), name: data.Sensor[i].Name, description: data.Sensor[i].Description });
		}
		w2ui['description_grid'].add(arr);
	};
};
