var headMts = $("head");

// slick
headMts.append('<link rel="stylesheet" href="mapLandMeteotrek/libs/slick/slick-theme.css">');
headMts.append('<link rel="stylesheet" href="mapLandMeteotrek/libs/slick/slick.css">');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/libs/slick/slick.min.js"></script>');
// chart
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/libs/chart/Chart.min.js"></script>');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/libs/chart/hammer.min.js"></script>');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/libs/chart/chartjs-plugin-zoom.min.js"></script>');

// app module
// css
headMts.append('<link rel="stylesheet" href="mapLandMeteotrek/src/style/mapLandMeteotrek.css">');
// js
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/const.js"></script>');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/main.js"></script>');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/initStations.js"></script>');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/initDescription.js"></script>');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/initTestForm.js"></script>');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/loadingFromMeteotrek.js"></script>');
headMts.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/error500.js"></script>');