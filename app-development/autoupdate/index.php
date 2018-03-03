<?php

// Configuration
$types = [
    'css/style.css' => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'css'.DIRECTORY_SEPARATOR.'style.{version}.css',
    'css/theme-c.css' => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'css'.DIRECTORY_SEPARATOR.'theme-c.{version}.css',
    'css/theme-d.css' => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'css'.DIRECTORY_SEPARATOR.'theme-d.{version}.css',
    'css/theme-e.css' => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'css'.DIRECTORY_SEPARATOR.'theme-e.{version}.css',
    'css/theme-f.css' => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'css'.DIRECTORY_SEPARATOR.'theme-f.{version}.css',
    'js/app.js'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR.'app.{version}.js',
    'js/base.js'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR.'base.{version}.js',
    'js/china_province.js'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR.'china_province.{version}.js',
    'js/index.js'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR.'index.{version}.js',
    'js/pull.js'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR.'pull.{version}.js',
    'js/services.js'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'js'.DIRECTORY_SEPARATOR.'services.{version}.js',
    'img/top.png'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'top.{version}.png',
    'img/xx.png'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'xx.{version}.png',
    'img/xh.png'   => __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'xh.{version}.png',
                'img/1-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-1.{version}.png',
                'img/1-1-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-1-1.{version}.png',
                'img/1-1-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-1-2.{version}.png',
                'img/1-1-3.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-1-3.{version}.png',
                'img/1-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-2.{version}.png',
                'img/1-2-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-2-1.{version}.png',
                'img/1-2-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-2-2.{version}.png',
                'img/1-2-3.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-2-3.{version}.png',
                'img/1-3.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-3.{version}.png',
                'img/1-3-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-3-1.{version}.png',
                'img/1-3-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-3-2.{version}.png',
                'img/1-3-3.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-3-3.{version}.png',
                'img/1-3-4.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-3-4.{version}.png',
                'img/1-4.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'1-4.{version}.png',
                'img/2-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-1.{version}.png',
                'img/2-1-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-1-1.{version}.png',
                'img/2-1-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-1-2.{version}.png',
                'img/2-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-2.{version}.png',
                'img/2-2-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-2-1.{version}.png',
                'img/2-2-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-2-2.{version}.png',
                'img/2-3.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-3.{version}.png',
                'img/2-3-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-3-1.{version}.png',
                'img/2-3-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-3-2.{version}.png',
                'img/2-4-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-4-1.{version}.png',
                'img/2-4-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-4-2.{version}.png',
                'img/2-5-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-5-1.{version}.png',
                'img/2-5-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'2-5-2.{version}.png',
                'img/3-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'3-1.{version}.png',
                'img/3-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'3-2.{version}.png',
                'img/3-3.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'3-3.{version}.png',
                'img/4.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'4.{version}.png',
                'img/4-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'4-1.{version}.png',
                'img/4-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'4-2.{version}.png',
                'img/4-3.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'4-3.{version}.png',
                'img/4-4.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'4-4.{version}.png',
                'img/5.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'5.{version}.png',
                'img/6.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'6.{version}.png',
                'img/7.jpg'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'7.{version}.jpg',
                'img/8.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'8.{version}.png',
                'img/9.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'9.{version}.png',
                'img/10-1-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-1-1.{version}.png',
                'img/10-1-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-1-2.{version}.png',
                'img/10-2-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-2-1.{version}.png',
                'img/10-2-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-2-2.{version}.png',
                'img/10-3-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-3-1.{version}.png',
                'img/10-3-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-3-2.{version}.png',
                'img/10-4-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-4-1.{version}.png',
                'img/10-4-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-4-2.{version}.png',
                'img/10-5-1.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-5-1.{version}.png',
                'img/10-5-2.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'10-5-2.{version}.png',
                'img/c-msg-bg.gif'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'c-msg-bg.{version}.gif',
                'img/home.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'home.{version}.png',
                'img/return.png'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'return.{version}.png',
'app/zlsxjj1440489378.apk'=> __DIR__  .DIRECTORY_SEPARATOR.'release'.DIRECTORY_SEPARATOR.'app'.DIRECTORY_SEPARATOR.'zlsxjj1440489378.{version}.apk',

];

function path_to_url($path)
{
    $host = 'http://www.hzs168.com/app/autoupdate';
    $path1 = str_replace(__DIR__, '', $path);
    $path2 = str_replace(DIRECTORY_SEPARATOR, '/', $path1);
    return $host . $path2;
}

// Functions
function response_plain($status, $message){
    http_response_code($status);
    header('Content-Type', 'text/plain');
    echo $message;
    exit($status >= 200 && $status < 300 ? 0 : 1);
}

function response_json($status, $object){
    http_response_code($status);
    header('Content-Type', 'text/plain');
    echo json_encode($object);
    exit($status >= 200 && $status < 300 ? 0 : 1);
}

// Parse
$currentVersions = $_GET['v'];

if ( ! is_array($currentVersions)){
    response_plain(400, 'Expected versions array in GET parameter "v".');
}

// Response
$response = [];

foreach (array_keys($currentVersions) as $type)
{
    $path = $types[$type];

    if ( ! $path) continue; // Unknown file

    $files = glob(str_replace('{version}', '*', $path), GLOB_NOSORT);
    $regex = str_replace('\{version\}', '([0-9]+(\.[0-9]+){2}(\-[a-zA-Z0-9\-]+)?(\+[a-zA-Z0-9\-]+)?)', preg_quote($path));
    $latest = null;

    foreach ($files as & $file)
    {
        preg_match("#^$regex$#", $file, $matches);

        if ( ! $latest || version_compare($matches[1], $latest, '>'))
        {
            $latest = $matches[1];
            $latestUrl = path_to_url($file);
        }
    }

    $current = & $currentVersions[$type];

    if ($latest && (! $current || version_compare($latest, $current, '>')))
    {
        $response[$type] = [
            'url'     => $latestUrl,
            'version' => $latest,
        ];
    }
}

if (headers_sent())
{
    response_plain(500, 'An error occurred.');
}

response_json(200, $response);

?>