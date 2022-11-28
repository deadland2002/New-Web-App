module.exports = {
    testdata: function testdata(){
        var arr = {
            "Backend":{
                "id01":[false,1212,"Content 1"],
                "id02":[false,10,"Content 2"],
                "id03":[false,143,"Content 3"],
                "id04":[false,54,"Content 4"],
                "id05":[false,65,"Content 5"],
                "id06":[false,187,"Content 6"],
                "id07":[false,134,"Content 7"],
            },
            "Frontend":{
                "id01":[false,154,"Content 1"],
                "id02":[false,123,"Content 2"],
                "id03":[false,12,"Content 3"],
                "id04":[false,1867,"Content 4"],
                "id05":[false,123,"Content 5"],
                "id06":[false,5213,"Content 6"],
                "id07":[false,132,"Content 7"],
            },
            "Full Stack":{
                "id01":[false,15,"Content 1"],
                "id02":[false,13,"Content 2"],
                "id03":[false,121,"Content 3"],
                "id04":[false,187,"Content 4"]
            },
        };
        return arr;
    },
    ValidateData: function validate(userdata , posts){
        for (var i in userdata){
            if (i in posts){
                for (var j in userdata[i]){
                    var id = userdata[i][j];
                    if( id in posts[i])
                        posts[i][id][0] = true;
                }
            }
        }
        return posts;
    },
    PushUserData: function(userdata , category , id){
        if (category in userdata){
            userdata[category].push(id);
        }
        else{
            userdata[category] = [id];
        }
        return userdata;
    },
    PushPostData: function(posts ,  category , id , coin , content , title , buys){
        var temp = [false,coin,content,title,buys,id,category];

        if (category in posts){
            posts[category][id] = temp;
        }
        else{
            posts[category] = {};
            posts[category][id] = temp;
        }
        
        return posts;
    },
    PushRequest : function(posts ,  category , id , coin , content , title , email){
        var temp = [false,coin,content,title,email];

        if (category in posts){
            posts[category][id] = temp;
        }
        else{
            posts[category] = {};
            posts[category][id] = temp;
        }
        
        return posts;
    },
}