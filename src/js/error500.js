mapLandMeteotrek.prototype.error500 = function(parent) {
	var locale = this.locale;
	var div = '<div id="error500" class="error500 d-flex_h100 d-flex_column error">'+
				'<div style="text-align: center;">'+
					'<h1>error 500</h1>'+
					'<p>'+locale['Sorry, it\'s me, not you.']+'</p>'+
					'<p>:(</p>'+
				'</div>'+
			'</div>';
	$(parent).addClass('d-flex_column');
	$(parent).append(div);
}