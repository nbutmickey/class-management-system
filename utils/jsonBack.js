module.exports={
    jsonBack:function(response,status,content,note) {
             response.json({
                    status:status,
                    content:content,
                    note:note
                })
    }
}