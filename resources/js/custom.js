const validDomains = document.body.dataset.domains.split('.');

let initialForm = $("#initialForm");
initialForm.validate();



/*
    Helper Functions
*/

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
        targetElement.append(`
                <div class="col-4">
                    <div class="form-group">
                        <input type="text" class="form-control" required name="product_size_color_${len}" id="product_size_color_${len}">
                    </div>
                </div>
            `);
    }
}

function addMoreLinks() {

    if ($("#product-links .form-group:eq(0) > .product-size").length == 0) {
        $("#product-links .form-group:eq(0)").append(`<div class="row product-size">
                <div class="col-12">
                    <a href="javascript:void(0)"  class="product-size-color text-decoration-none text-secondary" ><small>+ Add Product Size/Color</small></a>
                </div>
            </div>`);
    }

    var count = $("#product-links .form-group").length + 1;

    var html = `
            <div class="form-group my-2">
                <input type="text" required name="product_url_${count}" id="product_url_${count}" class="form-control"
                    placeholder="Enter Your Product Full URL"
                >
                <div class="row product-size">
                    <div class="col-12">
                        <a href="javascript:void(0)"  class="product-size-color text-decoration-none text-secondary" ><small>+ Add Product Size/Color</small></a>
                    </div>
                </div>
            </div>
        `;

    $("#product-links").append(html);

}

function createShipmentForm() {

    var form = `
                <form action="" id="shipmentForm">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="form-group">
                                <input type="text" id="your-name" placeholder="Your name here"
                                    name="your-name" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <input type="email" name="your-email" placeholder="Your email here"
                                    id="your-email" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <input type="tel" name="your-phone" placeholder="Your whatsapp number here"
                                    id="your-phone" class="form-control">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="row product-size">
                                <div class="col-12">
                                    <a href="javascript:void(0)"
                                        class="product-size-color text-decoration-none text-secondary"><small>+
                                            Add Product Size/Color</small></a>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="shipping" id="air-shipping"
                                    value="air-shipping">
                                <label class="form-check-label" for="air-shipping">
                                    Air Shipping
                                </label>
                                <br>
                                <small class="text-secondary">Takes 8 to 11 business days. Good for small items.
                                        i.e. laptops, cameras, few books, etc.</small>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="shipping" id="sea-shipping"
                                    value="sea-shipping">
                                <label class="form-check-label" for="sea-shipping">
                                    Sea Shipping
                                </label>
                                <br>
                                <small class="text-secondary">Takes 4 to 6 weeks. Good for very heavy items.i.e.
                                        TVs, large electronics, dozens of books, etc.</small>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <input type="submit" value="Submit Request" class="btn btn-sm btn-primary">
                            </div>
                        </div>
                    </div>
                </form>
        `;

    if ($("#shipmentForm").length == 0) {
        var html = `
                <section class="container my-5">
                    <div class="row">
                        <div class="col-lg-6 col-12">
                            <div class="card">
                                <div class="card-body">
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