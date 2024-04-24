<?php

namespace App\Http\Controllers;

use App\Models\FormsWhatsapp;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Twilio\Rest\Client;

class WhatsappVerificationController extends Controller
{
    public function sendCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $phone = $request->input('phone');

        $whatsappVerifyEnable = env("WHATSAPP_VERIFY");
        if ($whatsappVerifyEnable == false || $this->needPhoneCheck($phone) == false){
            return response()->json(['error' => 'Action Not Allowed'], 400);
        }

        $data = $this->storeData($phone);

        if (isset($data['error'])) {
            return response()->json(['error' => $data['error']], 400);
        }

        $this->sendCodeTemplate($phone);

        return response()->json(['phone' => $phone], 200);
    }

    public function verifyCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required',
            'whatsapp_verification_code' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $phone = $request->input('phone');
        $verification_code = $request->input('whatsapp_verification_code');

        $whatsappVerifyEnable = env("WHATSAPP_VERIFY");
        if ($whatsappVerifyEnable == false || $this->needPhoneCheck($phone) == false){
            return response()->json(['error' => 'Action Not Allowed'], 400);
        }

        $isValid = $this->verifyOTP($phone, $verification_code);
        if (!$isValid) {
            return response()->json(['error' => 'Invalid verification code'], 400);
        }

        $form = FormsWhatsapp::where('phone', $phone)->first();

        $timeAgo = now()->subSeconds(env('WHATSAPP_VERIFICATION_EXPIRATION_SECONDS'));
        if ($form->updated_at < $timeAgo) {
            return response()->json(['error' => 'Verification code has expired'], 400);
        }

        $form->is_whatsapp_verified = true;
        $form->limit = 0;
        $form->save();

        return response()->json(['message' => 'The code has been verified'], 200);
    }

    private function storeData(string $phone): string|array
    {
        $existingForm = FormsWhatsapp::where('phone', $phone)->first();

        if ($existingForm) {

            if ($existingForm->limit >= env('WHATSAPP_VERIFICATION_LIMIT')) {
                $waiting_time = env('WHATSAPP_FAILED_VERIFICATION_WAIT_MINUTES');
                $timeAgo = now()->subMinutes($waiting_time);

                if ($existingForm->updated_at > $timeAgo) {
                    $come_back_time = $existingForm->updated_at->diffInMinutes($timeAgo);
                    if ($come_back_time <= 0) {
                        $come_back_time = $existingForm->updated_at->diffInSeconds($timeAgo);
                        return ['error' => "Sorry, you've exceeded the maximum number of verification attempts. Please wait for {$come_back_time} seconds before trying again."];
                    } else {
                        return ['error' => "Sorry, you've exceeded the maximum number of verification attempts. Please wait for {$come_back_time} minutes before trying again."];
                    }
                } else {
                    $existingForm->limit = 1;
                    $existingForm->is_whatsapp_verified = false;
                    $existingForm->save();
                }
            } else {

                if ($existingForm->is_whatsapp_verified == true) {
                    $existingForm->limit = 1;
                } else {
                    $existingForm->limit = ++$existingForm->limit;
                }

                $existingForm->is_whatsapp_verified = false;
                $existingForm->save();
            }
        } else {
            $form = new FormsWhatsapp();
            $form->phone = $phone;
            $form->limit = 1;
            $form->save();
        }

        return $phone;
    }

    private function needPhoneCheck(string $phone): bool
    {
        $needPhoneCheck = true;

        $countryCodes = env('WHATSAPP_VERIFICATION_REQUIRED_COUNTRY_CODES');

        if ($countryCodes !== 'all') {
            $countryCodesPattern = '/^(' . $countryCodes . ')/';
            $phoneNumber = ltrim($phone, '+');

            if (!preg_match($countryCodesPattern, $phoneNumber)) $needPhoneCheck = false;
        }

        return $needPhoneCheck;
    }

    private function sendCodeTemplate(string $phone): void
    {
        $token = env("TWILIO_AUTH_TOKEN");
        $twilio_sid = env("TWILIO_SID");
        $twilio_verify_sid = env("TWILIO_VERIFY_SID");
        $twilio = new Client($twilio_sid, $token);
        $twilio->verify->v2->services($twilio_verify_sid)
            ->verifications
            ->create($phone, "whatsapp");
    }

    private function verifyOTP(string $phone, string $verificationCode): bool
    {
        if(strlen($verificationCode) < 6) return false;

        $token = getenv("TWILIO_AUTH_TOKEN");
        $twilio_sid = getenv("TWILIO_SID");
        $twilio_verify_sid = getenv("TWILIO_VERIFY_SID");
        $twilio = new Client($twilio_sid, $token);
        $verification = $twilio->verify->v2->services($twilio_verify_sid)
            ->verificationChecks
            ->create(array('code' => $verificationCode, 'to' => $phone));
        if ($verification->valid) return true;
        return false;
    }
}
