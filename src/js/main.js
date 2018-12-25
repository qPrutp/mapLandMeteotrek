/************************ Vasyl Savitskyy ***
*											*
*			Meteotrek module				*
*											*
*********************** 24/10/2018 till now */

var MeteotrekMap = void(0);

$(function() {
	$(function() {
		MeteotrekMap = new mapLandMeteotrek();
	});
});

function mapLandMeteotrek() {
	this.sensorsLibGet = {};
	this.stationsGet = {};
	this.dataGet = {};
//////////////////////// локальна заготовка даних з більш ніж 10 станції
	this.stationsGet = JSON.parse($.ajax({
			dataType: "json",
			url: 'mapLandMeteotrek/data/list.json',
			async:false,
			error:function(e){
				if(e.status == 404){
					w2alert('mapLandMeteotrek/data/list.json');
				}
			}
		}).responseText);
	this.stationsGet = this.stationsGet.res;
/////////////////////////
	this.locale = JSON.parse($.ajax({
			dataType: "json",
			url: 'mapLandMeteotrek/locale/'+theMap.options.locale+'.json',
			async:false,
			error:function(e){
				if(e.status == 404){
					w2alert('Не знайдено mapLandMeteotrek/locale/'+theMap.options.locale+'.json');
				}
			}
		}).responseText);

	this.initPane();
	this.initEvents();
};

mapLandMeteotrek.prototype.initEvents = function() {
	$('#dvProj').on('mapopened', function(e) {
		if (typeof MeteotrekMap !== 'undefined') {
			MeteotrekMap.button(e.map);
		}
	});
};

// створення кнопки на панелі користувача
mapLandMeteotrek.prototype.button = function(map) {
	var theMap = map;
	var that = this;
	$('#dvMap .controls-panel > .toolbar-panel')
		.append('<div id="panel_button_mts" class="control-button-mts control-button clickable"'+
			' title="'+this.locale['The control and forecast of weather conditions']+'"></div>');
	
	$('#panel_button_mts').on('click', function() {
		$('#panel_button_mts').toggleClass('control-button-active');
		$('#mts').toggle();
		if ($('#panel_button_mts').hasClass('control-button-active')) {
			that.meteotrekGetData('sensorslibget_20')				// дані з сервера
				.then((res) => {
					that.sensorsLibGet = res[0];
				})
				.then(() => w2ui.mts_tabs.click('testForm'));
			// w2ui.mts_tabs.click('testForm');
		} else {
			
		}
	});

	$('#mts_header .panel-info-close').on('click', function(){
		$('#panel_button_mts').toggleClass('control-button-active');
		$('#mts').toggle();
	});
};

// Создание главного окна приложения для отображения основных данных
mapLandMeteotrek.prototype.initPane = function() {
	var div = '<div id="mts" class="mts d-flex_column map-panel-def">'+
					'<div id="mts_header" class="mts__header">'+
						this.locale['The information from']+
						this.locale['donor']+
						'<span class = "panel-info-close">'+
							'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 10.586L8.707 7.293a1 1 0 0 0-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 0 0 1.414 1.414L12 13.414l3.293 3.293a1 1 0 0 0 1.414-1.414L13.414 12l3.293-3.293a1 1 0 1 0-1.414-1.414L12 10.586z"></path></svg>'+
						'</span>'+
					'</div>'+
					'<div id="mts_main" class="mts__main d-flex_column d-flex_h100">'+
						'<div id="mts_main-header" class="mts__main-header">'+
						'</div>'+
						'<div id="mts_main-content" class="mts__main-content d-flex_h100">'+
						'</div>'+
					'</div>'+
				'</div>';
	$('#dvMap').append(div);
	$('#mts')
			.resizable({handles:"e,s",minWidth:630,minHeight:62,containment:"#dvMap"})
			.draggable({containment: 'parent',handle:'#mts_header'})
			.hide();

	var that = this;
	$('#mts_main-header').w2tabs({
		name: 'mts_tabs',
		tabs: [
			{ id: 'stationsget', text: this.locale['Stations'] },
			{ id: 'testForm', text: this.locale['For period'] },
			{ id: 'sensorslibget', text: this.locale['Description'] }
		],
		onClick: function(event) {
			switch(event.target) {
				case 'stationsget':
					if (w2ui.hasOwnProperty('stations_grid')) { break; }

					// видаляємо слухач resize щоб пізніше добавити новий для зміни розміру w2ui блоку
					$('#mts').unbind('resize');
 					$().w2destroy('description_grid');
 					$().w2destroy('mts_form');
					// that.meteotrekGetData('stationsget_20')					// дані з сервера
					// 	.then((res) => {
					// 		that.stationsGet = res;
					// 	})
					// 	.then(() => {
					// 		that.initStations();
					// 	});
					that.initStations();									// локальні дані

					$('#mts').bind('resize', function() {
						w2ui['stations_grid'].resize();
					});
					break;
				case 'sensorslibget':
					if (w2ui.hasOwnProperty('description_grid')) { break; }

					$('#mts').unbind('resize');
					$().w2destroy('stations_grid');
					$().w2destroy('mts_form');
					that.initDescription();

					$('#mts').bind('resize', function() {
						w2ui['description_grid'].resize();
					});
					break;
				case 'testForm':
					if (w2ui.hasOwnProperty('mts_form')) { break; }

					$('#mts').unbind('resize');
					$().w2destroy('stations_grid');
					$().w2destroy('description_grid');
					$().w2destroy('stations_grid');
					// that.meteotrekGetData('stationsget_20')					// дані з сервера
					// 	.then((res) => {
					// 		that.stationsGet = res;
					// 	})
					// 	.then(() => that.initTestForm());
					that.initTestForm();

					$('#mts').bind('resize', function() {
						w2ui['mts_form'].resize();
					});
					break;
				default:
					w2alert('Шеф, все пропало!');
					console.error('Шеф, все пропало!');	// to do альтернатива
					break;
			}
		}
	});

	// Ініціалізація кнопки на панелі користувача
	this.button(theMap);
};
