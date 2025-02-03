<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    $recaptchaSecret = '';
    $errors = [];

    function clean_input($data) {
        return htmlspecialchars(trim($data));
    }

    $name = isset($_POST['name']) ? clean_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? clean_input($_POST['email']) : '';
    $tel = isset($_POST['tel']) ? clean_input($_POST['tel']) : '';
    $message = isset($_POST['message']) ? clean_input($_POST['message']) : '';
    $agreement = isset($_POST['agreement']) ? $_POST['agreement'] : null;
    $recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';

    // Валидация полей
    if (empty($name)) {
        $errors[] = 'Please enter your name.';
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }
    if (empty($tel) || !preg_match('/^\+?[0-9\s\-]{7,15}$/', $tel)) {
        $errors[] = 'Please enter a valid phone number.';
    }
    if (!$agreement) {
        $errors[] = 'You must agree to the privacy policy.';
    }

    // Проверка reCAPTCHA
    if (empty($recaptchaResponse)) {
        $errors[] = 'Please confirm that you are not a robot.';
    } else {
        $recaptchaVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        $recaptchaResponseData = file_get_contents("$recaptchaVerifyUrl?secret=$recaptchaSecret&response=$recaptchaResponse");
        $recaptchaResult = json_decode($recaptchaResponseData, true);

        if (!$recaptchaResult['success']) {
            $errors[] = 'reCAPTCHA verification failed. Please try again.';
        }
    }

    // Если есть ошибки, отправляем их в JSON-ответе
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }

    // Настройка PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'prokuuudin@gmail.com';
        $mail->Password = 'qxwk jtkv mpak zfys'; // Хранить пароль в коде НЕБЕЗОПАСНО! Лучше использовать ENV-переменные
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom($email, $name);
        $mail->addAddress('prokuuudin@gmail.com'); // Email, куда отправлять данные

        $mail->isHTML(false);
        $mail->Subject = 'New message from the website';
        $mail->Body = "Name: $name\nEmail: $email\nPhone: $tel\nMessage:\n$message";

        $mail->send();
        echo json_encode(['success' => true, 'message' => 'The form was successfully submitted!']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'errors' => ['Error sending email: ' . $mail->ErrorInfo]]);
    }
} else {
    echo json_encode(['success' => false, 'errors' => ['Request method is not allowed.']]);
}
?>
