<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Received a Request - {{ env('APP_NAME') }}</title>
</head>

<body>
    <div
        style="width: 100%; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #2e2e2e; color: #ffffff; font-family: Arial, sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr style="background-color: #1a1a1a;">
                <td style="padding: 20px 0; text-align: center; font-size: 24px">{{ env('APP_NAME') }}</td>
            </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
            style="border-collapse: collapse; background-color: #212121;">
            <tr>
                <td style="padding: 30px 20px;">
                    <h1 style="color: #007BFF; font-size: 24px; margin: 0 0 30px 0;">
                        Hi,
                        <span style="font-size: 16px; color: #ffffff;">You've received a new request:</span>
                    </h1>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                        style="border-collapse: collapse;">
                        <tr>
                            <td style="padding: 5px 10px 5px 0px; font-size: 16px; font-weight: bold; width: 20%;">Name:
                            </td>
                            <td style="padding: 10px 0; font-size: 16px;">{{ $data['name'] }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 10px 5px 0px; font-size: 16px; font-weight: bold; width: 20%;">
                                Subject:
                            </td>
                            <td style="padding: 10px 0; font-size: 16px;">{{ $data['email'] }}</td>
                        </tr>

                        @if(isset($data['phone']))
                        <tr>
                            <td style="padding: 5px 10px 5px 0px; font-size: 16px; font-weight: bold; width: 30%;">
                                Phone:</td>
                            <td style="padding: 10px 0; font-size: 14px;">{{ $data['phone'] }}</td>
                        </tr>
                        @endif

                        @if(isset($data['product_size_color']))
                        <tr>
                            <td style="padding: 5px 10px 5px 0px; font-size: 16px; font-weight: bold; width: 30%;">
                                Product Size Color:</td>
                            <td style="padding: 10px 0; font-size: 14px;">{{ $data['product_size_color'] }}</td>
                        </tr>
                        @endif

                        @if(isset($data['links']) && is_array($data['links']))
                        <tr>
                            <td style="padding: 5px 10px 5px 0px; font-size: 16px; font-weight: bold; width: 30%;">
                                Links:
                            </td>
                            <td style="padding: 10px 0; font-size: 14px;">
                                <ul>
                                    @foreach($data['links'] as $link)
                                        <li style="padding-bottom: 10px;">
                                            <a href="{{ $link['product_url'] }}">Product Link</a>
                                            @if(isset($link['product_size_color']))
                                                <ul style="padding-left: 0; color: #fff;">
                                                    <li style="padding-top: 10px;">Product Size/Color: {{ $link['product_size_color'] }}</li>
                                                </ul>
                                            @endif
                                        </li>
                                    @endforeach
                                </ul>
                            </td>
                        </tr>
                        @endif
                        
                        <tr>
                            <td style="padding: 5px 10px 5px 0px; font-size: 16px; font-weight: bold; width: 20%;">
                                Message:</td>
                            <td style="padding: 10px 0; font-size: 16px;">{{ $data['shipping'] }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <div style="background-color: #1a1a1a; padding: 15px; text-align: center; margin-top: 16px;">
            <p style="font-size: 14px;">&copy; 2023 {{ env('APP_NAME') }}</p>
        </div>
    </div>
</body>

</html>
