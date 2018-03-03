<?php
function _linzi_resource_definition() {
  $definition = array(
    'linzi' => array(
      'operations' => array(
        'create' => array(
          'help' => 'Create a user',
          'callback' => '_linzi_resource_create',
          'file' => array('type' => 'inc', 'module' => 'services', 'name' => 'resources/linzi_resource'),
          'access callback' => 'services_access_menu',
          'args' => array(
            array(
              'name' => 'sign',
              'type' => 'array',
              'description' => 'The sign object',
              'source' => 'data',
              'optional' => FALSE,
            ),
          ),
        ),
        'index' => array(
          'help' => 'List all users',
          'file' => array('type' => 'inc', 'module' => 'services', 'name' => 'resources/linzi_resource'),
          'callback' => '_linzi_resource_index',
          'access callback' => 'services_access_menu',
        ),
      ),
    ),
  );

  return $definition;
}

function rsaEncrypt($data) {
		//读取公钥文件
  try{
		$pubKey = file_get_contents('/alidata/www/drupal7/sites/all/modules/services/resources/rsa_public_key.pem');
    // watchdog('linzi-key', 'results: <pre>@results</pre>', array('@results' => $pubKey), WATCHDOG_DEBUG);
		//转换为openssl格式密钥
		$res = openssl_get_publickey($pubKey);
		watchdog('linzi-data', 'results: <pre>@results</pre>', array('@results' => print_r(strlen($data), TRUE)), WATCHDOG_DEBUG);
		if(openssl_public_encrypt($data, $encode, $res)){
      watchdog('linzi_rsa', 'results: <pre>@results</pre>', array('@results' => print_r($encode, TRUE)), WATCHDOG_DEBUG);
  		return $encode;
    }
    watchdog('linzi-err', 'results: <pre>@results</pre>', array('@results' => print_r(openssl_error_string(), TRUE)), WATCHDOG_DEBUG);
  }catch(Exception $e){
    watchdog('linzi-e', 'results: <pre>@results</pre>', array('@results' => print_r($e, TRUE)), WATCHDOG_DEBUG);
  }
	}
//POST
function _linzi_resource_create($sign){

	// $xml_parser = xml_parser_create();
	// if (xml_parse_into_struct($xml_parser, $sign, $values)) {
    // foreach ($values as $entry) {

    // }
		watchdog('linzi', 'results: <pre>@results</pre>', array('@results' => print_r($sign, TRUE)), WATCHDOG_DEBUG);

		//$newsign = rsaEncrypt('success');
		$return = '<?xml version="1.0" encoding="utf-8"?><xml><Sign>'.$sign['Sign'].'</Sign><SignType>RSA</SignType><Result>success</Result></xml>';
		watchdog('linzi-return', 'results: @results', array('@results' => $return), WATCHDOG_DEBUG);
	header("Content-type: text/xml");
	echo $return;
	//exit;


 //  }
	// xml_parser_free($xml_parser);

	// $grantType='authCode';
	// $authCode='';

	// $appId = '';

	// $method = 'zxipay.openapi.oauth.token';

	// $signtype = 'RSA';
	// $timestamp = '';
	// $version = '1.0';
}
function getSignContent($appId,$authCode,$method,$version,$timestamp,$data){
  $content = 'appId='.$appId.'charset=UTF-8'.'data='.$data.'method='.$method.'timestamp'.$timestamp.'version='.$version;
  watchdog('linzi_content', 'results: <pre>@results</pre>', array('@results' => $content), WATCHDOG_DEBUG);
  return $content;
}
function getToken($appId,$authCode){
  $grantType = 'authCode';
  $url = 'http://58.17.245.132:8000/openapi/gateway.action';
  $method = 'zxipay.openapi.oauth.token';
  $version = '1.0';
  $timestamp = time();//date('Y-m-d H:i:s',time());
  $data='{"grantType":"authCode","authCode":"'.$authCode.'"}';
  $content = getSignContent($appId,$authCode,$method,$version,$timestamp,$data);
  $rsa = rsaEncrypt($content);
  $result = drupal_http_request(
    url($url, array()), array('headers' => array('Content-Type' => 'application/x-www-form-urlencoded'), 'method' => 'POST', 'data' => http_build_query(array(
      'appId'=>$appId,
      'method'=>$method,
      'charset'=>'UTF-8',
      'signType'=>'RSA',
      'timestamp'=>$timestamp,
      'version'=>$version,
      'sign'=>$rsa,
      'data'=>$data
    ), '', '&')));
    watchdog('linzi_token', 'results: <pre>@results</pre>', array('@results' => print_r($result, TRUE)), WATCHDOG_DEBUG);
}

function _linzi_resource_index(){
  watchdog('linzi_index', 'results: <pre>@results</pre>', array('@results' => print_r($_GET, TRUE)), WATCHDOG_DEBUG);
  $appId = $_GET['appId'];
  $authCode = $_GET['authCode'];
  getToken($appId,$authCode);
	header("Location: http://www.hzs168.com/app/index.html");
}