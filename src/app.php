<?php

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

function mtsHeaders()
{
	?>
	<!-- slider slick -->
	<link rel="stylesheet" href="meteotrek/libs/slick/slick-theme.css">
	<link rel="stylesheet" href="meteotrek/libs/slick/slick.css">
	<script type="text/javascript" src="meteotrek/libs/slick/slick.min.js"></script>
	<!-- chart -->
	<script type="text/javascript" src="meteotrek/libs/chart/Chart.min.js"></script>
	<script type="text/javascript" src="meteotrek/libs/chart/hammer.min.js"></script>
	<script type="text/javascript" src="meteotrek/libs/chart/chartjs-plugin-zoom.min.js"></script>
	
	<!-- Подключение "Meteotrek" -->
	<link rel="stylesheet" href="meteotrek/src/style/meteotrek.css">
	<script type="text/javascript" src="meteotrek/src/js/const.js"></script>
	<script type="text/javascript" src="meteotrek/src/js/main.js"></script>
	<script type="text/javascript" src="meteotrek/src/js/loadingFromMeteotrek.js"></script>
	<script type="text/javascript" src="meteotrek/src/js/initDescription.js"></script>
	<script type="text/javascript" src="meteotrek/src/js/initStations.js"></script>
	<script type="text/javascript" src="meteotrek/src/js/initTestForm.js"></script>
	<script type="text/javascript" src="meteotrek/src/js/error500.js"></script>
	<?php
}
?>