var mongoose = require('mongoose');
var Counter = mongoose.model('Counter');
const Sell = mongoose.model('Sell');
const Buy = mongoose.model('Buy');
const Bid = mongoose.model('Bid');
const Service = mongoose.model('Service');
const Thumbnail = mongoose.model('Thumbnail');

//////////////////////////Chat Inbox////////////////////////////////
const ChatInbox = mongoose.model('ChatInbox');

module.exports.getChatInbox = function(req,res){//Fetch
	var query = {};
	var and_query = [
		{from_deleted: {"$ne": true}},
		{to_deleted: {"$ne": true}}
	];	
	if(req.query.chat_id){
		and_query.push({chat_id: {"$eq":req.query.chat_id}});
	}
	if(req.query.post_id){
		and_query.push({post_id: {"$eq":req.query.post_id}});
	}
	if(req.query.from_deleted){
		and_query.push({from_deleted: {"$eq":req.query.from_deleted}});
	}
 	if(req.query.to_deleted){
		and_query.push({to_deleted: {"$eq":req.query.to_deleted}});
	}
	
	var or_query = [];
	if(req.query.from_user){
		or_query.push({from_user: {"$eq":req.query.from_user}});
	}
 	if(req.query.to_user){
		or_query.push({to_user: {"$eq":req.query.to_user}});
	}
	
	query['$and'] = and_query;
	if(or_query.length>0)
	   query['$or'] = or_query;
	ChatInbox.find(query,function(err, chatInboxs){
	    if(err){
	      res.json({statusCode:"F", results: [], error: err});
	    }
	    else if(chatInboxs.length>0){
		var myInboxs = [];
		var loopCount = 0;
		chatInboxs.forEach(function(item,index,arr){
			var chat =  JSON.parse(JSON.stringify(item));
			chat.createdAt = item.createdAt;
			chat.changedAt = item.changedAt;
			if(chat.post_type === 'Sale'){
				module.exports.getSellForChat(chat,function(data){
					if(data){
					   var obj = Object.assign({}, chat, data);
					   myInboxs.push(obj);
					}
					loopCount = loopCount - (-1);
					if(loopCount === chatInboxs.length){
						myInboxs.sort(function(a, b){
							if (a.changedAt < b.changedAt)
								return 1;
							else if ( a.changedAt > b.changedAt)
								return -1;
							return 0;
						});//descending sort
						res.json({statusCode:"S", results: myInboxs, error: null});
					}
				});
			}
			else if(chat.post_type === 'Buy'){
				module.exports.getBuyForChat(chat,function(data){
					if(data){
					   var obj = Object.assign({}, chat, data);
					   myInboxs.push(obj);
					}
					loopCount = loopCount - (-1);
					if(loopCount === chatInboxs.length){
						myInboxs.sort(function(a, b){
							if (a.changedAt < b.changedAt)
								return 1;
							else if ( a.changedAt > b.changedAt)
								return -1;
							return 0;
						});//descending sort
						res.json({statusCode:"S", results: myInboxs, error: null});
					}
				});
			}
			else if(chat.post_type === 'Bid'){
				module.exports.getBidForChat(chat,function(data){
					if(data){
					   var obj = Object.assign({}, chat, data);
					   myInboxs.push(obj);
					}
					loopCount = loopCount - (-1);
					if(loopCount === chatInboxs.length){
						myInboxs.sort(function(a, b){
							if (a.changedAt < b.changedAt)
								return 1;
							else if ( a.changedAt > b.changedAt)
								return -1;
							return 0;
						});//descending sort
						res.json({statusCode:"S", results: myInboxs, error: null});
					}
				});
			}
			else if(chat.post_type === 'Service'){
				module.exports.getServiceForChat(chat,function(data){
					if(data){
					   var obj = Object.assign({}, chat, data);
					   myInboxs.push(obj);
					}
					loopCount = loopCount - (-1);
					if(loopCount === chatInboxs.length){
						myInboxs.sort(function(a, b){
							if (a.changedAt < b.changedAt)
								return 1;
							else if ( a.changedAt > b.changedAt)
								return -1;
							return 0;
						});//descending sort
						res.json({statusCode:"S", results: myInboxs, error: null});
					}
				});
			}
			else{
				myInboxs.push(chat);
				loopCount = loopCount - (-1);
				if(loopCount === chatInboxs.length){
						myInboxs.sort(function(a, b){
							if (a.changedAt < b.changedAt)
								return 1;
							else if ( a.changedAt > b.changedAt)
								return -1;
							return 0;
						});//descending sort
						res.json({statusCode:"S", results: myInboxs, error: null});
				}
			}
		});
		  
	    }
	    else{
	    	res.json({statusCode:"S", results: chatInboxs, error: null});
	    }
	});
};

