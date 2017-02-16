exports.getPhoneConfigs = function(req, res){
  var request = require('request');
  // Real Data:
  // 7873042704
  // @Snowman19
  var options = {
      url: 'https://selfcarepr.optivon.com/sip-ps/accession/login?DirectoryNumber='+req.body.phone+'&computerID=1eb3ee6fb5dfb557&platform=Accession&device=Android&deviceOS=7.1.1&ApplicationVersion=2.23.00&ApplicationID=MS_Android_Acc&Password='+req.body.password,
      headers: {
      'User-Agent': 'AM_MS_Android_Acc/2.23.00/Huawei/Nexus 6P/7.1.1/Accession Android CommPortal'
    }
  };
  console.log(options.url)
  function callback(error, response, body) {

      if (!error && response.statusCode == 200) {
        var parseString = require('xml2js').parseString;
        var xml = body;
        parseString(xml, function (err, result) {
          res.send(result.phoneConfig.network[0]);
        });
      }
      else{
        res.sendStatus(response.statusCode);
      }
  }
  request(options, callback);
}
