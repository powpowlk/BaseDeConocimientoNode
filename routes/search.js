var express = require('express');
var xmlparser = require('express-xml-bodyparser');
var router = express.Router();
var api = require('../apiCalls');

/* GET users listing. */
router.get('/', function(req, res, next) {
  fabs = api.restAPICall(api.headersWAuth(req.query.st), 'GET', api.url+'/api/core/system/valueslistvalue/flat/valueslist/'+api.ids.fabVL, '');
  tecs = api.restAPICall(api.headersWAuth(req.query.st), 'GET', api.url+'/api/core/system/valueslistvalue/flat/valueslist/'+api.ids.tecVL, '');
  if(fabs.StatusCode === 401 || tecs.StatusCode === 401){
    res.redirect('/logout?st='+req.query.st);
    res.end();
  }
  tecsd = {}
  fabsd = {}
  fabs.forEach(function(fab){
    fabsd[fab.RequestedObject.Id] = fab.RequestedObject.Name;
  });
  tecs.forEach(function(tec){
    tecsd[tec.RequestedObject.Id] = tec.RequestedObject.Name;
  });

  res.render('search', { title: 'Buscar - Base de Conocimiento', sessionToken: req.query.st, fabsd: fabsd, tecsd: tecsd});
  res.end();
});

router.post('/', xmlparser({trim: false, explicitArray: false}), function(req, res, next) {

	//console.log(req.headers);
	console.log(req);
	resp = api.restAPICall(api.headersSOAP(req.headers.soapaction), 'POST', api.url+'/ws/search.asmx', req.rawBody);
  if(resp.StatusCode === 401){
    res.redirect('/logout?st='+req.body.st);
    res.end();
  }
	console.log(resp.toString('utf8'));
	res.send(resp.toString('utf8'));
  res.end();

});


module.exports = router;
