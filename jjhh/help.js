var loadJS = function(url, callback) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = url;
    var done = false;
    script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
            done = true;
            callback();
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };
    head.appendChild(script);
};

/*
  请求地址：home.php 统一使用POST请求

1首页
    无需参数，直接请求即可
2、点击预约/取消预约
    action: apply
    productid: productid
    apply: 1/0 预约/取消预约
3、点击收藏/取消收藏
    action: collection
    productid: productid
    collection: 1/0 收藏/取消收藏
4、发送短信
    action: sendsms
    mobile: mobile
5、提交用户申请
    action: regist
    name: name
    mobile： mobile
    http_referer: http_referer //来源地址
    http_url: http_url  //当前地址
6、等待客服联系我升级
    action: contactupvip
7、VIP升级免费量房
    action: 'measurehouse'
**/
var ajaxStatus = false;
$(function(){

    $.post('/home.php', {}, function(data, textStatus, jqXHR){
        console.log('Post response:');
        var json = JSON.parse(data);
        console.log(json)
    });
    
});

//
$(function(){
    $.post('/home.php', {
        'action': 'apply',
        'productid': '9',
        'apply': 1
    }, function(data, textStatus, jqXHR){
        console.log('Post response:');
        var json = JSON.parse(data);
        console.log(json)
    });
    


    $.post('/home.php', {
        action: 'sendsms'
        mobile: 13817131714
    }, function(data, textStatus, jqXHR){
        console.log('Post response:');
        var json = JSON.parse(data);
        console.log(json)
    });
    



    $.post('/home.php', {
        action: 'sendsms',
        mobile: phoneNum
    }, function(data, textStatus, jqXHR){
        console.log('Post response:');
        var json = JSON.parse(data);
        if( checkError(json) ){
            return json.yzm;
        }
    });

    $.post('/home.php', {
        action: 'news'
    }, function(data, textStatus, jqXHR){
        console.log('Post response:');
        var json = JSON.parse(data);
        // if( checkError(json) ){
            
        // }
    });

    $.post('/home.php', {
        action: 'shownews',
        newsid: 'id'
    }, function(data, textStatus, jqXHR){
        console.log('Post response:');
        var json = JSON.parse(data);
        if( checkError(json) ){
            
        }
    });


    $.post('/home.php', {
        action: 'getUserType'
    }, function(data, textStatus, jqXHR){
        console.log('Post response:');
        var json = JSON.parse(data);
        console.log(json)
        // if( checkError(json) ){
            
        // }
    });
});