<?php
header('Content-Type: application/json; charset=utf-8');

// НАСТРОЙКИ EMAIL - ЗАМЕНИТЕ НА СВОИ ДАННЫЕ
$emailTo = 'info@china-components.ru';  // Email получателя
$emailFrom = 'noreply@china-components.ru';  // Email отправителя (должен быть на вашем домене)
$emailFromName = 'China Components Website';  // Имя отправителя

// НАСТРОЙКИ SMTP (если требуется)
// Раскомментируйте и настройте, если ваш хостинг требует SMTP
/*
$smtpHost = 'smtp.your-host.com';  // SMTP сервер
$smtpPort = 587;  // Порт (587 для TLS, 465 для SSL)
$smtpUsername = 'noreply@china-components.ru';  // SMTP логин
$smtpPassword = 'your_password';  // SMTP пароль
$smtpSecure = 'tls';  // 'tls' или 'ssl'
*/

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Недопустимый метод запроса']);
    exit;
}

// Получение данных из формы
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';

// Валидация
if (empty($name) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, заполните все обязательные поля']);
    exit;
}

// Обработка файлов
$attachments = [];
if (isset($_FILES['files'])) {
    $files = $_FILES['files'];
    $fileCount = count($files['name']);
    
    for ($i = 0; $i < $fileCount; $i++) {
        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            $attachments[] = [
                'name' => $files['name'][$i],
                'tmp_name' => $files['tmp_name'][$i],
                'type' => $files['type'][$i],
                'size' => $files['size'][$i]
            ];
        }
    }
}

// Формирование письма
$subject = 'Новая заявка с сайта China Components';
$boundary = md5(time());

// Заголовки
$headers = "From: " . $emailFromName . " <" . $emailFrom . ">\r\n";
$headers .= "Reply-To: " . $emailFrom . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

// Тело письма
$message = "--" . $boundary . "\r\n";
$message .= "Content-Type: text/html; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";

$message .= '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #60a9ff 0%, #1764c0 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 8px; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; color: #1764c0; }
        .field-value { margin-top: 5px; }
        .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Новая заявка с сайта</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="field-label">Имя:</div>
                <div class="field-value">' . htmlspecialchars($name) . '</div>
            </div>
            <div class="field">
                <div class="field-label">Телефон:</div>
                <div class="field-value">' . htmlspecialchars($phone) . '</div>
            </div>
            <div class="field">
                <div class="field-label">Дата и время:</div>
                <div class="field-value">' . date('d.m.Y H:i:s') . '</div>
            </div>
';

if (!empty($attachments)) {
    $message .= '
            <div class="field">
                <div class="field-label">Прикреплённые файлы:</div>
                <div class="field-value">' . count($attachments) . ' файл(ов)</div>
            </div>
    ';
}

$message .= '
        </div>
        <div class="footer">
            <p>Это письмо отправлено автоматически с сайта China Components</p>
        </div>
    </div>
</body>
</html>
';

$message .= "\r\n";

// Добавление вложений
foreach ($attachments as $attachment) {
    $fileContent = file_get_contents($attachment['tmp_name']);
    $fileContent = chunk_split(base64_encode($fileContent));
    
    $message .= "--" . $boundary . "\r\n";
    $message .= "Content-Type: " . $attachment['type'] . "; name=\"" . $attachment['name'] . "\"\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n";
    $message .= "Content-Disposition: attachment; filename=\"" . $attachment['name'] . "\"\r\n\r\n";
    $message .= $fileContent . "\r\n";
}

$message .= "--" . $boundary . "--";

// Отправка письма
$mailSent = false;

// Если используется SMTP (раскомментируйте и настройте выше переменные SMTP)
/*
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Настройки SMTP
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port = $smtpPort;
    $mail->CharSet = 'UTF-8';

    // Отправитель и получатель
    $mail->setFrom($emailFrom, $emailFromName);
    $mail->addAddress($emailTo);

    // Вложения
    foreach ($attachments as $attachment) {
        $mail->addAttachment($attachment['tmp_name'], $attachment['name']);
    }

    // Содержимое
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $message;

    $mail->send();
    $mailSent = true;
} catch (Exception $e) {
    error_log("Ошибка отправки письма: " . $mail->ErrorInfo);
}
*/

// Использование стандартной функции mail() PHP
if (!$mailSent) {
    $mailSent = mail($emailTo, $subject, $message, $headers);
}

// Ответ клиенту
if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Заявка успешно отправлена'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при отправке заявки. Попробуйте позже.'
    ]);
}

// Очистка временных файлов
foreach ($attachments as $attachment) {
    if (file_exists($attachment['tmp_name'])) {
        unlink($attachment['tmp_name']);
    }
}
?>
