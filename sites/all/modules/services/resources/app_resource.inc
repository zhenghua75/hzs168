<?php
function _app_resource_definition() {
  $definition = array(
    'app' => array(
      'operations' => array(
        'index' => array(
          'help' => 'display app',
          'file' => array('type' => 'inc', 'module' => 'services', 'name' => 'resources/app_resource'),
          'callback' => '_app_resource_index',
          'access callback' => 'services_access_menu',
        ),
      ),
    ),
  );
  return $definition;
}

function _app_resource_index(){
  header("Content-type:text/html; charset=utf-8");
  $user_agent = $_SERVER['HTTP_USER_AGENT'];
  watchdog('app-download', 'results: <pre>@results</pre>', array('@results' => print_r($user_agent, TRUE)), WATCHDOG_DEBUG);

     //var_dump($user_agent);
  if(stristr($_SERVER['HTTP_USER_AGENT'],'Android')) {
     //echo '你的手机是：Android系统';
  	if(stristr($_SERVER['HTTP_USER_AGENT'],'MicroMessenger')){
  		echo '<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title></title>
        <style>
        	body {
			    display: block;
			    margin: 0px;
			}
        </style>
    </head>
    <body><img width="100%" height="100%" src="http://www.hzs168.com/sites/default/files/MicroMessenger-android.jpg"/></body>
</html>';
  	}else{
  		header('Location: http://ylst.kmdx.cn:9000/download/zlsxjj1440489378/zlsxjj1440489378.apk');
  	}
  }else if(stristr($_SERVER['HTTP_USER_AGENT'],'iPhone')){
     //echo '你的手机是：ISO系统';
  	if(stristr($_SERVER['HTTP_USER_AGENT'],'MicroMessenger')){
  		//header('Location: http://www.hzs168.com/a.html');
  		echo '<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title></title>
        <style>
        	body {
			    display: block;
			    margin: 0px;
			}
        </style>
    </head>
    <body><img width="100%" height="100%" src="http://www.hzs168.com/sites/default/files/MicroMessenger.jpg"/></body>
</html>';
  	}else{
	    header('Location: https://itunes.apple.com/us/app/he-zuo-she/id1043485254?l=zh&ls=1&mt=8#');
	}
  }else{
     //echo '你使用的是其他系统';
    header('Location: http://www.hzs168.com/app/index.html');
  }
}