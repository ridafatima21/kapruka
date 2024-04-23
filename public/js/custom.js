/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./resources/js/custom.js ***!
  \********************************/
var validDomains = document.body.dataset.domains.split('.');
var initialForm = $("#initialForm");
initialForm.validate();

/*
    Helper Functions
*/

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

/* 
    Html Functions 
*/

function addProductSizeColorInput() {
  var len = $(this).index + 1;
  var targetElement = $(this).parent().parent(".product-size");
  var inputExists = targetElement.find('input[name^="product_size_color_"]').length > 0;
  if (inputExists) {
    targetElement.find('input[name^="product_size_color_"]').closest('.col-4').remove();
  } else {
    targetElement.append("\n                <div class=\"col-4\">\n                    <div class=\"form-group\">\n                        <input type=\"text\" class=\"form-control\" required name=\"product_size_color_".concat(len, "\" id=\"product_size_color_").concat(len, "\">\n                    </div>\n                </div>\n            "));
  }
}
function addMoreLinks() {
  if ($("#product-links .form-group:eq(0) > .product-size").length == 0) {
    $("#product-links .form-group:eq(0)").append("<div class=\"row product-size\">\n                <div class=\"col-12\">\n                    <a href=\"javascript:void(0)\"  class=\"product-size-color text-decoration-none text-secondary\" ><small>+ Add Product Size/Color</small></a>\n                </div>\n            </div>");
  }
  var count = $("#product-links .form-group").length + 1;
  var html = "\n            <div class=\"form-group my-2\">\n                <input type=\"text\" required name=\"product_url_".concat(count, "\" id=\"product_url_").concat(count, "\" class=\"form-control\"\n                    placeholder=\"Enter Your Product Full URL\"\n                >\n                <div class=\"row product-size\">\n                    <div class=\"col-12\">\n                        <a href=\"javascript:void(0)\"  class=\"product-size-color text-decoration-none text-secondary\" ><small>+ Add Product Size/Color</small></a>\n                    </div>\n                </div>\n            </div>\n        ");
  $("#product-links").append(html);
}
function createShipmentForm() {
  var form = "\n                <form action=\"\" id=\"shipmentForm\">\n                    <div class=\"row g-3\">\n                        <div class=\"col-12\">\n                            <div class=\"form-group\">\n                                <input type=\"text\" id=\"your-name\" placeholder=\"Your name here\"\n                                    name=\"your-name\" class=\"form-control\" required>\n                            </div>\n                        </div>\n                        <div class=\"col-12\">\n                            <div class=\"form-group\">\n                                <input type=\"email\" name=\"your-email\" placeholder=\"Your email here\"\n                                    id=\"your-email\" class=\"form-control\" required>\n                            </div>\n                        </div>\n                        <div class=\"col-12\">\n                            <div class=\"form-group\">\n                                <input type=\"tel\" name=\"your-phone\" placeholder=\"Your whatsapp number here\"\n                                    id=\"your-phone\" class=\"form-control\">\n                            </div>\n                        </div>\n                        <div class=\"col-12\">\n                            <div class=\"row product-size\">\n                                <div class=\"col-12\">\n                                    <a href=\"javascript:void(0)\"\n                                        class=\"product-size-color text-decoration-none text-secondary\"><small>+\n                                            Add Product Size/Color</small></a>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"col-12\">\n                            <div class=\"form-check\">\n                                <input class=\"form-check-input\" type=\"radio\" name=\"shipping\" id=\"air-shipping\"\n                                    value=\"air-shipping\">\n                                <label class=\"form-check-label\" for=\"air-shipping\">\n                                    Air Shipping\n                                </label>\n                                <br>\n                                <small class=\"text-secondary\">Takes 8 to 11 business days. Good for small items.\n                                        i.e. laptops, cameras, few books, etc.</small>\n                            </div>\n                        </div>\n                        <div class=\"col-12\">\n                            <div class=\"form-check\">\n                                <input class=\"form-check-input\" type=\"radio\" name=\"shipping\" id=\"sea-shipping\"\n                                    value=\"sea-shipping\">\n                                <label class=\"form-check-label\" for=\"sea-shipping\">\n                                    Sea Shipping\n                                </label>\n                                <br>\n                                <small class=\"text-secondary\">Takes 4 to 6 weeks. Good for very heavy items.i.e.\n                                        TVs, large electronics, dozens of books, etc.</small>\n                            </div>\n                        </div>\n                        <div class=\"col-12\">\n                            <div class=\"form-group\">\n                                <input type=\"submit\" value=\"Submit Request\" class=\"btn btn-sm btn-primary\">\n                            </div>\n                        </div>\n                    </div>\n                </form>\n        ";
  if ($("#shipmentForm").length == 0) {
    var html = "\n                <section class=\"container my-5\">\n                    <div class=\"row\">\n                        <div class=\"col-lg-6 col-12\">\n                            <div class=\"card\">\n                                <div class=\"card-body\">\n                                    ".concat(form, "\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </section>\n            ");
    $(html).insertAfter(".links-section");
  } else {
    $("#shipmentForm").replaceWith(form);
  }
}

/* 
    Apply The Logic
*/

$("#add-more-links").on("click", addMoreLinks);
$(document).on("click", ".product-size-color", addProductSizeColorInput);
$(initialForm).submit(function (e) {
  e.preventDefault();
  initialForm.validate();
  $('input[name^="product_url_"]').each(AddValidationRules);
  if ($('#initialForm').valid()) {
    createShipmentForm();
  }
});
/******/ })()
;