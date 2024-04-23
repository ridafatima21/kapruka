<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manual PC</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <script src="{{ asset('js/app.js') }}" defer></script>
</head>

<body class="bg-light">
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
                <div class="card">
                    <div class="card-header">
                        <h4>Get any item from global web sites into Sri Lanka</h4>
                    </div>
                    <div class="card-body">
                        <form id="initialForm">
                            <div class="row">
                                <div class="col-lg-8">
                                    <div class="row g-3">
                                        <div class="col-12" id="product-links">
                                            <div class="form-group my-2">
                                                <input type="text" required name="product_url_1" id="product_url_1"
                                                    class="form-control" placeholder="Enter Your Product Full URL">
                                            </div>
                                        </div>
                                        <div class="col-12 d-flex justify-content-end align-item-end"
                                            class="add-remove-link">
                                            <a href="javascript:void(0)" id="add-more-links"
                                                class="text-decoration-none">+ Add More Links</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <input type="submit" class="btn btn-primary my-2" value="Check Price">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/additional-methods.min.js" defer></script>
    <script>
        const validDomains = "{{ env('VALID_DOMAINS') }}".split(',');
        $(document).ready(function() {
            $("#add-more-links").on("click", function() {
                if ($("#product-links .form-group:eq(0) > .product-size").length == 0) {
                    $("#product-links .form-group:eq(0)").append(`<div class="row product-size">
                                                    <div class="col-12">
                                                        <a href="javascript:void(0)"  class="product-size-color text-decoration-none text-secondary" ><small>+ Add Product Size/Color</small></a>
                                                    </div>
                                                </div>`);
                }
                var count = $("#product-links .form-group").length + 1;
                var html = ` <div class="form-group my-2">
                                                <input type="text" required name="product_url_${count}" id="product_url_${count}" class="form-control"
                                                    placeholder="Enter Your Product Full URL">
                                                    <div class="row product-size">
                                                    <div class="col-12">
                                                        <a href="javascript:void(0)"  class="product-size-color text-decoration-none text-secondary" ><small>+ Add Product Size/Color</small></a>
                                                    </div>
                                                </div>
                                            </div>`;
                $("#product-links").append(html);
            });
            $(document).on("click", ".product-size-color", function() {
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
            });
            $("#initialForm input[type=submit]").on("click", function(e) {
                e.preventDefault();
                // $('input[name^="product_url_"]').each(function(e) {
                //     $(this).rules("add", {
                //         required: true
                //     });
                // });
                  // $('input[name^="product_url_"]').each(function(index) {
                //     var urlValue = $(this).val();
                //     var isValid = isValidURL(urlValue);
                //     if (!isValid) {
                //         alert("URL IS NOT VALID: " + urlValue);
                //     }
                // });
                // if ($('#initialForm').validate().form()) {
                    var form = `   <form action="" id="shipmentForm">
                            <div class="row g-3">
                                <div class="col-12">

                                    <div class="form-group">
                                        <input type="text" id="your-name" placeholder="Your name here"
                                            name="your-name" class="form-control">
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <input type="email" name="your-email" placeholder="Your email here"
                                            id="your-email" class="form-control">
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
                        </form>`;
                    if ($("#shipmentForm").length == 0) {
                        var html = `  <section class="container my-5">
        <div class="row">
            <div class="col-6">
                <div class="card">
                    <div class="card-body">
                     ${form}
                    </div>
                </div>
            </div>
        </div>
    </section>`;
                        $(html).insertAfter(".links-section");
                    } else {
                        $("#shipmentForm").replaceWith(form);
                    }
                // } else {
                //     alert("Validaton failed")
                // }


            });
        })

        function isValidURL(url) {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            return validDomains.includes(hostname);
        }
    </script>
</body>

</html>
