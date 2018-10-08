var mongoose = require('mongoose');
var Counter = mongoose.model('Counter');
const Sell = mongoose.model('Sell');
const Buy = mongoose.model('Buy');
const Bid = mongoose.model('Bid');
const Service = mongoose.model('Service');
const Thumbnail = mongoose.model('Thumbnail');

//////////////////////////Chat Inbox////////////////////////////////
Const ChatInbox = mongoose.model('ChatInbox');

module.exports.getChatInbox = function(req,res){//Fetch
	var query = {
	    from_deleted: {"$ne": true},
	    to_deleted: {"$ne": true}
	  };
	if(req.query.from_user){
		query.from_user = {"$eq":req.query.from_user};
	}
 	if(req.query.to_user){
		query.to_user = {"$eq":req.query.to_user};
	}
	if(req.query.chat_id){
		query.chat_id = {"$eq":req.query.chat_id};
	}
	if(req.query.from_deleted){
		query.from_deleted = {"$eq":req.query.from_deleted};
	}
 	if(req.query.to_deleted){
		query.to_deleted = {"$eq":req.query.to_deleted};
	}
	ChatInbox.find(query,function(err, chatInboxs){
	    if(err){
	      res.json({statusCode:"F", results: [], error: err});
	    }
	    else if(chatInboxs.length>0){
		var myInboxs = [];
		var loopCount = 0;
		chatInboxs.forEach(function(item,index,arr){
			var chat =  JSON.parse(JSON.stringify(item));			
			if(chat.post_type === 'Sale'){
				module.exports.getSellForChat(chat,function(data){
					if(data){
					   var obj = Object.assign({}, chat, data);
					   myInboxs.push(obj);
					}
					loopCount = loopCount - (-1);
					if(loopCount === chatInboxs.length){
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
					   res.json({statusCode:"S", results: myInboxs, error: null});
					}
				});
			}
		});
		  
	    }
	    else{
	    	res.json({statusCode:"S", results: chatInboxs, error: null});
	    }
	});
};

module.exports.getSellForChat = function(req,callback){//Get the sell detail for the chat
	Sell.find({sell_id:req.query.post_id},function(err, result){
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
				callback(postDetail);
			});			
		}
		else{
			callback(null);
		}
	});
};

module.exports.getBuyForChat = function(req,callback){//Get the buy detail for the chat
	Buy.find({buy_req_id:req.query.post_id},function(err, result){
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
				callback(postDetail);
			});			
		}
		else{
			callback(null);
		}
	});
};

module.exports.getBidForChat = function(req,callback){//Get the bid detail for the chat
	Bid.find({bid_id:req.query.post_id},function(err, result){
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
				callback(postDetail);
			});			
		}
		else{
			callback(null);
		}
	});
};

module.exports.getServiceForChat = function(req,callback){//Get the service detail for the chat
	Service.find({service_id:req.query.post_id},function(err, result){
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
				callback(postDetail);
			});			
		}
		else{
			callback(null);
		}
	});
};

module.exports.addChatInbox = function(req,res){//Add New Chat Inbox
	var chat_id = "0";
	Counter.getNextSequenceValue('chat',function(sequence){
		if(sequence){
			var index_count = sequence.sequence_value;
			var d = new Date();
			//var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
			let newChatInbox = new ChatInbox({
        index_count: index_count,
				chat_id: chat_id - (-index_count),
        from_user: req.payload.user_id,
        to_user: req.body.to_user,
        post_id: req.body.post_id,
        post_type: req.body.post_type,
				post_deletion: false,
        from_deleted: false,
        to_deleted: false,
				createdBy: req.payload.user_id,
				createdAt: d,
				changedBy: req.payload.user_id,
				changedAt: d
			});
      newChatInbox.save((err, chatInbox)=>{
							if(err){
								res.json({statusCode: 'F', msg: 'Failed to add', error: err});
							}
							else{
								res.json({statusCode: 'S', msg: 'Entry added', results: chatInbox});
							}
			});
     }
     else{
			res.json({statusCode: 'F', msg: 'Unable to generate sequence number.'});
		 }
  });
};

module.exports.updateChatInbox = function(req,res){//Update
    var updateDoc = JSON.parse(JSON.stringify(req.body.doc));
    var d = new Date();
		//var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		updateDoc.changedBy: req.payload.user_id,
		updateDoc.changedAt: d
	
		ChatInbox.update({_id: updateDoc._id}, {"$set": updateDoc}, {multi: true}, (update_err, update_res)=>{
				if(update_err){
					res.json({statusCode: 'F', msg: 'Failed to update', error: update_err});
				}
				else{
				  res.json({statusCode: 'S', msg: 'Entry updated', results: update_res});
				}
		});
};




//////////////////////////Chat Details////////////////////////////////
Const ChatDetail = mongoose.model('ChatDetail');

module.exports.getChatDetail = function(req,res){//Fetch Chat Details
	var query = {
    deleted: {"$ne": true}
  };
	if(req.query.user_id){
		query.user_id = {"$eq":req.query.user_id};
	}
	if(req.query.chat_id){
		query.chat_id = {"$eq":req.query.chat_id};
	}
	if(req.query.deleted){
		query.deleted = {"$eq":req.query.deleted};
	}
 
	ChatDetail.find(query,function(err, ChatDetails){
    if(err){
      res.json({statusCode:"F", results: [], error: err});
    }
    else{
		  res.json({statusCode:"S", results: ChatDetails, error: null});
    }
	});
};

module.exports.addChatDetail = function(req,res){//Add New Chat Detail
		var d = new Date();
		//var at = d.getDate() +"/"+ (d.getMonth() - (-1)) +"/"+ d.getFullYear() ;
		let newChatDetail = new ChatDetail({
				user_id: req.payload.user_id,
				chat_id: req.body.chat_id,
        post_id: req.body.post_id,
        text: req.body.text,
        read: false,
        post_deletion: false,
				deleted: false,
				createdBy: req.payload.user_id,
				createdAt: d,
				changedBy: req.payload.user_id,
				changedAt: d
		});
			
    newChatDetail.save((err, res)=>{
				if(err){
						res.json({statusCode: 'F', msg: 'Failed to add', error: err});
				}
				else{
						res.json({statusCode: 'S', msg: 'Entry added', results: res});
				}
		});
};







