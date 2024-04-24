const whatsappVerifySendRoute = document.body.dataset.whatsappVerifySendRoute;
const shipmentFormRoute = document.body.dataset.shipmentFormRoute;
const whatsappVerificationRequiredCountryCodes = document.body.dataset.whatsappVerificationRequiredCountryCodes;
const validDomains = document.body.dataset.domains.split('.');
const whatappVerificationExpirationSeconds = document.body.dataset.whatappVerificationExpirationSeconds;
let whatsappVerifyStatus = document.body.dataset.whatsappVerifyStatus == true;
var isWhatsappRequire = document.body.dataset.whatsappRequire == true;

var iti;
var OTPWhatsappCountdownInterval;
var verifiedWhatsappNumber;

let initialForm = $("#initialForm");
initialForm.validate();



/*
    Helper Functions
*/

function showLoader() {
    document.getElementById('loader-container').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader-container').style.display = 'none';
}

function successModal(message) {
    Swal.fire({
        title: 'Submitted',
        text: message,
        icon: 'success',
        allowOutsideClick: false
    });
}

function FailModal(message, isHtml = false) {
    let config = {
        title: 'Error',
        icon: 'error',
        allowOutsideClick: false
    };

    if (isHtml) {
        config.html = message;
    } else {
        config.title = message;
    }

    Swal.fire(config);
}

function isValidURL(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        const parts = hostname.split('.');
        const domain = parts[parts.length - 2];
        return validDomains.includes(domain);
    } catch (error) {
        return false;
    }
}

function getCountryCode() {
    let timeZone = Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone;
    if (timeZone) {
        let country = ct.getCountryForTimezone(timeZone);
        if (country) {
            return country.id;
        }
        return 'LK';
    }
}

function initializeIntlTelWhatsappInput() {
    var input = document.querySelector("#phone");
    iti = window.intlTelInput(input, {
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js"
    });
}

function isWhatsappVerified() {
    const countryDialCode = iti.getSelectedCountryData().dialCode;

    if (whatsappVerificationRequiredCountryCodes === "all" || new RegExp(whatsappVerificationRequiredCountryCodes).test(
        countryDialCode)) {
        const whatsappVerifyStatus = $("#whatsapp-verify-btn").data("whatsapp-verify-status");
        return whatsappVerifyStatus != true;
    }
    return true;
}






/*
    Validator Functions
*/

$.validator.addMethod("validURL", function (value, element) {
    let isValid = isValidURL(value);
    return this.optional(element) || isValid;
}, "Please enter a valid URL.");

function AddValidationRules() {
    $(this).rules("add", {
        required: true,
        validURL: true
    });
}

function addTelWhatsappValidationMethod(whatsappVerifyEnable) {
    const countryCode = getCountryCode();
    iti.setCountry(countryCode);

    $.validator.addMethod("intlTelWhatsappInput", function (value, element) {
        if (this.optional(element) || iti.isValidNumber()) {
            const number = iti.getNumber();
            $(element).val(number);
        }

        if (whatsappVerifyEnable == true) {
            showWhatsappVerifyBtn();
        }
        return this.optional(element) || iti.isValidNumber();
    }, function () {
        const errorCode = iti.getValidationError();
        if (errorCode !== -99) {
            return ["Invalid number", "Invalid country code", "Too short", "Too long",
                "Invalid number"
            ][errorCode];
        } else {
            return "Invalid number";
        }
    });
}





/* 
    Html Functions 
*/

function addProductSizeColorInput() {
    var len = $(this).index() + 1;
    var targetElement = $(this).parent().parent(".product-size");
    var inputExists = targetElement.find('input[name^="product_size_color_"]').length > 0;

    if (inputExists) {
        targetElement.find('input[name^="product_size_color_"]').closest('.product-size-color-parent').remove();
    } else {
        targetElement.append(`
                <div class="col-auto mt-2 product-size-color-parent">
                    <div class="form-group">
                        <input type="text" class="form-control" name="product_size_color_${len}" id="product_size_color_${len}">
                    </div>
                </div>
            `);
    }
}

function addMoreLinks() {

    if ($("#product-links .form-group:eq(0) > .product-size").length == 0) {
        $("#product-links .form-group:eq(0)").append(`<div class="row product-size my-3">
                <div class="col-auto align-self-center">
                    <a href="javascript:void(0)"  class="product-size-color text-decoration-none text-secondary" ><small>+ Add Product Size/Color</small></a>
                </div>
            </div>`);
    }

    var count = $("#product-links .form-group").length + 1;

    var html = `
            <div class="form-group my-3">
                <input type="text" required name="product_url_${count}" id="product_url_${count}" class="form-control"
                    placeholder="Enter Your Product Full URL"
                >
                <div class="row product-size my-3">
                    <div class="col-auto align-self-center">
                        <a href="javascript:void(0)"  class="product-size-color text-decoration-none text-secondary" ><small>+ Add Product Size/Color</small></a>
                    </div>
                </div>
            </div>
        `;

    $("#product-links").append(html);

}

