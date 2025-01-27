<?php
echo '<pre>';
var_dump($_POST);

$url = 'https://google.com/recaptcha/api/siteverify';
$data = ['secret' => '', 'response' => $_POST['g-recaptcha-response']];

$options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($data)
    ]
];
$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$result = json_decode($result);
var_dump($result);  // this will show the result of the reCAPTCHA verification

if ($result->success) {
    echo 'Success!';
} else {
    echo 'Failed!';
}
