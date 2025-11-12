<?php
// Test M-Pesa Credentials

$consumerKey = 'tgwyAdCynvZhEDDI5edc6PAH4G0Tihu1fCPbCT060tSo07IB';
$consumerSecret = 'YtS185D2pOmlI4ydrZNEadXuGxA208SjUk4L3birSrDjDsTjesuXNsSQopVVIkna';

$url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
$credentials = base64_encode($consumerKey . ':' . $consumerSecret);

echo "Testing M-Pesa OAuth...\n";
echo "URL: $url\n";
echo "Credentials (base64): " . substr($credentials, 0, 20) . "...\n\n";

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HTTPHEADER, ['Authorization: Basic ' . $credentials]);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$error = curl_error($curl);
curl_close($curl);

echo "HTTP Code: $httpCode\n";

if ($error) {
    echo "cURL Error: $error\n";
} else {
    echo "Response:\n";
    $result = json_decode($response, true);
    print_r($result);
}

echo "\n\n";

if ($httpCode === 401) {
    echo "❌ UNAUTHORIZED ERROR\n\n";
    echo "This means:\n";
    echo "1. The Consumer Key or Consumer Secret is incorrect\n";
    echo "2. The app has not been activated in Safaricom Developer Portal\n";
    echo "3. The credentials have expired or been revoked\n\n";
    echo "To fix this:\n";
    echo "1. Go to https://developer.safaricom.co.ke/\n";
    echo "2. Log in to your account\n";
    echo "3. Go to your apps\n";
    echo "4. Verify the Consumer Key and Consumer Secret\n";
    echo "5. Make sure the app status is 'Active'\n";
    echo "6. If using production, switch to production credentials\n";
} elseif ($httpCode === 200) {
    echo "✅ SUCCESS! Credentials are working.\n";
}
?>
