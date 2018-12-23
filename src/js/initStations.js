
mapLandMeteotrek.prototype.initStations = function() {
	var that = this;
	var locale = this.locale;
	if(that.stationsGet === undefined) {
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
		name: 'stations_grid',
		show: { 
			toolbar: true,
			footer: true,
			selectColumn: true
		},
		columns: [
			{ field: 'recid', caption: 'ID', size: '5%' },
			{ field: 'StationNumber', caption: locale['St number'], size: '21%' },
			{ field: 'StationName', caption: locale['St name'], size: '12%' },
			{ field: 'Description', caption: locale['St description'], size: '16%' },
			{ field: 'LastData', caption: locale['Last data'], size: '23%' },
			{ field: 'FirstData', caption: locale['First data'], size: '23%' }
		],
		onExpand: function (event) {
			showSensorsSlider(event);			
		},
		onDblClick: function (event) {
			// перевірка який таб активний, якщо той що ми нажали ретурн
			var tab = '';
			if (w2ui.hasOwnProperty('info_tabs')) {
				tab = w2ui['info_tabs'].tabs.find(function(item) {
					return +item.id.slice(8) === +event.recid;
				});
			}
			if(tab) return;
			showInfSensors(event);
		},
		onReload: function(event) {
			w2ui['stations_grid'].clear();
			that.meteotrekGetData('stationsget_20')
				.then(function(res) {
					that.stationsGet = res;
				})
				.then(function() {
					addRows(that.stationsGet)
				});
		}
	});
	addRows(that.stationsGet);

	function addRows(data) {
		if(data === undefined) {
			w2alert(locale['Server error, data can not be obtained']);
			if(w2ui.hasOwnProperty('stations_grid')) {
				$().w2destroy('stations_grid');
				that.error500('#mts_main-content');
			}
			return;
		}
		var arr = [];
		for (var i = 0; i < data.length; i++) {
			arr.push({	recid: (+data[i].ID), StationNumber: (+data[i].StationNumber),
						Description: data[i].Description, StationName: data[i].StationName,
						LastData: data[i].LastData, FirstData: data[i].FirstData
					});
		}
		w2ui['stations_grid'].add(arr);
	};

	function showInfSensors(event, infoList) {
		// перевіряємо чи сторінка сформована
		if(!$('#info_sensors_block').length) {
			// формуємо головне вікно з заголовком, блоком для табів та блоком для гріда який потрібно показувати
			var div = '<div id="info_sensors_block" class="d-flex_column map-panel-def">'+
							'<div id="info_sensors_header" class="sensor__header">'+
								locale['Information about the station']+
								'<span class = "panel-info-close">'+
									'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 10.586L8.707 7.293a1 1 0 0 0-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 0 0 1.414 1.414L12 13.414l3.293 3.293a1 1 0 0 0 1.414-1.414L13.414 12l3.293-3.293a1 1 0 1 0-1.414-1.414L12 10.586z"></path></svg>'+
								'</span>'+
							'</div>'+
							'<div id="info_sensors_tabs"></div>'+
							'<div id="info_sensors_main" class="d-flex_column d-flex_h100"></div>'+
						'</div>';
			$('body').append(div);

			$('#info_sensors_block')
				.width(350)
				.height(450)
				.draggable({containment: 'parent',handle:'#info_sensors_header'})
				.css('position','absolute')
				.css('font-family','Verdana,Arial,sans-serif')
				.css('font-size','11px');

			$('#info_sensors_block .panel-info-close').on('click', function(){
				// видаляємо блок табів та гріди
				$().w2destroy('grid_info_tab');
				$().w2destroy('info_tabs');
				$('#info_sensors_block').remove();
			});
		}

		// знаходимо потрібний нам об'єкт з даними 
		var data = findSensors(that.stationsGet, event.recid);

		// перевіряємо чи сформований блок для табів
		if (w2ui.hasOwnProperty('info_tabs')) {

			// перевіряємо чи таб створено
			addTab(data);
			// w2ui['info_tabs'].scroll('right');

		} else {
			// створюємо табс
			$('#info_sensors_tabs').w2tabs({
				name: 'info_tabs',
				active: 'info_tab'+data[0].ID,
				tabs: [
					{ id: 'info_tab'+data[0].ID, text: data[0].StationName, closable: true }
				],
				onClose: function(event) {
					if(w2ui.hasOwnProperty('grid_info_tab')) $().w2destroy('grid_info_tab');
					if(w2ui['info_tabs'].tabs.length === 1) {
						$().w2destroy('info_tabs');
						$('#info_sensors_block').remove();
					} else {
						// рендер таба з 0 індексом
						var id = +w2ui['info_tabs'].tabs[0].id.slice(8);
						data = findSensors(that.stationsGet, id);
						renderGrid(data);
						w2ui['info_tabs'].active = 'info_tab'+id;
						w2ui['info_tabs'].refresh();	// НЕ ОНОВЛЮЄ АКТИВНІСТЬ ПЕРШОГО ТАБУ
						console.log('рендер таба з 0 індексом');
					}
				},
				onClick: function(event) {
					$().w2destroy('grid_info_tab');
					var id = +event.target.slice(8);
					data = findSensors(that.stationsGet, id);
					renderGrid(data);
				}
			});
			renderGrid(data);
		}

		function addTab(data) {
			w2ui['info_tabs'].add({ id: 'info_tab'+data[0].ID, text: data[0].StationName, closable: true });
			w2ui['info_tabs'].active = 'info_tab'+data[0].ID;
			w2ui['info_tabs'].refresh();
			if(w2ui.hasOwnProperty('grid_info_tab')) $().w2destroy('grid_info_tab');
			renderGrid(data);

			// якщо к-ть табів переищує 3 ми видаляємо таб з 0 індексом в масиві w2ui.info_tabs.tabs
			if (w2ui.info_tabs.tabs.length > 3) {
				w2ui.info_tabs.remove(w2ui.info_tabs.tabs[0].id);
			}
		};
		function findSensors(arr, id) {
			return arr.filter(function(item, i, arr) {
				return (item.ID == id);
			});
		};
		function renderGrid(data) {
			$('#info_sensors_main').w2grid({
				name: 'grid_info_tab',
				show: {
					toolbar: true,
					footer: true
				},
				columns: [
					{ field: 'recid', caption: 'ID', size: '5%' },
					{ field: 'Cname', caption: locale['Sens name'], size: '20%' },
					{ field: 'LastValue', caption: locale['Sens value'], size: '20%' },
					{ field: 'Unit', caption: locale['Sens unit'], size: '15%' },
					{ field: 'ParamDesc', caption: locale['Sens description'], size: '20%' },
					{ field: 'Error', caption: locale['Sens indicator'], size: '20%' }
				]
			});
			addRows(data[0].Sensors, data[0].ID);
			function addRows(data, id) {
				var arr = [];
				for (var i = 0; i < data.length; i++) {
					arr.push({	recid: data[i].ParamID, Cname: data[i].Cname,
								LastValue: data[i].LastValue, Unit: data[i].Unit,
								ParamDesc: data[i].ParamDesc, Error: data[i].Error
							});
				}
				w2ui['grid_info_tab'].add(arr);
			};
		};
	};

	function showSensorsSlider(event) {
		var data = that.stationsGet.find(item => item.ID == event.recid).Sensors;

		var div =	'<div class="sensors__inf-'+ event.box_id+'">'+
						'<div class="sl-'+ event.box_id+'">';

		div += data.map(item => {
							var i = item.Unit.length > 3 ? 'sl__long_text' : '';
							return '<div class="sl__item" title="'+that.locale[item.ParamDesc]+
								'"><img src="mapLandMeteotrek/src/img/'+ICONS[item.ParamDesc]+
								'.png" class="sl__img"><span class="sl__text '+i+'">'+item.LastValue+
								' '+item.Unit+'</span></div>'
						});	
		
		div += '</div></div>';
		$('#' + event.box_id).html(div).animate({ height : 30 }, 100);
		$('.sl-'+ event.box_id).slick({
			infinite: true,
			slidesToShow: 5,
			slidesToScroll: 3
		});
	};
};
