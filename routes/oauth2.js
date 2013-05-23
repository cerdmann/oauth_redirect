var url = require('url')
    , qs = require('querystring')
    , request = require('request');

/*
 * GET home page.
 */



exports.auth_callback = function(req, res){
    var queryString = url.parse(req.url, true).query;

    var code = queryString.code;
    var state = queryString.state;

    grab_auth_token(code, render_callback_page);

    function render_callback_page(response_body)   {
        var body = JSON.parse(response_body);
        res.render('oauth2_initial_callback',
            { title: 'Callback',
              code: code,
              state: state,
              access_token: body.access_token,
              refresh_token: body.refresh_token,
              token_type: body.token_type,
              expires_in: body.expires_in,
              scope: body.scope
            });
    }
};

function grab_auth_token(code, rendercallbackpage) {
    var tokenUrlString =  "http://localhost:9001/rest/oauth/token";
    var params = {code: code,
                  client_id: "mobile_android",
                  client_secret: "secret",
                  redirect_uri: "http://localhost:8080/oauth2_callback",
                  grant_type: "authorization_code"};

    var parameters = qs.stringify(params);

    request.post(  {
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     tokenUrlString,
        body:    parameters
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                rendercallbackpage(body);
            }
            else {
                console.log(error);
                console.log(response);
            }
        }
    );

}


