
mapLandMeteotrek.prototype.initTestForm = function() {
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
	console.log('initTestForm: ',that.stationsGet);

	// формуємо максимальну дату для датапікера
	var now = new Date();
	now = now.getDate()+'.'+(now.getMonth() + 1)+'.'+now.getFullYear();

	var sens1 = [];
	var sid = null;
	var stations = [[],[]];
	that.stationsGet.map(function(station) {
		stations[0].push(station.StationName), stations[1].push(station.ID);
	});

	w2utils.settings.date_format = 'dd.mm.yyyy';

	var div =	'<div id="test_form" class="period-form">'+
					'<div class="w2ui-page page-0 d-flex_column" id="page_0">'+
						'<div class="w2ui-field">'+
							'<label>'+locale['List Stations']+':</label>'+
							'<div>'+
								'<input name="list_mts" type="text" style="width: 50%">'+
							'</div>'+
						'</div>'+
						'<div class="w2ui-field">'+
							'<label>'+locale['Date Range']+':</label>'+
							'<div>'+
								'<input name="dates" type="text"> - <input name="datef" type="text">'+
							'</div>'+
						'</div>'+
						'<div class="w2ui-field">'+
							'<label>'+locale['Time Range']+':</label>'+
							'<div>'+
								'<input name="times" type="text"> - <input name="timef" type="text">'+
							'</div>'+
						'</div>'+
						'<div class="d-flex_h100 d-flex_column">'+
							'<div class="w2ui-field">'+
								'<label>'+locale['Sensor list']+':</label>'+
								'<div>'+
									'<input name="check_sens1" type="checkbox" disabled>'+
								'</div>'+
							'</div>'+
							'<div id="sens1_list" class="d-flex_h100"></div>'+
						'</div>';

	div +=			'</div>'+
					'<div class="w2ui-buttons">'+
						'<button class="w2ui-btn mts__btn" name="reset">'+locale['Reset']+'</button>'+
						'<button class="w2ui-btn mts__btn" name="send">'+locale['Send']+'</button>'+
					'</div>'+
				'</div>';
	$('#mts_main-content').append(div);

	$('#test_form').w2form({
		name: 'mts_form',
		method: 'post',
		fields: [
			{ name: 'list_mts', type: 'list', required: true, options: { placeholder: locale['Select station'], items: stations[0], id: stations[1] } },
			{ name: 'dates',  type: 'date', options: { end: now } },
			{ name: 'datef',  type: 'date', options: { end: now } },
			{ name: 'times',  type: 'time' },
			{ name: 'timef',  type: 'time' },
			{ name: 'check_sens1', type: 'checkbox' }
		],
		onChange: function (event) {
			switch(event.target) {
				// навішуємо слухач на вибір к-ті сенсорів
				case 'list_mts':
					if(event.value_new.text === event.value_previous.text) break;
					$('#check_sens1').prop('disabled', false);
					sid = initSid('#list_mts');
					if(w2ui.hasOwnProperty('sensors_grid')) {
						$().w2destroy('sensors_grid');
						sens1 = [];
						w2ui['mts_form'].reload();
					}
					break;
				case 'check_sens1':
					// якщо check_sens1 вибраний то відмалювати таблицю з доступними сенсорами
					if(event.value_previous == '') {
						var sensors = that.stationsGet.find(item => item.ID == sid).Sensors;
						initSens1Grid(sensors);
					} else {
						if(w2ui.hasOwnProperty('sensors_grid')) {
							$().w2destroy('sensors_grid');
							sens1 = [];
						}
					}
					break;
				default:
					break;
			}
		},
		actions: {
			"reset": function () {
				this.clear();
				w2ui['mts_form'].validate();
			},
			"send": function (event) {
				if(w2ui['mts_form'].validate().length) return;
				
				// формуємо дати для запиту
				var dates = '&dates=' + initDate('#dates', '#times', 0);
					datef = '&datef=' + initDate('#datef', '#timef', 1);

				if(sens1.length == 0) {
					sens1 = '*';
				} else {
					if(sens1 != '*') {
						sens1.join(',');
					}
				}

				// перевіряємо які з сенсорів вибрані в таблиці доступних сенсорів
				if(w2ui.hasOwnProperty('sensors_grid') && w2ui['sensors_grid'].getSelection().length !== 0) sens1 = w2ui['sensors_grid'].getSelection();
				
				var sendData = '&sid=' + sid + dates + datef + '&sens1=' + sens1;
				
				that.meteotrekGetData('dataget_20', sendData)
					.then((res) => {
						if(res[0] == null) {
							w2alert('Данных нет! укажите другой временный интервал!');
						} else {
							// якщо вже сформовано діалогове вікно 
							if($('#chart').length) $('#chart').remove();
							that.dataGet = res[0];
							showSensorsData(sid, sens1, $('#list_mts').val());
						}
					});

				var obj = this;
				// obj.clear();
			}
		}
	});

	// визначаємо sid
	function initSid(item) {
		var sName = $(item).val();
		var index = 0;
		for (var i = 0; i < stations[0].length; i++) {
			if(stations[0][i] == sName) index = i;
		}
		return stations[1][index];
	};

	// index вказує формувати першу чи другу дату
	function initDate(date, time, index) {
		if(!index) {
			if($(date).val() === '') {
				return 'last';
			} else {
				return $(date).val() + initTime(time, index);
			}
		} else {
			if($(date).val() === '') {
				var now = new Date();
				// для сервера вожливо щоб к-ть днів була в форматі 01 ~ 31 тому додаємо перевірку для днів меньших 10
				return addZero(now.getDate())+'.'+addZero(now.getMonth()+1)+'.'+now.getFullYear() + initTime(time);
			} else {
				return $(date).val() + initTime(time);
			}
		}

		function initTime(time, index) {
			var item = $(time).val();
			if(item === '') {
				if(index !== 0) {
					var now = new Date();
					return ' '+addZero(now.getHours())+':'+addZero(now.getMinutes())+':00';
				}
				return ' 00:00:00';
			} else {
				var t = item.split(':');
				if(t[0].length == 1) {
					return ' 0' + item + ':00';
				} else {
					return ' ' + item + ':00';
				}
			}
		};

		function addZero(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		};
	};

	// ініціалізуємо таблицю з доступними сенсорами
	function initSens1Grid(data) {
		$('#sens1_list').w2grid({
			name: 'sensors_grid',
			show: { 
				selectColumn: true
			},
			columns: [
				{ field: 'recid', caption: locale['ID the sensor'], size: 50, sortable: true },
				{ field: 'description', caption: locale['Description the sensor'], size: 100, sortable: true }
			],
			// спрацьовує при виборі рядка
			onSelect: function(event) {
				if(event.all) {
					sens1 = [];
					return;
				}
				if(sens1 === '*') {
					sens1 = [];
				}
				if(sens1.indexOf(+event.recid) === -1)
					sens1.push(+event.recid);
			},
			//спрацьовує при відміні вибору рядка
			onUnselect: function(event) {
				if(sens1 === '*') {
					sens1 = [];
				}
				if(event.all) {
					sens1 = [];
					return;
				}
				if(event.recid) {
					sens1 = [];
					data.map(function(item) {
						if(item.ParamID !== +event.recid)
							sens1.push(item.ParamID);
					});
				}
			},
			onClick: function(event) {
				// визначаємо які з сенсорів були виділені за допомогою виділення мишкою
				event.onComplete = function () {
					sens1 = this.getSelection();
					return;
				}
			}
		});
		addRows(data);
	};

	function addRows(data) {
		var arr = [];
		for (var i = 0; i < data.length; i++) {
			arr.push({ recid: data[i].ParamID, description: data[i].ParamDesc });
		}
		w2ui['sensors_grid'].add(arr);
	};

	function showSensorsData(sid, sens1, name) {

		var div ='<div id="chart" class="chart d-flex_column map-panel-def">'+
					'<div id="chart_header_'+sid+'" class="chart__header_'+sid+' chart__header">'+
						locale['Station']+': '+name+
						'<span class = "panel-info-close">'+
							'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 10.586L8.707 7.293a1 1 0 0 0-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 0 0 1.414 1.414L12 13.414l3.293 3.293a1 1 0 0 0 1.414-1.414L13.414 12l3.293-3.293a1 1 0 1 0-1.414-1.414L12 10.586z"></path></svg>'+
						'</span>'+
					'</div>'+
					'<div id="chart_main_'+sid+'" class="chart__main_'+sid+' d-flex_h100">'+
						'<canvas id="show_chart_'+sid+'" style="width: 100%; height: 300px;"></canvas>'+
					'</div>'+
				'</div>';
		$('body').append(div);

		$('#chart')
			.height(350)
			.draggable({containment: 'parent',handle:'#chart_header_'+sid})
			.css('position','absolute')
			.css('font-family','Verdana,Arial,sans-serif')
			.css('font-size','11px');

		$('#chart .panel-info-close').on('click', function(){
			$('#chart').remove();
		});

		// формуємо дані для chart діаграми
		var CHAR = document.getElementById('show_chart_'+sid);
		var labels = [];
		var datasets = [];

		// формуємо коректність даних для графіку, тому передбачаємо наступну поведінку, якщо в запиті не має показів сенсору
		// його знаяення буде рівно 0, якщо в запиті є декілька показів одного сенсору, беремо перший а решту ігноруємо
		// та відкидаємо сенсори які нам недоступні (бувають випадки потрапляння неіснуючого сенсору)
		var station = that.stationsGet.map(function(item) {
					if(item.ID === sid) {
						return item.Sensors;
					}
				}) || null;
		if(station) {
			station = station[0];
		} else {
			w2alert(locale['Data mismatch']);
			return;
		}
		// визначаємо які саме сенсори відображати на діаграмі для цього звіряємось з sens1
		var points = [];
		if(sens1 === '*') {
			points = station;
		} else {
			station.map(function(item) {
				if(sens1.indexOf(item.ParamID) !== -1) points.push(item);
			});
		}

		for (var i = 0; i < that.dataGet.recordsNum; i++) {
			// формуємо labtls
			labels.push(that.dataGet.points[i].time);
			// ітерація по кількості доступних сенсорів і не по тим скільки прийшло в запиті, щоб уникнути помилки
			for (var j = 0; j < points.length; j++) {
				var data;
				if(i === 0) {
					var obj = new Object();
					obj.label = locale[points[j].ParamDesc];
					obj.fill = false;
					obj.lineTension = 0.1;
					obj.backgroundColor = COLORS.names[points[j].ParamDesc];
					obj.key = points[j].ParamID;		// для подальшого зручного пошуку даних по id сенсора (параметр не повязаних з графіком)
					data = that.dataGet.points[i].SD.find(item => item.Sensor == obj.key);
					data === undefined ? data = 0 : data = data.Value.replace(/,/g, ".");
					datasets.push(obj);
					datasets[j].data = [data];
				} else {
					data = that.dataGet.points[i].SD.find(item => item.Sensor == datasets[j].key);
					data === undefined ? data = 0 : data = data.Value.replace(/,/g, ".");
					datasets[j].data.push(data);
				}
			}
		}

		var options = {
				scales: {
					yAxes: [{
						ticks: {
							responsive: true,
							beginAtZero: true
						}
					}]
				},
				legend: {
					position: 'left',
					usePointStyle: true,
					labels: {
						usePointStyle: true
					}
				},
				tooltips: {
					mode: 'index',
					position: 'nearest'
				},
				pan: {
					enabled: true,
					mode: 'x',
					rangeMin: {
						x: 100,
						y: 100
					},
					rangeMax: {
						x: 100,
						y: 100
					}
				},
				zoom: {
					enabled: true,
					drag: false,
					mode: 'x',
					rangeMin: {
						x: 500,
						y: 500
					},
					rangeMax: {
						x: 1000,
						y: 1000
					}
				}
			};

		var data = {
				labels: labels,
				datasets: datasets
			};

		var lineChart = new Chart(CHAR, {
				type: that.dataGet.recordsNum != 1 ? 'line' : 'horizontalBar',
				data: data,
				options: options
			});
	};

};
