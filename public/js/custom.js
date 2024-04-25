/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./resources/js/custom.js ***!
  \********************************/
var whatsappVerifySendRoute = document.body.dataset.whatsappVerifySendRoute;
var shipmentFormRoute = document.body.dataset.shipmentFormRoute;
var whatsappVerificationRequiredCountryCodes = document.body.dataset.whatsappVerificationRequiredCountryCodes;
var validDomains = document.body.dataset.domains.split('.');
var whatappVerificationExpirationSeconds = document.body.dataset.whatappVerificationExpirationSeconds;
var whatsappVerifyStatus = document.body.dataset.whatsappVerifyStatus == true;
var isWhatsappRequire = document.body.dataset.whatsappRequire == true;
var iti;
var OTPWhatsappCountdownInterval;
var verifiedWhatsappNumber;
var len = 1;
var initialForm = $("#initialForm");
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
function FailModal(message) {
  var isHtml = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var config = {
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
    var urlObj = new URL(url);
    var hostname = urlObj.hostname.toLowerCase();
    var parts = hostname.split('.');
    var domain = parts[parts.length - 2];
    return validDomains.includes(domain);
  } catch (error) {
    return false;
  }
}
function getCountryCode() {
  var _Intl;
  var timeZone = (_Intl = Intl) === null || _Intl === void 0 || (_Intl = _Intl.DateTimeFormat()) === null || _Intl === void 0 || (_Intl = _Intl.resolvedOptions()) === null || _Intl === void 0 ? void 0 : _Intl.timeZone;
  if (timeZone) {
    var country = ct.getCountryForTimezone(timeZone);
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
  var countryDialCode = iti.getSelectedCountryData().dialCode;
  if (whatsappVerificationRequiredCountryCodes === "all" || new RegExp(whatsappVerificationRequiredCountryCodes).test(countryDialCode)) {
    var _whatsappVerifyStatus = $("#whatsapp-verify-btn").data("whatsapp-verify-status");
    return _whatsappVerifyStatus != true;
  }
  return true;
}

/*
    Validator Functions
*/

$.validator.addMethod("validURL", function (value, element) {
  var isValid = isValidURL(value);
  return this.optional(element) || isValid;
}, "Please enter a valid URL.");
function AddValidationRules() {
  $(this).rules("add", {
    required: true,
    validURL: true
  });
}
function addTelWhatsappValidationMethod(whatsappVerifyEnable) {
  var countryCode = getCountryCode();
  iti.setCountry(countryCode);
  $.validator.addMethod("intlTelWhatsappInput", function (value, element) {
    if (this.optional(element) || iti.isValidNumber()) {
      var number = iti.getNumber();
      $(element).val(number);
    }
    if (whatsappVerifyEnable == true) {
      showWhatsappVerifyBtn();
    }
    return this.optional(element) || iti.isValidNumber();
  }, function () {
    var errorCode = iti.getValidationError();
    if (errorCode !== -99) {
      return ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"][errorCode];
    } else {
      return "Invalid number";
    }
  });
}

/* 
    Html Functions 
*/

function addProductSizeColorInput() {
  var id = '';
  var targetInputElement;
  var targetElement = $(this).closest(".product-size");
  var allProductSizeColors = $(".product-size-color");
  var len = allProductSizeColors.index($(this)) + 1;
  if ($(this).hasClass('inner')) {
    id = 'product_size_color';
    targetInputElement = targetElement.find('input[name^="product_size_color"]');
  } else {
    id = "product_size_color_".concat(len);
    targetInputElement = targetElement.find('input[name^="product_size_color_"]');
  }
  var inputExists = targetInputElement.length > 0;
  if (inputExists) {
    targetInputElement.closest('.product-size-color-parent').remove();
    len--;
  } else {
    targetElement.append("\n                <div class=\"col-auto mt-2 product-size-color-parent\">\n                    <div class=\"form-group\">\n                        <input type=\"text\" class=\"form-control\" name=\"".concat(id, "\" id=\"").concat(id, "\">\n                    </div>\n                </div>\n            "));
    len++;
  }
}
function addMoreLinks() {
  removeShipmentForm();
  if ($("#product-links .form-group:eq(0) > .product-size").length == 0) {
    $("#product-links .form-group:eq(0)").append("<div class=\"row product-size my-3\">\n                <div class=\"col-auto align-self-center\">\n                    <a href=\"javascript:void(0)\"  class=\"product-size-color text-decoration-none text-secondary\" ><small>+ Add Product Size/Color</small></a>\n                </div>\n            </div>");
  }
  var count = $("#product-links .form-group").length + 1;
  var html = "\n            <div class=\"form-group my-3\">\n                <input type=\"text\" required name=\"product_url_".concat(count, "\" id=\"product_url_").concat(count, "\" class=\"form-control\"\n                    placeholder=\"Enter Your Product Full URL\"\n                >\n                <div class=\"row product-size my-3\">\n                    <div class=\"col-auto align-self-center\">\n                        <a href=\"javascript:void(0)\"  class=\"product-size-color text-decoration-none text-secondary\" ><small>+ Add Product Size/Color</small></a>\n                    </div>\n                </div>\n            </div>\n        ");
  $("#product-links").append(html);
  $("#remove-more-links").removeClass("d-none");
}
function removeMoreLinks() {
  var productLinks = $("#product-links");
  if (productLinks.children().length > 1) productLinks.children().last().remove();
  if (productLinks.children().length == 1) $(this).addClass("d-none");
}
function createShipmentForm() {
  var form = "\n                <form action=\"".concat(shipmentFormRoute, "\" id=\"shipmentForm\">\n                    <div class=\"row\">\n                        <div class=\"col-12 my-2\">\n                            <div class=\"form-group\">\n                                <input type=\"text\" id=\"name\" placeholder=\"Your name here\"\n                                    name=\"name\" class=\"form-control mb-2\" required>\n                            </div>\n                        </div>\n                        <div class=\"col-12 my-2\">\n                            <div class=\"form-group\">\n                                <input type=\"email\" name=\"email\" placeholder=\"Your email here\"\n                                    id=\"email\" class=\"form-control mb-2\" required>\n                            </div>\n                        </div>\n                        <div class=\"col-12 my-2\">\n                            <div class=\"form-group position-relative\">\n                                <input type=\"tel\" name=\"phone\" placeholder=\"Your whatsapp number here\"\n                                    id=\"phone\" class=\"form-control mb-2\">\n                                <button \n                                    type=\"button\"\n                                    class=\"btn btn-dark px-2 py-1 rounded-1 verify-btn whatsapp-verify-btn\"\n                                    id=\"whatsapp-verify-btn\"\n                                    data-action=\"").concat(whatsappVerifySendRoute, "\"\n                                    data-whatsapp-verify-status=\"").concat(whatsappVerifyStatus, "\"\n                                >\n                                    Verify\n                                </button>\n                            </div>\n                        </div>\n                        <div class=\"col-12 my-2\">\n                            <div class=\"row product-size my-3\">\n                                <div class=\"col-auto align-self-center\">\n                                    <a href=\"javascript:void(0)\"\n                                        class=\"product-size-color inner text-decoration-none text-secondary\">\n                                            <small>+ Add Product Size/Color</small>\n                                    </a>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"col-12\">\n                            <div class=\"form-check\">\n                                <input class=\"form-check-input\" type=\"radio\" name=\"shipping\" id=\"air-shipping\"\n                                    value=\"air-shipping\" required>\n                                <label class=\"form-check-label\" for=\"air-shipping\">\n                                    Air Shipping\n                                </label>\n                                <small class=\"text-secondary d-block\">Takes 8 to 11 business days. Good for small items.\n                                        i.e. laptops, cameras, few books, etc.</small>\n                            </div>\n                        </div>\n                        <div class=\"col-12 my-2\">\n                            <div class=\"form-check\">\n                                <input class=\"form-check-input\" type=\"radio\" name=\"shipping\" id=\"sea-shipping\"\n                                    value=\"sea-shipping\" required>\n                                <label class=\"form-check-label\" for=\"sea-shipping\">\n                                    Sea Shipping\n                                </label>\n                                <small class=\"text-secondary d-block\">Takes 4 to 6 weeks. Good for very heavy items.i.e.\n                                        TVs, large electronics, dozens of books, etc.</small>\n                            </div>\n                        </div>\n                        <div class=\"col-12 mt-3\">\n                            <div class=\"form-group text-center\">\n                                <input type=\"submit\" value=\"Submit Request\" class=\"btn btn-sm btn-primary p-2\">\n                            </div>\n                        </div>\n                        <div class=\"col-12 my-2 error back-errors\" id=\"inquiries-errors\"></div>\n                    </div>\n                </form>\n        ");
  if ($("#shipmentForm").length == 0) {
    var html = "\n                <section class=\"container my-5\">\n                    <div class=\"row justify-content-center\">\n                        <div class=\"col-lg-6 col-12\">\n                            <div class=\"card bg-dark text-light border-light shipment-form-card\">\n                                <div class=\"card-body\">\n                                    <h4 class=\"text-light text-center mt-2 mb-3\">Request Form</h4>\n                                    ".concat(form, "\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </section>\n            ");
    $(html).insertAfter(".links-section");
  } else {
    $("#shipmentForm").replaceWith(form);
  }
}
function removeShipmentForm() {
  $("#shipmentForm").remove();
  $(".shipment-form-card").addClass("d-none");
}
function showWhatsappVerifyBtn() {
  var countryDialCode = iti.getSelectedCountryData().dialCode;
  var form = $(".contact-form-type");
  var yourPhone = $(form).find("#phone");
  var whatsappVerifyBtn = $(form).find(".whatsapp-verify-btn");
  if (whatsappVerificationRequiredCountryCodes === "all" || new RegExp(whatsappVerificationRequiredCountryCodes).test(countryDialCode)) {
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
  var form = $(this);
  var action = $(this).data("action");
  var phone = $("#phone");
  if (phone.valid()) {
    var formData = new FormData();
    formData.append("phone", phone.val());
    showLoader();
    $.ajax({
      url: action,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function success(response) {
        form.find(".back-errors").html("");
        openOTPWhatsappVerificationModal(response.phone);
      },
      error: function error(response) {
        var _response$responseJSO;
        var errorHtml = '<ul class="ps-0">';
        if ((_response$responseJSO = response.responseJSON) !== null && _response$responseJSO !== void 0 && _response$responseJSO.error) {
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
      complete: function complete() {
        hideLoader();
      }
    });
  }
}
function onWhatsappVerificationModalFormSubmit(e) {
  e.preventDefault();
  if ($(this).valid()) {
    var form = document.getElementById("whatsapp-verification-modal-form");
    var action = form.getAttribute("action");
    var jForm = $("#whatsapp-verification-modal-form");
    var status = jForm.data("status");
    var phone = jForm.data("phone");
    var formData = new FormData(form);
    formData.append("phone", phone);

    // Send Whatsapp Verification Code

    showLoader();
    $.ajax({
      url: action,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function success(response) {
        if (status == 'verify') {
          closeOTPWhatsappVerificationModal();
          var verifyBtn = $("#whatsapp-verify-btn");
          switchToVerifiedOTPWhatsappBtn(verifyBtn);
          verifiedWhatsappNumber = formData.get("phone");
        } else {
          $('#whatsapp-verification-errors').empty();
          OTPWhatsappswitchToVerifyCode();
          OTPWhatsappstartCountdown();
        }
      },
      error: function error(response) {
        var _response$responseJSO2;
        var errorHtml = '<ul class="ps-0">';
        if ((_response$responseJSO2 = response.responseJSON) !== null && _response$responseJSO2 !== void 0 && _response$responseJSO2.error) {
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
      complete: function complete() {
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
    if (!isWhatsappRequire || isWhatsappRequire && isWhatsappVerified()) {
      var form = document.getElementById("shipmentForm");
      var action = form.action;
      var formData = new FormData(form);

      // Append the Links and their product size color if any

      var structuredData = [];
      $('input[name^="product_url_"]').each(function () {
        var productUrl = $(this).val();
        var productData = {
          product_url: productUrl
        };
        var productSizeColor = $(this).closest('.form-group').find('input[name^="product_size_color_"]');
        if (productSizeColor.length > 0) productData['product_size_color'] = productSizeColor.val();
        structuredData.push(productData);
      });
      formData.append("links", JSON.stringify(structuredData));

      // Send Request

      showLoader();
      $.ajax({
        url: action,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function success(response) {
          successModal(response.message);
          removeShipmentForm();
        },
        error: function error(response) {
          var _response$responseJSO3;
          var isErrorIdentify = false;
          var errorHtml = '<ul class="ps-0">';
          if ((_response$responseJSO3 = response.responseJSON) !== null && _response$responseJSO3 !== void 0 && _response$responseJSO3.error) {
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
          if (isErrorIdentify) {
            FailModal(errorHtml, true);
          } else {
            FailModal("Something Went Wrong. Please Try Again Later !");
          }
        },
        complete: function complete() {
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
  var verificationForm = $("#whatsapp-verification-modal-form");
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
  var verificationForm = $("#whatsapp-verification-modal-form");
  verificationForm.find(".whatsapp_verification_code").attr("required", "required");
  verificationForm.find(".whatsapp_verification_code").removeAttr("disabled");
  verificationForm.data("status", "verify");
  verificationForm.attr("action", verificationForm.data("verify"));
}
function OTPWhatsappstartCountdown() {
  var displayElement = $(".whatsapp-verification-count-down");
  var timer = whatappVerificationExpirationSeconds;
  OTPWhatsappCountdownInterval = setInterval(function () {
    var minutes = parseInt(timer / 60, 10);
    var seconds = parseInt(timer % 60, 10);
    displayElement.text("".concat(minutes, ":").concat(seconds < 10 ? "0" : "").concat(seconds));
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
$("#remove-more-links").on("click", removeMoreLinks);
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

    var whatsappVerifyEnable = $("#whatsapp-verify-btn").data("whatsapp-verify-status");

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

    var rules = {};

    // Add Jquery Validation method for phone
    addTelWhatsappValidationMethod(whatsappVerifyEnable);

    // Check if Whatsapp Require or not, if yes, then add validation
    if (isWhatsappRequire) {
      $("#phone").attr("required", "required");
      rules.phone = "intlTelWhatsappInput";
    }

    // Run Jquery Validator
    $("#shipmentForm").validate({
      rules: rules,
      errorPlacement: function errorPlacement(error, element) {
        if (element.attr("id") == 'air-shipping') {
          error.insertAfter(element.siblings("small"));
        } else if (element.attr("id") == 'phone') {
          error.insertAfter(element.parent(".iti--allow-dropdown"));
        } else {
          error.addClass('no-margin-error');
          error.insertAfter(element);
        }
      }
    });
    $("#shipmentForm").on("submit", onShipmentFormSubmit);
  }
});
$(initialForm).find('input[type=submit]').removeAttr("disabled");
/******/ })()
;