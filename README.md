// додати в index.php
// з 12 стрічки, ці стрічки повинні бути в межах php тегів
 
	define('MTSROOT', realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR);
	require_once MTSROOT."meteotrek/src/app.php";

// з наступної стрічки після <link href="gwsse.css" rel="stylesheet" /> додати:
```html
	<!-- Подключение "Meteotrek" -->
	<?php mtsHeaders(); ?>
```

// php підключення додатку потрібно для відслідковування авторизації