module.exports.getSellForChat = function(req,callback){//Get the sell detail for the chat
	Sell.find({sell_id:req.post_id},function(err, result){
		if(err){
			callback(null);
		}
		else if(result.length > 0){
			Thumbnail.find({transaction_id:req.post_id},function(thumbnail_err, thumbnail){
				var postDetail =  JSON.parse(JSON.stringify(result[0]));
				if(!thumbnail_err && thumbnail.length>0){
					postDetail.thumbnail = thumbnail[0];
					for(var i = 0; i<thumbnail.length; i++){
						if(thumbnail[i].default){
							postDetail.thumbnail = thumbnail[i];
							break;
						}
					}
				}
				delete postDetail.createdAt;
				delete postDetail.changedAt;
				callback(postDetail);
			});			
		}
		else{
			callback(null);
		}
	});
};

module.exports.getBuyForChat = function(req,callback){//Get the buy detail for the chat
	Buy.find({buy_req_id:req.post_id},function(err, result){
		if(err){
			callback(null);
		}
		else if(result.length > 0){
			Thumbnail.find({transaction_id:req.post_id},function(thumbnail_err, thumbnail){
				var postDetail =  JSON.parse(JSON.stringify(result[0]));
				if(!thumbnail_err && thumbnail.length>0){
					postDetail.thumbnail = thumbnail[0];
					for(var i = 0; i<thumbnail.length; i++){
						if(thumbnail[i].default){
							postDetail.thumbnail = thumbnail[i];
							break;
						}
					}
				}
				delete postDetail.createdAt;
				delete postDetail.changedAt;
				callback(postDetail);
			});			
		}
		else{
			callback(null);
		}
	});
};

module.exports.getBidForChat = function(req,callback){//Get the bid detail for the chat
	Bid.find({bid_id:req.post_id},function(err, result){
		if(err){
			callback(null);
		}
		else if(result.length > 0){
			Thumbnail.find({transaction_id:req.post_id},function(thumbnail_err, thumbnail){
				var postDetail =  JSON.parse(JSON.stringify(result[0]));
				if(!thumbnail_err && thumbnail.length>0){
					postDetail.thumbnail = thumbnail[0];
					for(var i = 0; i<thumbnail.length; i++){
						if(thumbnail[i].default){
							postDetail.thumbnail = thumbnail[i];
							break;
						}
					}
				}
				delete postDetail.createdAt;
				delete postDetail.changedAt;
				callback(postDetail);
			});			
		}
		else{
			callback(null);
		}
	});
};

module.exports.getServiceForChat = function(req,callback){//Get the service detail for the chat
	Service.find({service_id:req.post_id},function(err, result){
		if(err){
			callback(null);
		}
		else if(result.length > 0){
			Thumbnail.find({transaction_id:req.post_id},function(thumbnail_err, thumbnail){
				var postDetail =  JSON.parse(JSON.stringify(result[0]));
				if(!thumbnail_err && thumbnail.length>0){
					postDetail.thumbnail = thumbnail[0];
					for(var i = 0; i<thumbnail.length; i++){
						if(thumbnail[i].default){
							postDetail.thumbnail = thumbnail[i];
							break;
						}
					}
				}
				delete postDetail.createdAt;
				delete postDetail.changedAt;
				callback(postDetail);
			});			
		}
		else{
			callback(null);
		}
	});
};

