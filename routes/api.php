<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\WhatsappVerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/send-otp-whatsapp', [WhatsappVerificationController::class, 'sendCode'])->name('send_otp_whatsapp');
Route::post('/verify-otp-whatsapp', [WhatsappVerificationController::class, 'verifyCode'])->name('verify_otp_whatsapp');

Route::post('/send-shipment-data', [HomeController::class, 'sendShipmentData'])->name('send_shipment_data');