
Meteotrek.prototype.initDescription = function() {
	var that = this;
	var locale = this.locale;
	var grid = 'description_grid';

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
			name: grid,
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

		that.CreateSearchPanel(grid);

	function addRows(data) {
		var arr = [];
		for (var i = 0; i < data.sensorNum; i++) {
			arr.push({ recid: (+data.Sensor[i].ID), name: data.Sensor[i].Name, description: data.Sensor[i].Description });
		}
		w2ui['description_grid'].add(arr);
	};
};

Meteotrek.prototype.CreateSearchPanel = function(objType) {
	var grid = objType;
	var searchBarHtml = '';

	if (w2ui[grid]) {
		if (w2ui[grid].show.lineNumbers === true)
            searchBarHtml = '<td class="w2ui-col-number"></td>';

        w2ui[grid].columns.forEach(function (column) {
        	if (!column.hidden) {
                var columnHtml = '';

                if (column.field == 'GI_LINK_MAP') {
                    columnHtml = '<div class="filter" title="test"></div>'
                } else {
                    var inputClass = column.dbtype ? 'class="' + column.dbtype.toLowerCase() + '" ' : '';
                    columnHtml = '<div onclick="MeteotrekMap.ShowSearchConditions(\'' + grid + '\',\'' + column.field + '\')" class="condition">=</div>'
                        + '<div class="input"><input type="text" name="' + column.field + '" ' + inputClass + 'maxlength="100" /></div>';
                }

                searchBarHtml += '<td id="mts' + grid + '_' + column.field + '" class="w2ui-col-search">' + columnHtml + '</td>';
            }
        });
	}

	searchBarHtml += '<td class="w2ui-col-search"></td>';

    $('#mts' + grid + 'SearchBar').remove();
    $('#grid_' + grid + '_columns > table > tbody').append('<tr id="mts' + grid + 'SearchBar" class="w2ui-grid-search">' + searchBarHtml + '</tr>');

};

Meteotrek.prototype.ShowSearchConditions = function(objType, field) {
	console.log('ShowSearchConditions');
	$('#mts' + objType + '_' + field + ' .condition').w2overlay({
		html: this.summarySearchConditions,
		onShow: function () {
			$('#mtsSearchConditions').data('type', objType);
			$('#mtsSearchConditions').data('field', field);
			$('#mtsSearchConditions li').removeClass('current');
			$('#mtsSearchConditions li[data-id=' + $('#mts' + objType + '_' + field + ' .condition').data('id') + ']').addClass('current');
		}
	});
};