function createShipmentForm() {
    var form = `
                <form action="${shipmentFormRoute}" id="shipmentForm">
                    <div class="row">
                        <div class="col-12 my-2">
                            <div class="form-group">
                                <input type="text" id="name" placeholder="Your name here"
                                    name="name" class="form-control mb-2" required>
                            </div>
                        </div>
                        <div class="col-12 my-2">
                            <div class="form-group">
                                <input type="email" name="email" placeholder="Your email here"
                                    id="email" class="form-control mb-2" required>
                            </div>
                        </div>
                        <div class="col-12 my-2">
                            <div class="form-group position-relative">
                                <input type="tel" name="phone" placeholder="Your whatsapp number here"
                                    id="phone" class="form-control mb-2">
                                <button 
                                    type="button"
                                    class="btn btn-dark px-2 py-1 rounded-1 verify-btn whatsapp-verify-btn"
                                    id="whatsapp-verify-btn"
                                    data-action="${whatsappVerifySendRoute}"
                                    data-whatsapp-verify-status="${whatsappVerifyStatus}"
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                        <div class="col-12 my-2">
                            <div class="row product-size my-3">
                                <div class="col-auto align-self-center">
                                    <a href="javascript:void(0)"
                                        class="product-size-color text-decoration-none text-secondary">
                                            <small>+ Add Product Size/Color</small>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="shipping" id="air-shipping"
                                    value="air-shipping" required>
                                <label class="form-check-label" for="air-shipping">
                                    Air Shipping
                                </label>
                                <small class="text-secondary d-block">Takes 8 to 11 business days. Good for small items.
                                        i.e. laptops, cameras, few books, etc.</small>
                            </div>
                        </div>
                        <div class="col-12 my-2">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="shipping" id="sea-shipping"
                                    value="sea-shipping" required>
                                <label class="form-check-label" for="sea-shipping">
                                    Sea Shipping
                                </label>
                                <small class="text-secondary d-block">Takes 4 to 6 weeks. Good for very heavy items.i.e.
                                        TVs, large electronics, dozens of books, etc.</small>
                            </div>
                        </div>
                        <div class="col-12 mt-3">
                            <div class="form-group text-center">
                                <input type="submit" value="Submit Request" class="btn btn-sm btn-primary p-2">
                            </div>
                        </div>
                        <div class="col-12 my-2 error back-errors" id="inquiries-errors"></div>
                    </div>
                </form>
        `;

    if ($("#shipmentForm").length == 0) {
        var html = `
                <section class="container my-5">
                    <div class="row justify-content-center">
                        <div class="col-lg-6 col-12">
                            <div class="card bg-dark text-light border-light shipment-form-card">
                                <div class="card-body">
                                    <h4 class="text-light text-center mt-2 mb-3">Request Form</h4>
                                    ${form}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `;
        $(html).insertAfter(".links-section");
    } else {
        $("#shipmentForm").replaceWith(form);
    }

}

function showWhatsappVerifyBtn() {
    const countryDialCode = iti.getSelectedCountryData().dialCode;

    let form = $(".contact-form-type");
    let yourPhone = $(form).find("#phone");
    let whatsappVerifyBtn = $(form).find(".whatsapp-verify-btn");

    if (whatsappVerificationRequiredCountryCodes === "all" || new RegExp(whatsappVerificationRequiredCountryCodes).test(
        countryDialCode)) {
        $(yourPhone).removeClass("full");
        $(whatsappVerifyBtn).removeClass("d-none");

        if (yourPhone.val() !== verifiedWhatsappNumber) {
            $(whatsappVerifyBtn).data("whatsapp-verify-status", true);
            switchToVerifyOTPWhatsappBtn(whatsappVerifyBtn);
        }
    } else {
        $(yourPhone).addClass("full");
        $(whatsappVerifyBtn).addClass("d-none");
        $(whatsappVerifyBtn).data("whatsapp-verify-status", false);
    }
}






/*
   Event Handling - Requests
*/


