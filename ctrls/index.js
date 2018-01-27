module.exports=function(router){
	router.get('/', function(req, res, next) {
	  res.render('index');
	});
	router.get('/index', function(req, res, next) {
	  res.render('index');
	});
	router.use("/api/index",function(req,res){
		res.send({
			code:1,
			msg:[
				{
					id:1,
					text:"111"
				},
				{
					id:2,
					text:"222"
				}
			]
		})
	})
}
