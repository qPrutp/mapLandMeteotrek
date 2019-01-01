// додати в index.php
// з 12 стрічки, ці стрічки повинні бути в межах php тегів

	error_reporting(E_ALL & ~E_DEPRECATED & ~E_WARNING & ~E_NOTICE); 
	 
	define('MTSROOT', realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR);
	require_once MTSROOT."meteotrek/src/app.php";


// з наступної стрічки після
```html
<link href="gwsse.css" rel="stylesheet" />
<!-- Подключение "Meteotrek" -->
	<?php mtsHeaders(); ?>
```

// php підключення додатку потрібно для відслідковування авторизації
