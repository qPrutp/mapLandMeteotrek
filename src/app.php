<?php

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

function mtsHeaders()
{
	?>
	<!-- slider slick -->
	<link rel="stylesheet" href="mapLandMeteotrek/libs/slick/slick-theme.css">
	<link rel="stylesheet" href="mapLandMeteotrek/libs/slick/slick.css">
	<script type="text/javascript" src="mapLandMeteotrek/libs/slick/slick.min.js"></script>
	<!-- chart -->
	<script type="text/javascript" src="mapLandMeteotrek/libs/chart/Chart.min.js"></script>
	<script type="text/javascript" src="mapLandMeteotrek/libs/chart/hammer.min.js"></script>
	<script type="text/javascript" src="mapLandMeteotrek/libs/chart/chartjs-plugin-zoom.min.js"></script>
	
	<!-- Подключение "Meteotrek" -->
	<link rel="stylesheet" href="mapLandMeteotrek/src/style/mapLandMeteotrek.css">
	<script type="text/javascript" src="mapLandMeteotrek/src/js/const.js"></script>
	<script type="text/javascript" src="mapLandMeteotrek/src/js/main.js"></script>
	<script type="text/javascript" src="mapLandMeteotrek/src/js/loadingFromMeteotrek.js"></script>
	<script type="text/javascript" src="mapLandMeteotrek/src/js/initDescription.js"></script>
	<script type="text/javascript" src="mapLandMeteotrek/src/js/initStations.js"></script>
	<script type="text/javascript" src="mapLandMeteotrek/src/js/initTestForm.js"></script>
	<script type="text/javascript" src="mapLandMeteotrek/src/js/error500.js"></script>
	<?php
}
?>