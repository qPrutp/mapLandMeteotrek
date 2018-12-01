var head = $("head");

// slick
head.append('<link rel="stylesheet" href="mapLandMeteotrek/libs/slick/slick-theme.css">');
head.append('<link rel="stylesheet" href="mapLandMeteotrek/libs/slick/slick.css">');
head.append('<script type="text/javascript" src="mapLandMeteotrek/libs/slick/slick.min.js"></script>');
// chart
head.append('<script type="text/javascript" src="mapLandMeteotrek/libs/chart/Chart.min.js"></script>');
head.append('<script type="text/javascript" src="mapLandMeteotrek/libs/chart/hammer.min.js"></script>');
head.append('<script type="text/javascript" src="mapLandMeteotrek/libs/chart/chartjs-plugin-zoom.min.js"></script>');

// app module
// css
head.append('<link rel="stylesheet" href="mapLandMeteotrek/src/style/mapLandMeteotrek.css">');
// js
head.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/const.js"></script>');
head.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/main.js"></script>');
head.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/initStations.js"></script>');
head.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/initDescription.js"></script>');
head.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/initTestForm.js"></script>');
head.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/loadingFromMeteotrek.js"></script>');
head.append('<script type="text/javascript" src="mapLandMeteotrek/src/js/error500.js"></script>');