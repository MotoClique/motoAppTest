
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');

//////////////////////////Favourite////////////////////////////////
const Fav = mongoose.model('Fav');

module.exports.getFav = function(req,res){//Fetch
	var query = {};
	if(req.query.bid_sell_buy_id){
		query.bid_sell_buy_id = {"$eq":req.query.bid_sell_buy_id};
	}
	if(req.query.user_id){
		query.user_id = {"$eq":req.query.user_id};
	}
	if(req.query.deleted){
		query.deleted = {"$eq":req.query.deleted};
	}
	else{
		query.deleted = {"$ne": true};
	}
	Fav.find(query,function(err, result){
		res.json({results: result, error: err});
	});
};
module.exports.addFav = function(req,res){//Add New
		var d = new Date();
		var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		
		var doc = req.body;
		doc.createdAt = d;
		doc.changedAt = d;
		doc.createdBy = req.payload.user_id;
		doc.changedBy = req.payload.user_id;
		
		let newFav = new Fav(doc);
		
		newFav.save((err, result)=>{
			if(err){
				res.json({statusCode: 'F', msg: 'Failed to add', error: err});
			}
			else{
				res.json({statusCode: 'S', msg: 'Entry added', result: result});
			}
		});
};
module.exports.updateFav = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = d;
		doc.changedBy = req.payload.user_id;
		
	Fav.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};

module.exports.deleteFav = function(req,res){//Delete
	Fav.remove({_id: req.params.id}, function(err,result){
		if(err){
			res.json(err);
		}
		else{
			res.json(result);
		}
	});
};