function onWhatsappVerifyButton() {
    let form = $(this);
    let action = $(this).data("action");
    let phone = $("#phone");

    if (phone.valid()) {
        let formData = new FormData();
        formData.append("phone", phone.val());

        showLoader();
        $.ajax({
            url: action,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                form.find(".back-errors").html("");
                openOTPWhatsappVerificationModal(response.phone);
            },
            error: function (response) {
                var errorHtml = '<ul class="ps-0">';
                if (response.responseJSON?.error) {
                    errorHtml += '<li>' + response.responseJSON.error + '</li>';
                } else {
                    var errors = response.responseJSON.errors;
                    for (var key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorHtml += '<li>' + errors[key][0] + '</li>';
                        }
                    }
                }
                errorHtml += '</ul>';
                form.find(".back-errors").html(errorHtml);
            },
            complete: function () {
                hideLoader();
            }
        });
    }
}

function onWhatsappVerificationModalFormSubmit(e) {
    e.preventDefault();

    if ($(this).valid()) {
        let form = document.getElementById("whatsapp-verification-modal-form");
        let action = form.getAttribute("action");
        let jForm = $("#whatsapp-verification-modal-form");

        let status = jForm.data("status");
        let phone = jForm.data("phone");

        let formData = new FormData(form);
        formData.append("phone", phone);


        // Send Whatsapp Verification Code

        showLoader();
        $.ajax({
            url: action,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (status == 'verify') {
                    closeOTPWhatsappVerificationModal();
                    let verifyBtn = $("#whatsapp-verify-btn");
                    switchToVerifiedOTPWhatsappBtn(verifyBtn);
                    verifiedWhatsappNumber = formData.get("phone");
                } else {
                    $('#whatsapp-verification-errors').empty();
                    OTPWhatsappswitchToVerifyCode();
                    OTPWhatsappstartCountdown();
                }
            },
            error: function (response) {
                var errorHtml = '<ul class="ps-0">';
                if (response.responseJSON?.error) {
                    errorHtml += '<li>' + response.responseJSON.error + '</li>';
                } else {
                    var errors = response.responseJSON.errors;
                    for (var key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorHtml += '<li>' + errors[key][0] + '</li>';
                        }
                    }
                }
                errorHtml += '</ul>';
                $('#whatsapp-verification-errors').html(errorHtml);
            },
            complete: function () {
                hideLoader();
            }
        });
    }
}

function onShipmentFormSubmit(e) {
    e.preventDefault();

    if ($(this).valid()) {
        if (isWhatsappRequire && !isWhatsappVerified()) {
            FailModal('Please Verify the Whatsapp Number');
        }

        if (!isWhatsappRequire || (isWhatsappRequire && isWhatsappVerified())) {
            var form = document.getElementById("shipmentForm");
            const action = form.action;
            const formData = new FormData(form);

            // Send Request

            showLoader();
            $.ajax({
                url: action,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    successModal(response.message);
                    createShipmentForm();
                    $("#shipmentForm").remove();
                    $(".shipment-form-card").addClass("d-none");
                },
                error: function (response) {
                    let isErrorIdentify = false;

                    let errorHtml = '<ul class="ps-0">';
                    if (response.responseJSON?.error) {
                        isErrorIdentify = true;
                        errorHtml += '<li>' + response.responseJSON.error + '</li>';
                    } else {
                        var errors = response.responseJSON.errors;
                        for (var key in errors) {
                            isErrorIdentify = true;
                            if (errors.hasOwnProperty(key)) {
                                errorHtml += '<li>' + errors[key][0] + '</li>';
                            }
                        }
                    }
                    errorHtml += '</ul>';

                    if(isErrorIdentify){
                        FailModal(errorHtml, true);
                    }else{
                        FailModal("Something Went Wrong. Please Try Again Later !");
                    }
                },
                complete: function () {
                    hideLoader();
                }
            });

        }
    }
}






/*
    Whatsapp Verify
*/


function switchToVerifyOTPWhatsappBtn(element) {
    $(element).data("whatsapp-verify-status", true);
    $(element).text("Verify");
    $(element).removeAttr("disabled");
}

function switchToVerifiedOTPWhatsappBtn(element) {
    $(element).data("whatsapp-verify-status", false);
    $(element).text("Verified");
    $(element).attr("disabled", "disabled");
    $("#phone").attr("readonly", "readonly");
}

$(".whatsapp-verification-btn-close").on("click", function () {
    closeOTPWhatsappVerificationModal();
});

function openOTPWhatsappVerificationModal(phone) {
    $("#whatsapp-verification-modal").modal("show");
    OTPWhatsappstartCountdown();
    $("#whatsapp-verification-modal-form").data('phone', phone);
}