module.exports.addChatInbox = function(req,callback){//Add New Chat Inbox
	var chat_id = "0";
	Counter.getNextSequenceValue('chat',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			//var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newChatInbox = new ChatInbox({
       	 			index_count: index_count,
				chat_id: "CHAT_"+(chat_id - (-index_count)),
       	 			from_user: req.payload.user_id,
        			to_user: req.body.to_user,
				from_user_name: req.body.from_user_name,
        			to_user_name: req.body.to_user_name,
        			post_id: req.body.post_id,
        			post_type: req.body.post_type,
				post_deletion: false,
        			from_deleted: false,
        			to_deleted: false,
				from_read: true,
        			to_read: false,
				from_unread_count: 0,
				to_unread_count: 1,
				createdBy: req.payload.user_id,
				createdAt: d,
				changedBy: req.payload.user_id,
				changedAt: d
			});
      			newChatInbox.save((chatInbox_err, chatInbox_res)=>{
				if(chatInbox_err){
					callback(null);
				}
				else{
					callback(chatInbox_res);
				}
			});
    		}
     		else{
			callback(null); //res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		}
  });
};

module.exports.updateChatInbox = function(req,callback){//Update chat inbox
	var updateDoc = JSON.parse(JSON.stringify(req.body));
    	var d = new Date();
	delete updateDoc.from_user;
	delete updateDoc.to_user;
	delete updateDoc.from_user_name;
	delete updateDoc.to_user_name;
	delete updateDoc.from_unread_count;
	delete updateDoc.to_unread_count;
	//var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
	updateDoc.changedBy = req.payload.user_id;
	updateDoc.changedAt = d;
	
	var increment = {};
	if(req.payload.user_id === req.body.from_user){
		increment = {'to_unread_count': 1};
		updateDoc.to_read = false;
	}
	else{
		increment = {'from_unread_count': 1};
		updateDoc.from_read = false;
	}
	
	ChatInbox.update({chat_id: updateDoc.chat_id}, {"$set": updateDoc, "$inc": increment}, {multi: true}, (update_err, update_res)=>{
		if(update_err){
			callback(null);//res.json({statusCode: 'F', msg: 'Failed to update', error: update_err});
		}
		else{
			callback(update_res);//res.json({statusCode: 'S', msg: 'Entry updated', results: update_res});
		}
	});
};




//////////////////////////Chat Details////////////////////////////////
const ChatDetail = mongoose.model('ChatDetail');

module.exports.getChatDetail = function(req,res){//Fetch Chat Details
	var query = {
	    deleted: {"$ne": true}
	};
	if(req.query.from_user){
		query.from_user = {"$eq":req.query.from_user};
	}
	if(req.query.chat_id){
		query.chat_id = {"$eq":req.query.chat_id};
	}
	if(req.query.deleted){
		query.deleted = {"$eq":req.query.deleted};
	}
 
	ChatDetail.find(query,function(err, chatDetails){
	    if(err){
	    	res.json({statusCode:"F", results: [], error: err});
	    }
	    else{
		module.exports.updateChatDetail(req,chatDetails,function(data){});
		chatDetails.sort(function(a, b){
			if (a.changedAt < b.changedAt)
				return -1;
			else if ( a.changedAt > b.changedAt)
				return 1;
			return 0;
		});//ascending sort
		res.json({statusCode:"S", results: chatDetails, error: null});
	    }
	});
};

