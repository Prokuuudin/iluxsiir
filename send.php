<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Убедитесь, что PHPMailer установлен через Composer

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    // Настройки
    $recaptchaSecret = '6LeJwZUqAAAAAB2OZ8xlgxRhVhWqxgN3521DnMX2';
    $errors = [];

    // Функция очистки ввода
    function clean_input($data) {
        return htmlspecialchars(trim($data));
    }

    // Получаем данные из формы
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
        $errors[] = 'Please complete the reCAPTCHA.';
    } else {
        $recaptchaVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        $recaptchaResponseData = file_get_contents("$recaptchaVerifyUrl?secret=$recaptchaSecret&response=$recaptchaResponse");
        $recaptchaResult = json_decode($recaptchaResponseData, true);

        if (!$recaptchaResult['success']) {
            $errors[] = 'reCAPTCHA verification failed. Please try again.';
        }
    }

    // Если есть ошибки, возвращаем их
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }

    // Настройка PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // SMTP-сервер
        $mail->SMTPAuth = true;
        $mail->Username = 'prokuuudin@gmail.com'; // Ваш email
        $mail->Password = 'qxwk jtkv mpak zfys'; // Ваш пароль (лучше использовать App Password)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // От кого и кому
        $mail->setFrom($email, $name);
        $mail->addAddress('prokuuudin@gmail.com'); // Получатель

        // Контент письма
        $mail->isHTML(false);
        $mail->Subject = 'New submission from the website';
        $mail->Body = "Name: $name\nEmail: $email\nPhone: $tel\nMessage:\n$message";

        // Отправка письма
        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Form successfully submitted!']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'errors' => ['Mail error: ' . $mail->ErrorInfo]]);
    }
} else {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'errors' => ['Method not allowed.']]);
}
?>
