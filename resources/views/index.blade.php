<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Manual PC</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    <script src="{{ asset('js/app.js') }}" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/additional-methods.min.js" defer></script>
    <script src="{{ asset('js/custom.js') }}" defer></script>
    
</head>

<body class="bg-light" data-domains="{{ env('VALID_DOMAINS') }}">
    
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
</body>

</html>