module.exports.addChatDetail = function(req,res){//Add New Chat Detail
	if(req.body.chat_id){//Continue in same chat
	   module.exports.updateChatInbox(req,function(data){
		   if(data){
			var d = new Date();
			//var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newChatDetail = new ChatDetail({
					from_user: req.payload.user_id,
					to_user: req.body.to_user,
					from_user_name: req.body.from_user_name,
        				to_user_name: req.body.to_user_name,
					chat_id: req.body.chat_id,
					post_id: req.body.post_id,
					text: req.body.text,
					from_read: true,
					to_read: false,
					post_deletion: false,
					deleted: false,
					createdBy: req.payload.user_id,
					createdAt: d,
					changedBy: req.payload.user_id,
					changedAt: d
			});

			newChatDetail.save((chatdetail_err, chatdetail_res)=>{
					if(chatdetail_err){
						res.json({statusCode: 'F', msg: 'Failed to send', error: chatdetail_err});
					}
					else{
						res.json({statusCode: 'S', msg: 'Sent Successfully.', results: chatdetail_res});
					}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Failed to send', error: null});    
		}
	   });
	}
	else{//Create new chat
	  module.exports.addChatInbox(req,function(data){
		if(data){
			var d = new Date();
			//var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newChatDetail = new ChatDetail({
					from_user: req.payload.user_id,
					to_user: req.body.to_user,
					from_user_name: req.body.from_user_name,
        				to_user_name: req.body.to_user_name,
					chat_id: data.chat_id,
					post_id: req.body.post_id,
					text: req.body.text,
					from_read: true,
					to_read: false,
					post_deletion: false,
					deleted: false,
					createdBy: req.payload.user_id,
					createdAt: d,
					changedBy: req.payload.user_id,
					changedAt: d
			});

			newChatDetail.save((chatdetail_err, chatdetail_res)=>{
					if(chatdetail_err){
						res.json({statusCode: 'F', msg: 'Failed to send', error: chatdetail_err});
					}
					else{
						res.json({statusCode: 'S', msg: 'Sent Successfully.', results: chatdetail_res});
					}
			});
		}
		else{
			res.json({statusCode: 'F', msg: 'Failed to send', error: null});    
		}
	});
	}
};

module.exports.updateChatDetail = function(req,chatDetails,callback){//Update Chat Detail
	if(chatDetails && chatDetails.length > 0){
		var updateDoc = {};
		var d = new Date();
		updateDoc.changedBy = req.payload.user_id;
		updateDoc.changedAt = d;	
		updateDoc.to_read = true;

		ChatDetail.update({chat_id: chatDetails[0].chat_id, to_user: req.payload.user_id}, {"$set": updateDoc}, {multi: true}, (updateChatDetail_err, updateChatDetail_res)=>{
			if(updateChatDetail_err){
				callback(null);
			}
			else{
				var to_updateChatInboxDoc = {};
				var d = new Date();
				to_updateChatInboxDoc.changedBy = req.payload.user_id;
				to_updateChatInboxDoc.changedAt = d;	
				to_updateChatInboxDoc.to_read = true;
				to_updateChatInboxDoc.to_unread_count = 0;				  
				ChatInbox.update({chat_id: chatDetails[0].chat_id, to_user: req.payload.user_id}, {"$set": to_updateChatInboxDoc}, {multi: true}, (updateChatInbox_err, updateChatInbox_res)=>{
					var from_updateChatInboxDoc = {};
					var d = new Date();
					from_updateChatInboxDoc.changedBy = req.payload.user_id;
					from_updateChatInboxDoc.changedAt = d;
					from_updateChatInboxDoc.from_read = true;
					from_updateChatInboxDoc.from_unread_count = 0;
					ChatInbox.update({chat_id: chatDetails[0].chat_id, from_user: req.payload.user_id}, {"$set": from_updateChatInboxDoc}, {multi: true}, (updateChatInbox_err, updateChatInbox_res)=>{
						callback(updateChatDetail_res);
					});
				});
			}
		});
	}
	else{
		callback(null);
	}
};






