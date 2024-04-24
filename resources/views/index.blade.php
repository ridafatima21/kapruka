<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manual PC</title>

    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/css/intlTelInput.css">
    <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    <script src="{{ asset('js/app.js') }}" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/additional-methods.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
    <script src="https://cdn.jsdelivr.net/gh/manuelmhtr/countries-and-timezones@latest/dist/index.min.js"
        type="text/javascript" defer></script>
    <script src="{{ asset('js/custom.js') }}" defer></script>

</head>

<body class="bg-dark text-light" data-domains="{{ env('VALID_DOMAINS') }}"
    data-whatsapp-verification-required-country-codes="{{ env('WHATSAPP_VERIFICATION_REQUIRED_COUNTRY_CODES') }}"
    data-whatsapp-verify-send-route="{{ route('send_otp_whatsapp') }}"
    data-whatsapp-verify-status="{{ env('WHATSAPP_VERIFY') }}" data-whatsapp-require="{{ env('WHATSAPP_REQUIRE') }}"
    data-whatapp-verification-expiration-seconds="{{ env('WHATSAPP_VERIFICATION_EXPIRATION_SECONDS') }}"
    data-shipment-form-route="{{ route('send_shipment_data') }}">

    <div id="loader-container" class="loader-container">
        <div class="loader"></div>
    </div>

    <header class="container-fluid">
        <div class="row">
            <div class="col-12">
                <img src="https://picsum.photos/100/100" alt="logo-here" class="mx-auto d-block my-3">
            </div>
        </div>
    </header>

    <section class="container links-section">
        <div class="row">
            <div class="col-12">
                <div class="card bg-dark text-light border-light">
                    <div class="card-header my-3 border-light">
                        <h4 class="text-light text-center">Get any item from global web sites into Sri Lanka</h4>
                    </div>
                    <div class="card-body">
                        <form id="initialForm">
                            <div class="row">
                                <div class="col-12 col-lg-10">
                                    <div class="form-group my-2" id="product-links">
                                        <div class="form-group my-3">
                                            <input type="text" required name="product_url_1" id="product_url_1"
                                                class="form-control" placeholder="Enter Your Product Full URL">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-2 align-self-center text-center">
                                    <input type="submit" class="btn btn-primary my-2" value="Check Price" disabled>
                                </div>
                            </div>
                            <div class="row text-center mt-3 mb-2">
                                <a href="javascript:void(0)" id="add-more-links"
                                    class="text-decoration-none add-remove-link">
                                    + Add More Links
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {{-- Modal --}}

    <div class="modal fade" id="whatsapp-verification-modal" data-bs-backdrop="static" data-bs-keyboard="false"
        tabindex="-1" aria-labelledby="whatsapp-verification-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-light border-light">
                <div class="modal-header py-3">
                    <h1 class="modal-title" id="whatsapp-verification-modalLabel">Enter Verification Code</h1>
                    <button type="button" class="btn-close whatsapp-verification-btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body pt-1 pb-1">
                    <div class="row">
                        <div class="col-12" id="whatsapp-form-column">
                            <form method="post" action="{{ route('verify_otp_whatsapp') }}"
                                id="whatsapp-verification-modal-form" data-status="verify"
                                data-send="{{ route('send_otp_whatsapp') }}"
                                data-verify="{{ route('verify_otp_whatsapp') }}" data-phone="">
                                @csrf
                                <div class="row mx-0 gy-3">
                                    <div class="col-12">
                                        <div class="row mx-0">Please check your phone for an OTP code. Enter the code
                                            below
                                            to confirm your submission</div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="form-group">
                                            <label for="whatsapp_verification_code"
                                                class="form-label text-white mb-0">Enter
                                                Code
                                                <span class="text-danger whatsapp-verification-count-down"></span>
                                            </label>
                                            <input type="text" name="whatsapp_verification_code"
                                                id="whatsapp_verification_code"
                                                class="whatsapp_verification_code form-control custom-control"
                                                placeholder="Enter the Code" required />
                                            <div class="col-12 error whatsapp-verification-errors"
                                                id="whatsapp-verification-errors"></div>
                                        </div>
                                    </div>
                                    <div class="col-12 d-flex align-items-center justify-content-center mt-4 mb-2">
                                        <input type="submit" value="SEND" name="whatsapp_verification_request"
                                            class="btn btn-light mx-auto px-3 rounded-1 whatsapp_verification_request">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>

</html>