function closeOTPWhatsappVerificationModal() {
    OTPWhatsappStopCountdown();
    $("#whatsapp-verification-modal").modal("hide");
    resetOTPWhatsappVerificationModal();
}

function resetOTPWhatsappVerificationModal() {
    $("#whatsapp-verification-modal-form").data('phone', '');
    OTPWhatsappswitchToVerifyCode();
}

function OTPWhatsappswitchToSendCode() {
    $(".whatsapp-verification-count-down").text("Code Expired");
    $(".whatsapp_verification_request").val("Resend");
    $("#whatsapp_verification_code").val("");
    $(".whatsapp-verification-errors").empty();
    const verificationForm = $("#whatsapp-verification-modal-form");
    verificationForm.find(".whatsapp_verification_code").removeAttr("required");
    verificationForm.find(".whatsapp_verification_code").attr("disabled", "disabled");
    verificationForm.data("status", "send");
    verificationForm.attr("action", verificationForm.data("send"));
}

function OTPWhatsappswitchToVerifyCode() {
    $(".whatsapp-verification-count-down").text("");
    $(".whatsapp_verification_request").val("Send");
    $("#whatsapp_verification_code").val("");
    $(".whatsapp-verification-errors").empty();
    const verificationForm = $("#whatsapp-verification-modal-form");
    verificationForm.find(".whatsapp_verification_code").attr("required", "required");
    verificationForm.find(".whatsapp_verification_code").removeAttr("disabled");
    verificationForm.data("status", "verify");
    verificationForm.attr("action", verificationForm.data("verify"));
}

function OTPWhatsappstartCountdown() {
    const displayElement = $(".whatsapp-verification-count-down");
    let timer = whatappVerificationExpirationSeconds;
    OTPWhatsappCountdownInterval = setInterval(function () {
        const minutes = parseInt(timer / 60, 10);
        const seconds = parseInt(timer % 60, 10);

        displayElement.text(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);

        if (--timer < 0) {
            clearInterval(OTPWhatsappCountdownInterval);
            OTPWhatsappswitchToSendCode();
        }
    }, 1000);
}

function OTPWhatsappStopCountdown() {
    clearInterval(OTPWhatsappCountdownInterval);
}




/* 
    Apply The Logic
*/

$("#add-more-links").on("click", addMoreLinks);
$(document).on("click", ".product-size-color", addProductSizeColorInput);

$(initialForm).on('submit', function (e) {
    e.preventDefault();

    initialForm.validate();

    $('input[name^="product_url_"]').each(AddValidationRules);

    if (initialForm.valid()) {



        /*
            Step 1 - Show Shipment Form
        */



        createShipmentForm();





        /*
            Step 2 - Intialize Country Codes, show Verify button
        */

        let whatsappVerifyEnable = $("#whatsapp-verify-btn").data("whatsapp-verify-status");

        // Intialize the Whatsapp Phone Field to show the Country Codes
        initializeIntlTelWhatsappInput();

        // Check if whatsapp require and whatsapp verify enable status also true then show the whatsapp verify button
        if (isWhatsappRequire && whatsappVerifyEnable == true) {
            showWhatsappVerifyBtn();
            $("#whatsapp-verify-btn").on("click", onWhatsappVerifyButton);
        } else {
            $("#phone").addClass("full");
            $('#whatsapp-verify-btn').remove();
        }





        /*
            Step 3 - Whatsapp Verification Modal - Form Validation and Submission Handling 
        */



        $("#whatsapp-verification-modal-form").validate();
        $("#whatsapp-verification-modal-form").on("submit", onWhatsappVerificationModalFormSubmit);





        /*
            Step 4 - Shipment Form - Form Validation and Submission Handling 
        */

        let rules = {};

        // Add Jquery Validation method for phone
        addTelWhatsappValidationMethod(whatsappVerifyEnable);


        // Check if Whatsapp Require or not, if yes, then add validation
        if (isWhatsappRequire) {
            $("#phone").attr("required", "required");
            rules.phone = "intlTelWhatsappInput";
        }

        // Run Jquery Validator
        $("#shipmentForm").validate({
            rules,
            errorPlacement: function (error, element) {
                if (element.attr("id") == 'air-shipping') {
                    error.insertAfter(element.siblings("small"));
                } else if (element.attr("id") == 'phone'){
                    error.insertAfter(element.parent(".iti--allow-dropdown"))
                } else {
                    error.addClass('no-margin-error');
                    error.insertAfter(element);
                }
            }
        });
        $("#shipmentForm").on("submit", onShipmentFormSubmit)
    }

});

$(initialForm).find('input[type=submit]').removeAttr("disabled");