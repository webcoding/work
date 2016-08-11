
// 客户端js
// 
// 微信分享代码
var dataForWeixin={
    "appid": "",
    "img_url": "http://m.jjhh.com/jjhh/assets/images/banner.jpg",
    "img_width": "200",
    "img_height": "160",
    "link": "http://m.jjhh.com/jjhh/",
    "desc": "5月29日—31日，上海光大会展中心", 
    "title": "家家户户网——一站式家庭装修服务平台"
    "fakeid":"",
    callback:function(){}
};
(function(){
   var onBridgeReady=function(){
       WeixinJSBridge.on('menu:share:appmessage', function(argv){
          WeixinJSBridge.invoke('sendAppMessage',{
            "appid":dataForWeixin.appId,
            "img_url":dataForWeixin.img_url,
            "img_width":dataForWeixin.img_width,
            "img_height":dataForWeixin.img_height,
            "link":dataForWeixin.link,
            "desc":dataForWeixin.desc,
            "title":dataForWeixin.title
          }, function(res){(dataForWeixin.callback)();});
       });
       WeixinJSBridge.on('menu:share:timeline', function(argv){
          WeixinJSBridge.invoke(‘shareTimeline‘,{
            "img_url":dataForWeixin.TLImg,
            "img_width":dataForWeixin.img_width,
            "img_height":dataForWeixin.img_height,
            "link":dataForWeixin.link,
            "desc":dataForWeixin.desc,
            "title":dataForWeixin.title
          }, function(res){(dataForWeixin.callback)();});
       });
       // WeixinJSBridge.on('menu:share:weibo' function(argv){
       //    WeixinJSBridge.invoke('shareWeibo',{
       //       "content":dataForWeixin.title,
       //       "url":dataForWeixin.link
       //    }, function(res){(dataForWeixin.callback)();});
       // });
       // WeixinJSBridge.on('menu:share:facebook', function(argv){
       //    (dataForWeixin.callback)();
       //    WeixinJSBridge.invoke('shareFB',{
       //      "img_url":dataForWeixin.TLImg,
       //      "img_width":dataForWeixin.img_width,
       //      "img_height":dataForWeixin.img_height,
       //      "link":dataForWeixin.link,
       //      "desc":dataForWeixin.desc,
       //      "title":dataForWeixin.title
       //    }, function(res){});
       // });
    };
    if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    }else{
        onBridgeReady();
    }
})();
//$(function(){
    // document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    //     // 发送给好友
    //     WeixinJSBridge.on('menu:share:appmessage', function (argv) {
    //         WeixinJSBridge.invoke('sendAppMessage', {
    //             "appid": "",
    //             "img_url": "http://m.jjhh.com/jjhh/assets/images/banner.jpg",
    //             "img_width": "200",
    //             "img_height": "160",
    //             "link": "http://m.jjhh.com/jjhh/",
    //             "desc": "5月29日—31日，上海光大会展中心", 
    //             "title": "家家户户网——一站式家庭装修服务平台"
    //         }, function (res) {
    //             //_report('send_msg', res.err_msg);
    //         })
    //     });

    //     // 分享到朋友圈
    //     WeixinJSBridge.on('menu:share:timeline', function (argv) {
    //         WeixinJSBridge.invoke('shareTimeline', {
    //             "img_url": "http://m.jjhh.com/jjhh/assets/images/banner.jpg",
    //             "img_width": "200",
    //             "img_height": "160",
    //             "link": "http://m.jjhh.com/jjhh/",
    //             "desc": "5月29日—31日，上海光大会展中心", 
    //             "title": "家家户户网——一站式家庭装修服务平台"
    //         }, function (res) {
    //             //_report('timeline', res.err_msg);
    //         });
    //     });
    // }, false)
//});
