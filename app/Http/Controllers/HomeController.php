<?php

namespace App\Http\Controllers;

use App\Mail\ShipmentCustomerMail;
use App\Mail\ShipmentMail;
use App\Models\FormsWhatsapp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class HomeController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function sendShipmentData(Request $request)
    {
        $validationArray = [
            'name' => 'required',
            'email' => 'required|email',
            "shipping" => 'required'
        ];

        $isWhatsappRequire = env("WHATSAPP_REQUIRE");
        if($isWhatsappRequire){
            $validationArray['phone'] = 'requried';
        }
        
        $validator = Validator::make($request->all(), $validationArray);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $requestData = $request->all();

        // Extract Product Size Color Fields - If Avaiable

        $productSizeColor = [];
        foreach ($requestData as $key => $value) {
            if (strpos($key, 'product_size_color_') === 0) {
                $productSizeColor[$key] = $value;
                unset($requestData[$key]);
            }
        }

        // Pass optional fields to blade view
        $requestData['productSizeColor'] = $productSizeColor;

        $response = $this->verifyForm($requestData);
        if ($response !== true) return $response;

        $subject = 'Received a Request';
        $requestData['your_subject'] = $subject;

        $customer_subject = 'Thank You for Your Request';
        $requestData['customer_subject'] = $customer_subject;

        $data = $this->sendShipmentTemplates($requestData);

        return response()->json($data, 200);
    }

    private function verifyForm($requestData)
    {
        // Whatsapp Verified Checking
        $isWhatsappRequire = env('WHATSAPP_REQUIRE');

        if ($isWhatsappRequire) {

            $whatsappVerifyEnable = env('WHATSAPP_VERIFY');

            if ($whatsappVerifyEnable) {

                $needWhatsappCheck = true;

                $countryCodesWhatsapp = env('WHATSAPP_VERIFICATION_REQUIRED_COUNTRY_CODES');

                if ($countryCodesWhatsapp !== 'all') {
                    $countryCodesWhatsappPattern = '/^(' . $countryCodesWhatsapp . ')/';
                    $whatsappNumber = ltrim($requestData['phone'], '+');

                    if (!preg_match($countryCodesWhatsappPattern, $whatsappNumber)) $needWhatsappCheck = false;
                }

                if ($needWhatsappCheck) {
                    $whatsappForm = FormsWhatsapp::where('phone', $requestData['phone'])->first();

                    if (!$whatsappForm) {
                        return response()->json(['error' => 'Please verify the whatsapp number'], 400);
                    }

                    if (!$whatsappForm->is_whatsapp_verified) {
                        return response()->json(['error' => 'Please verify the whatsapp number'], 400);
                    }

                    $whatsappForm->delete();
                }
            }

        }

        return true;
    }

    /* 
       Sending Templates
    */

    private function sendShipmentTemplates($formData)
    {
        // Company Email 
        $shipment = new ShipmentMail($formData);
        Mail::to(env('MAIL_FROM_ADDRESS_TO'))->send($shipment);

        // Customer Email
        $shipmentCustomer = new ShipmentCustomerMail($formData);
        Mail::to($formData['email'])->send($shipmentCustomer);

        return ['message' => 'Your form has been submitted successfully!'];
    }
}
