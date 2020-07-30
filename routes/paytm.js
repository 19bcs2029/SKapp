const checksum_lib = require('../paytm/checksum/checksum');
const port = 3000;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var http = require('http');

var data;




// var options = {
//     host: 'localhost',
//     port: '3000',
//     path: '/payment',
//     headers: {
//         'Accept': 'application/json'
//     }
// };
// https.get(options, function (res) {
//     var json = '';

//     res.on('data', function (chunk) {
//         json += chunk;
//     });

//     res.on('end', function () {
//         if (res.statusCode === 200) {
//             try {
//                 var data = JSON.parse(json);
//                 // data is available here:
//                 console.log(json);
//             } catch (e) {
//                 console.log('Error parsing JSON!');
//             }
//         } else {
//             console.log('Status:', res.statusCode);
//         }
//     });
// }).on('error', function (err) {
//     console.log('Error:', err);
// });





module.exports = (app) => {
    app.get('/payment', (req, res) => {



        http.get('http://localhost:3000/payment', (req, res) => {

            data = req.body;
            console.log('data');
        });

        let params = {};
        params['MID'] = 'NqTKuA63797783011362',
            params['WEBSITE'] = 'WEBSTAGING',
            params['CHANNEL_ID'] = 'WEB',
            params['INDUSTRY_TYPE_ID'] = 'Retail',


            params['ORDER_ID'] = 'Sadvjfdsbvfhvl',
            params['CUST_ID'] = 'dbucvsj',
            params['CALLBACK_URL'] = 'http://localhost:' + port + '/',
            params['EMAIL'] = 'abcd',
            params['MOBILE_NO'] = '2',
            // params['BANKTXNID']='',
            params['TXN_AMOUNT'] = '1',
            // params['CURRENCY']='INR',
            // params['STATUS']='',
            // params['RESPCODE']='',
            // params['RESPMSG']='',
            // params['TXNDATE']='',
            // params['GATEWAYNAME']='',
            // params['BANKNAME']='',
            // params['PAYMENTMODE']='',
            // params['CHECKSUMHASH']=''









            checksum_lib.genchecksum(params, '6%EpAP4s5i4RxbSt', function (err, checksum) {
                var txn_url = "https://securegw-stage.paytm.in/order/process"; // for staging


                var form_fields = "";
                

                
                for (var x in params) {
                    form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
                }
                form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
                res.end();
            })
    })
}