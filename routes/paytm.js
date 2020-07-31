const https = require('https');
const checksum_lib = require('../paytm/checksum/checksum');
const port = 3000;

var data  = {};

module.exports = (app)=> {

    app.post('/payment', (req, res) => {
        // console.log("I got a request!!");
        console.log(req.body);
        this.data = req.body;
        res.json({
            status: req.body.status,
            orderID: this.data.odId,
            price: this.data.txnamount,
            cstID: this.data.cstId,
            email: this.data.email,
            mobile: this.data.mob
        });
    
        
    })
    
    app.get('/paytm', (req,res)=>{
       
        let params = {};
        params['MID'] = 'NqTKuA63797783011362',
        params['WEBSITE'] = 'WEBSTAGING',
        params['CHANNEL_ID']='WEB',
        params['INDUSTRY_TYPE_ID']='Retail',

        // params['TXNID'] = '1234',
        params['ORDER_ID'] = this.data.odId,
        params['CUST_ID']= this.data.cstId,
        // params['CALLBACK_URL']='https://sk-traders-509b1.web.app/products',
        params['CALLBACK_URL']='http://localhost:'+port+'/cart',
        params['EMAIL']= this.data.email,
        params['MOBILE_NO']= this.data.mob,
        params['TXN_AMOUNT']= `${this.data.txnamount}`,
        
        checksum_lib.genchecksum(params,'6%EpAP4s5i4RxbSt',function(err,checksum){
            var txn_url = "https://securegw-stage.paytm.in/order/process"; // for staging
				
				
				var form_fields = "";
				for(var x in params){
					form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"' >";
				}
				form_fields += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' >";

				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields+'</form><script type="text/javascript">document.f1.submit();</script></body></html>');
				res.end();
        })
    })



    app.get('/paytm-status', (req,res) => {

        var paytmParams = {};

        /* body parameters */
        paytmParams.body = {

            /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
            "mid" : "NqTKuA63797783011362",
            "orderId" : this.data.odId,
        };

        /**
        * Generate checksum by parameters we have in body
        * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
        */
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "6%EpAP4s5i4RxbSt").then(function(checksum){
            /* head parameters */
            paytmParams.head = {

                /* put generated checksum value here */
                "signature"	: checksum
            };

            /* prepare JSON string for request */
            var post_data = JSON.stringify(paytmParams);

            var options = {

                /* for Staging */
                hostname: 'securegw-stage.paytm.in',

                /* for Production */
                // hostname: 'securegw.paytm.in',

                port: 443,
                path: '/v3/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            // Set up the request
            var response = "";
            var post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function(){
                    console.log('Response: ', response);
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });
            })


}