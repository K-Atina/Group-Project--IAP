<?php

class MpesaService {
    private $consumerKey;
    private $consumerSecret;
    private $shortcode;
    private $passkey;
    private $callbackUrl;
    private $environment; // 'sandbox' or 'production'
    
    public function __construct() {
        // M-Pesa Credentials - Update these with your actual credentials
        $this->environment = 'sandbox'; // Change to 'production' for live
        
        if ($this->environment === 'sandbox') {
            $this->consumerKey = 'tgwyAdCynvZhEDDI5edc6PAH4G0Tihu1fCPbCT060tSo07IB';
            $this->consumerSecret = 'YtS185D2pOmlI4ydrZNEadXuGxA208SjUk4L3birSrDjDsTjesuXNsSQopVVIkna';
            $this->shortcode = '174379'; // Sandbox shortcode
            $this->passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Sandbox passkey
        } else {
            $this->consumerKey = 'tgwyAdCynvZhEDDI5edc6PAH4G0Tihu1fCPbCT060tSo07IB';
            $this->consumerSecret = 'YtS185D2pOmlI4ydrZNEadXuGxA208SjUk4L3birSrDjDsTjesuXNsSQopVVIkna';
            $this->shortcode = 'YOUR_PRODUCTION_SHORTCODE';
            $this->passkey = 'YOUR_PRODUCTION_PASSKEY';
        }
        
        // For testing/sandbox, use a valid public URL
        // Safaricom requires https:// URLs for callbacks
        // Using webhook.site for testing - you can create your own at https://webhook.site
        $this->callbackUrl = 'https://webhook.site/51c4e7c0-7f5f-4e2e-9e3c-5c8c0c4e7c0a';
    }
    
    // Get OAuth Access Token
    private function getAccessToken() {
        $url = $this->environment === 'sandbox' 
            ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
            : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
        
        $credentials = base64_encode($this->consumerKey . ':' . $this->consumerSecret);
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Authorization: Basic ' . $credentials]);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $error = curl_error($curl);
        curl_close($curl);
        
        if ($error) {
            error_log("M-Pesa OAuth cURL Error: " . $error);
            return null;
        }
        
        error_log("M-Pesa OAuth Response (HTTP $httpCode): " . $response);
        
        $result = json_decode($response);
        
        if ($httpCode !== 200) {
            error_log("M-Pesa OAuth Failed: " . ($result->errorMessage ?? 'Unknown error'));
            return null;
        }
        
        return $result->access_token ?? null;
    }
    
    // Generate Password for STK Push
    private function generatePassword($timestamp) {
        return base64_encode($this->shortcode . $this->passkey . $timestamp);
    }
    
    // Initiate STK Push (Lipa na M-Pesa Online)
    public function initiateSTKPush($phoneNumber, $amount, $accountReference, $transactionDesc) {
        $accessToken = $this->getAccessToken();
        
        if (!$accessToken) {
            return [
                'success' => false,
                'message' => 'Failed to authenticate with M-Pesa. Please check your credentials or contact support.',
                'error_type' => 'authentication_failed'
            ];
        }
        
        // Format phone number (remove + and spaces, ensure it starts with 254)
        $phoneNumber = preg_replace('/[^0-9]/', '', $phoneNumber);
        if (substr($phoneNumber, 0, 1) === '0') {
            $phoneNumber = '254' . substr($phoneNumber, 1);
        } elseif (substr($phoneNumber, 0, 3) !== '254') {
            $phoneNumber = '254' . $phoneNumber;
        }
        
        $timestamp = date('YmdHis');
        $password = $this->generatePassword($timestamp);
        
        $url = $this->environment === 'sandbox'
            ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
            : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
        
        $data = [
            'BusinessShortCode' => $this->shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => ceil($amount), // M-Pesa requires integer amount
            'PartyA' => $phoneNumber,
            'PartyB' => $this->shortcode,
            'PhoneNumber' => $phoneNumber,
            'CallBackURL' => $this->callbackUrl,
            'AccountReference' => $accountReference,
            'TransactionDesc' => $transactionDesc
        ];
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json'
        ]);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($curl);
        $error = curl_error($curl);
        curl_close($curl);
        
        if ($error) {
            error_log("M-Pesa STK Push Error: " . $error);
            return [
                'success' => false,
                'message' => 'Payment request failed',
                'error' => $error
            ];
        }
        
        $result = json_decode($response, true);
        
        if (isset($result['ResponseCode']) && $result['ResponseCode'] == '0') {
            return [
                'success' => true,
                'message' => 'Payment request sent successfully',
                'checkout_request_id' => $result['CheckoutRequestID'],
                'merchant_request_id' => $result['MerchantRequestID'],
                'response_code' => $result['ResponseCode'],
                'response_description' => $result['ResponseDescription']
            ];
        } else {
            return [
                'success' => false,
                'message' => $result['errorMessage'] ?? 'Payment request failed',
                'response' => $result
            ];
        }
    }
    
    // Query STK Push Transaction Status
    public function querySTKPushStatus($checkoutRequestId) {
        $accessToken = $this->getAccessToken();
        
        if (!$accessToken) {
            return [
                'success' => false,
                'message' => 'Failed to get access token'
            ];
        }
        
        $timestamp = date('YmdHis');
        $password = $this->generatePassword($timestamp);
        
        $url = $this->environment === 'sandbox'
            ? 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
            : 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query';
        
        $data = [
            'BusinessShortCode' => $this->shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'CheckoutRequestID' => $checkoutRequestId
        ];
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json'
        ]);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($curl);
        curl_close($curl);
        
        $result = json_decode($response, true);
        
        return [
            'success' => true,
            'data' => $result
        ];
    }
    
    // Process M-Pesa Callback
    public function processCallback($callbackData) {
        // Log the callback for debugging
        error_log("M-Pesa Callback: " . json_encode($callbackData));
        
        if (!isset($callbackData['Body']['stkCallback'])) {
            return [
                'success' => false,
                'message' => 'Invalid callback data'
            ];
        }
        
        $callback = $callbackData['Body']['stkCallback'];
        $resultCode = $callback['ResultCode'];
        $resultDesc = $callback['ResultDesc'];
        $checkoutRequestId = $callback['CheckoutRequestID'];
        
        if ($resultCode == 0) {
            // Payment successful
            $callbackMetadata = $callback['CallbackMetadata']['Item'] ?? [];
            $amount = 0;
            $mpesaReceiptNumber = '';
            $phoneNumber = '';
            $transactionDate = '';
            
            foreach ($callbackMetadata as $item) {
                switch ($item['Name']) {
                    case 'Amount':
                        $amount = $item['Value'];
                        break;
                    case 'MpesaReceiptNumber':
                        $mpesaReceiptNumber = $item['Value'];
                        break;
                    case 'PhoneNumber':
                        $phoneNumber = $item['Value'];
                        break;
                    case 'TransactionDate':
                        $transactionDate = $item['Value'];
                        break;
                }
            }
            
            return [
                'success' => true,
                'result_code' => $resultCode,
                'result_desc' => $resultDesc,
                'checkout_request_id' => $checkoutRequestId,
                'amount' => $amount,
                'mpesa_receipt_number' => $mpesaReceiptNumber,
                'phone_number' => $phoneNumber,
                'transaction_date' => $transactionDate
            ];
        } else {
            // Payment failed or cancelled
            return [
                'success' => false,
                'result_code' => $resultCode,
                'result_desc' => $resultDesc,
                'checkout_request_id' => $checkoutRequestId
            ];
        }
    }
}

?>
