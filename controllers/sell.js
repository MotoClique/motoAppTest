
const async = require("async");
const request = require('request');
var mongoose = require('mongoose');
var ctrlNotification = require('./notification');
const UserSubMap = mongoose.model('UserSubMap');
const Counter = mongoose.model('Counter');
const Image = mongoose.model('Image');
const Thumbnail = mongoose.model('Thumbnail');
const ChatInbox = mongoose.model('ChatInbox');
const Fav = mongoose.model('Fav');

//////////////////////////Sell////////////////////////////////
const Sell = mongoose.model('Sell');

module.exports.getSell = function(req,res){//Fetch
	//var read_params = {count:0, skip:0, limit:10};
	var query = {};
	if(req.query.sell_id){
		query.sell_id = {"$eq":req.query.sell_id};
	}
	
	if(req.query.city){
		query.city = {"$eq":req.query.city};
	}
	if(req.query.deleted){
		query.deleted = {"$eq":req.query.deleted};
	}
	else{
		query.deleted = {"$ne": true};
	}
	query.active = {"$eq": "X"};
	
	if(req.query.user_id){
		query.user_id = {"$eq":req.query.user_id};
		
		Sell.count(query,function(err_count,res_count){
			var count = res_count;
			if(req.query.count && !isNaN(req.query.count))
				count = parseInt(req.query.count);
			
			var skip = (req.query.skip && !isNaN(req.query.skip))?req.query.skip:0;
			if(count && res_count>count && req.query.skip)
				skip = (res_count - count) - (- req.query.skip);
			
			var limit = (req.query.limit && !isNaN(req.query.limit))?req.query.limit:10;
						
			Sell.find(query).sort({"index_count":-1}).skip(parseInt(skip)).limit(parseInt(limit))
			.exec(function(err, result){
				if(err){
					res.json({results: null, error: err, params:{count:count, skip:skip, limit:limit}});
				}
				else{
					res.json({results: result, error: err, params:{count:count, skip:skip-(-result.length), limit:limit}});
				}
			});
		});
	}
	else{
		Sell.find(query,function(err, result){
			res.json({results: result, error: err, params:{}});
		});
	}
};
module.exports.addSell = function(req,res){//Add New
	var query_sub = {}
	query_sub.user_id = {"$eq":req.payload.user_id};
	query_sub.active = {"$eq": "X"};
	query_sub.deleted = {"$ne": true};
	UserSubMap.find(query_sub,function(err_sub, result_sub){
		if(result_sub.length>0){
			/*var valid_sub = []
			for(var count=0; count<result_sub.length; count++){
				var to = (result_sub[count].valid_to).split('/');
				var toDateObj = new Date(to[2]+'-'+to[1]+'-'+to[0]);
				var currentDateObj = new Date();
				if(toDateObj>currentDateObj && result_sub[count].remain_post > '0'){
					valid_sub.push(result_sub[count]);
				}
			}
			if(valid_sub.length === 0){
				res.json({statusCode: 'F', msg: 'Either Subscription is expired or no Post is left in your account.'});
			}*/
			
			var to = (result_sub[0].valid_to).split('/');
			var toDateObj = new Date(to[2]+'-'+to[1]+'-'+to[0]);
			var currentDateObj = new Date();
			if(toDateObj>currentDateObj && parseInt(result_sub[0].remain_post) > 0){
				//var sell_id = "1";
				Counter.getNextSequenceValue('sell',function(sequence){
					if(sequence){
						var index_count = sequence.sequence_value;
					//1;
				//var command = Sell.find().sort({"sell_id":-1}).limit(1);
				//command.exec(function(err, maxValue) 
				//{	
					//if(maxValue.length && maxValue.length > 0){
					//	sell_id = "SELL_"+(sell_id - (- (maxValue[0].sell_id).substr(5)));
					//	index_count = (sell_id - (- (maxValue[0].sell_id).substr(5)));
					//}
					//else{
					//	sell_id = "SELL_1";
					//}
					var d = new Date();
					var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
					
					var doc = req.body;
					doc.index_count = index_count;
					doc.sell_id = "SELL_"+index_count;//sell_id;
					doc.createdAt = d;
					doc.changedAt = d;
					doc.createdBy = req.payload.user_id;
					doc.changedBy = req.payload.user_id;
					doc.active = "X";
					
					//For testing purpose (to be removed)
					if(doc.testing)
						doc.variant = index_count;
					
					if(doc.net_price && !isNaN(doc.net_price)){
						if(parseFloat(doc.net_price) >= 10000000){//Crore
							var amt = (parseFloat(doc.net_price)/10000000).toFixed(2);
							doc.display_amount = amt + "Cr";
						}
						else if(parseFloat(doc.net_price) >= 100000){//Lakhs
							var amt = (parseFloat(doc.net_price)/100000).toFixed(2);
							doc.display_amount = amt + "L";
						}
						else{//Thousands
							var amt = (parseFloat(doc.net_price)/1000).toFixed(2);
							doc.display_amount = amt + "K";
						}
					}
					
					let newSell = new Sell(doc);
					
					newSell.save((err, result)=>{
						if(err){
							res.json({statusCode: 'F', msg: 'Failed to add', error: err});
						}
						else{
							res.json({statusCode: 'S', msg: 'Entry added', result: result});
							//Deduct Post Remains
							var d = new Date();
							var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
							//var updateSubscription = result_sub[0];
							//updateSubscription.changedAt = at;
							//updateSubscription.remain_post = result_sub[0].remain_post - 1;		
							//console.log(updateSubscription);
							UserSubMap.findOneAndUpdate({_id: result_sub[0]._id},{$set:{changedAt: d}, $inc:{remain_post: -1}},{},(err_subUpdate, result_subUpdate)=>{
								//console.log(err_subUpdate);
							});						
							
							//Trigger Notification
							var entry = doc; entry.transactionType = "Sale";
							ctrlNotification.sendNotification(entry);
						}
					});
				//});
				}
					else{
						res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
					}
				});
			}
			else{
				res.json({statusCode: 'F', msg: 'Either Subscription is expired or no Post is left in your account.'});
			}
		}
		else{
			res.json({statusCode: 'F', msg: 'Subscription unavailable.', error: err_sub});
		}
	});

};
module.exports.updateSell = function(req,res){//Update
	var d = new Date();
	var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	var doc = req.body;
		delete doc.createdAt;
		delete doc.createdBy;
		doc.changedAt = d;
		doc.changedBy = req.payload.user_id;
		
	if(doc.net_price && !isNaN(doc.net_price)){
						if(parseFloat(doc.net_price) >= 10000000){//Crore
							var amt = (parseFloat(doc.net_price)/10000000).toFixed(2);
							doc.display_amount = amt + "Cr";
						}
						else if(parseFloat(doc.net_price) >= 100000){//Lakhs
							var amt = (parseFloat(doc.net_price)/100000).toFixed(2);
							doc.display_amount = amt + "L";
						}
						else{//Thousands
							var amt = (parseFloat(doc.net_price)/1000).toFixed(2);
							doc.display_amount = amt + "K";
						}
	}
		
	Sell.findOneAndUpdate({_id:doc._id},{$set: doc},{},(err, updated)=>{
		if(err){
			res.json({statusCode: 'F', msg: 'Failed to update', error: err});
		}
		else{
			if(doc.active === '-'){
				ChatInbox.update({post_id: doc.sell_id}, {"$set": {post_deletion: true}}, {multi: true}, (updateChat_err, updateChat_res)=>{ });
				Fav.remove({bid_sell_buy_id: doc.sell_id}, function(fav_err,fav_result){ });
			}
			res.json({statusCode: 'S', msg: 'Entry updated', updated: updated});
		}
	});
};
module.exports.deleteSell = function(req,res){//Delete
	Sell.remove({sell_id: req.params.id}, function(post_err,post_result){
		if(post_err){
			res.json({statusCode:"F", msg:"Unable to delete the Post.", error:post_err});
		}
		else{
			ChatInbox.update({post_id: req.params.id}, {"$set": {post_deletion: true}}, {multi: true}, (updateChat_err, updateChat_res)=>{

			});
			Fav.remove({bid_sell_buy_id: req.params.id}, function(fav_err,fav_result){ });
			Thumbnail.remove({transaction_id: req.params.id}, function(thumbnail_err,thumbnail_result){
				if(thumbnail_err){
					res.json({statusCode:"F", msg:"Unable to delete the Thumbnails.", error:thumbnail_err});
				}
				else{
					Image.remove({transaction_id: req.params.id}, function(image_err,image_result){
						if(image_err){
							res.json({statusCode:"F", msg:"Unable to delete the Images.", error:image_err});
						}
						else{
							res.json({
								statusCode:"S", 
								msg:"Successfully deleted the Post.",
								error:null, 
								post:post_result, 
								thumbnail:thumbnail_result, 
								image:image_result
							});
						}
					});
				}
			});
		}
	});
};
