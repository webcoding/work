$(function(){
    var App = App || {};
    var loginCb = null;

    $(".lazy").scrollLoading();
    var HEIGHT = $(window).height();
    var $body = $('body');
    var ajaxStatus = false,dialogIng = false,curUser = {};
    var pageData = {},target,proTab,curIndex,curId,sumNum,tabData,curItem; //页面数据
    var tempDialog,tempMsg,tempToast;
    var template,html;
    var phoneCheck = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17(0|[6-8]))|(18([0-3]|[5-9])))\d{8}$/;

    var browser = (function(){
      var userAgent = window.navigator.userAgent,
      ua = userAgent.toLowerCase(),
      browserList = {
        msie : /(?:msie\s|trident.*rv:)([\w.]+)/i,
        firefox : /Firefox\/([\w.]+)/i,
        chrome : /Chrome\/([\w.]+)/i,
        safari : /version\/([\w.]+).*Safari/i,
        opera : /(?:OPR\/|Opera.+version\/)([\w.]+)/i
      },
      kernels = {
        MSIE: /(compatible;\smsie\s|Trident\/)[\w.]+/i,
        Camino: /Camino/i,
        KHTML: /KHTML/i,
        Presto: /Presto\/[\w.]+/i,
        Gecko : /Gecko\/[\w.]+/i,
        WebKit: /AppleWebKit\/[\w.]+/i
      },
      browser = {
        kernel : 'unknow',
        version : 'unknow'
      }

       // 检测浏览器
      for(var i in browserList){
        var matchs = ua.match(browserList[i]);
        browser[i] = matchs ? true : false;
        if(matchs){
          browser.version = matchs[1];
        }
      }
      // 检测引擎
      for(var i in kernels){
        var matchs = ua.match(kernels[i]);
        if(matchs){
          browser.kernel = matchs[0];
        }
      }
      // 系统
      var os = ua.match(/(Windows\sNT\s|Mac\sOS\sX\s|Android\s|ipad.*\sos\s|iphone\sos\s)([\d._-]+)/i);
      browser.os = os!==null ? os[0] : false;
      // 是否移动端
      browser.mobile = ua.match(/Mobile/i)!==null ? true : false;
      browser.isWeixin = ua.match(/MicroMessenger/i) == 'micromessenger';
      browser.android = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1; //android终端或者uc浏览器
      browser.iPhone = ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1; //是否为iPhone或者QQHD浏览器
      browser.iPad = ua.indexOf('iPad') > -1; //是否iPad
      browser.webApp = ua.indexOf('Safari') == -1;
      return browser;
    }());


    window.browser = browser;
    console.log(browser);

    var winxinPayBtn = browser.isWeixin ? '<div class="btn btn-hollow btn-big btn-pay" data-type="wxpay">微信支付并升级 VIP</div>' : '';
    var alipayBtn = !browser.isWeixin ? '<div class="btn btn-hollow btn-big btn-pay" data-type="alipay">支付宝支付升级 VIP</div>' : '';

    var dialogInfo = {
        // 'explain': {
        //     title: "活动说明",
        //     content: ['<p>专注于为广大装修用户提供一站式装修指导服务的北京家家户户文化有限公司（www.jjhh.com），为上海首屈一指的家装一站式服务管理平台。是以建材、家具、电器等大宗生活消费品为主导，集展览团购、电子商务、行业资讯、设计施工为一体的O2O（线下商务与互联网的结合）模式家庭生活指导性消费平台。</p>',
        //     '<p>花样家博 一起来购！家家户户网5月29日-31日第二届夏季新型家博会，将在光大会展中心如期举行，本次将有众多品牌参与活动，品类涉及橱柜、洁具、木门、地板、设计、施工、地暖、软、木家具等组成，现场还有逛家博无需下单领好礼、联单兑奖、整点抽奖等各种活动，让您省时、省心、省力享受超低价折扣的一站式服务。</p>',
        //     '<p>花最少的钱，装最好的家！扫描二维码：立即加入我们，或咨询：4008 190 180    网址：www.jjhh.com   微信号：家家户户等方式与我们联系，期待您的参与！</p>'].join('')
        // },
        'lottery': {
            wrapClass: 'dialog-lottery',
            title: '下单奖品说明',
            content: [
'<p class="tc"><img src="assets/expo/expo_lottery.jpg" alt="" height="214" /></p>',
'<div class="text">',
'    <b>活动时间：</b>',
'    <p>2015.8.7——8.9</p>',
'</div>',
'<div class="text">',
'    <b>返现奖励：</b>',
'    <p>200-1999元现金任意抽。</p>',
'</div>',
'<div class="text">',
'    <b>返现规则：</b>',
'    <p>凭家博会统一销售订单，建材订单单笔满2500元即可参与100%现金红包抽奖，最低200元红包起。<br>家具订单单笔满4000元即可参与100%现金红包抽奖，最低300元红包起，最高享免单大奖。</p>',
'</div>',
'<div class="text">',
'    <b>活动奖品：</b>',
'    <p>1张订单胶棉拖把；',
'    <br>3张订单电烤箱；',
'    <br>5张订单遥控风扇；',
'    <br>7张订单空气净化器；',
'    <br>9张订单苹果手表。</p>',
'</div>',
'<div class="text">',
'    <b>兑奖规则：</b>',
'    <p>业主只要产生一张订单就可换奖，可累计换取也可以分开换取。',
'    <br>如：业主A有6张订单可以换取6张订单的一个奖品，1张订单的奖品雨5张订单的奖品。最高九张订单。</p>',
'</div>',
'<div class="text">',
'    <b>抢购商品订单不参加本活动。</b>',
'</div>',
].join('')
        },
        'signup': {
            title: '在线报名获取家博会入场券',
            content: [' <form class="wform">',
                    '<span class="form-group"><label class="w_name"><input class="w_input" id="w_name" type="text" placeholder="请输入联系人姓名"></label>',
                    '<label class="w_phone"><input class="w_input" id="w_phone" type="tel" maxlength="11" placeholder="请输入手机号码"></label></span>',
                    '<span class="form-group col-2"><label class="w_code item"><input class="w_input" id="w_code" type="tel" maxlength="6" placeholder="请输入验证码"></label><label class="item btn btn-solid btn-big btn-getcode disabled czx_btn_getcode" id="countdown" data-type="get_phone_code">获取短信验证码</label></span>',
                    '<div class="hr_a"></div>',
                    '<div class="btn btn-hollow btn-big disabled btn-pay btn-submit" id="signup_submit" data-type="signup_submit">立即报名</div>',
                '</form>'
                ].join('')
        },
        'signupNew': {
            title: '手机登录',
            content: [' <form class="wform">',
                    '<span class="form-group"><label class="w_name"><input class="w_input" id="w_name" type="text" placeholder="姓名"></label>',
                    '<label class="w_phone"><input class="w_input" id="w_phone" type="tel" maxlength="11" placeholder="手机号码"></label></span>',
                    '<span class="form-group col-2"><label class="w_code item"><input class="w_input" id="w_code" type="tel" maxlength="6" placeholder="请输入验证码"></label><label class="item btn btn-solid btn-big btn-getcode disabled czx_btn_getcode" id="countdown" data-type="get_phone_code">获取短信验证码</label></span>',
                    '<div class="hr_a"></div>',
                    '<div class="btn btn-hollow btn-big disabled btn-pay btn-submit" id="signup_submit" data-type="signup_submit">登陆</div>',
                '</form>'
                ].join('')
        },
        'validate': {
            title: '验证您的手机<p class="subtitle">抢购秒杀产品需确认您的手机</p>',
            content: [' <form class="wform">',
                    '<span class="form-group"><label class="w_name"><input class="w_input" id="w_name" type="text" placeholder="请输入联系人姓名"></label>',
                    '<label class="w_phone"><input class="w_input" id="w_phone" type="tel" maxlength="11" placeholder="请输入手机号码"></label></span>',
                    '<span class="form-group col-2"><label class="w_code item"><input class="w_input" id="w_code" type="tel" maxlength="6" placeholder="请输入验证码"></label><label class="item btn btn-solid btn-big btn-getcode disabled czx_btn_getcode" id="countdown" data-type="get_phone_code">获取短信验证码</label></span>',
                    '<div class="hr_a"></div>',
                    '<div class="btn btn-hollow btn-big disabled btn-pay btn-submit" id="signup_submit" data-type="signup_submit">立即验证</div>',
                '</form>'
                ].join('')
        },
        'login': {
            title: "手机登录",
            content: ['<form class="wform">',
                    '<span class="form-group"><label class="w_phone"><input class="w_input" id="w_phone" type="tel" maxlength="11" placeholder="请输入报名时的手机号码"></label></span>',
                    '<span class="form-group col-2"><label class="w_code item"><input class="w_input" id="w_code" type="tel" maxlength="6" placeholder="请输入验证码"></label><label class="item btn btn-solid btn-big btn-getcode disabled" id="countdown" data-type="get_phone_code">获取短信验证码</label></span>',
                    '<div class="hr_a"></div>',
                    '<div class="btn btn-hollow btn-big disabled btn-pay btn-submit" id="login_submit" data-type="login_submit">登录</div>',
                '</form>'
                ].join('')
        },
        'mycenter': {
            overbody: true,
            wrapClass: 'dialog-mycenter',
            maskClass: "overlay transparent",
            title: "",
            dialogAuto: true,
            content: ['<ul class="mycenter-list">',
            '<li><a href="myapply.html">我的预约</a></li>',
            '<li><a href="myfav.html">我的收藏</a></li>',
            '<li><a data-type="myticket">我的门票</a></li>',
            '</ul>'].join('')
        },
        'signupNormal': {
            qcode: true,
            wrapClass: 'dialog-email dialog_qcode',
            templateBgBox: ['email-bg1','email-bg2','email-bg3'],
            title: '已报名成功<p class="subtitle">您可获得以下特权</p>',
            content: [
                '<p>1、免费量房验房，出预算，出平面图，再送辅料；<br>2、已有项目专业监理，免费审核报价；<br>3、12条免费大巴专线直达会场。</p>',
                '<div class="line-dashed"></div>',
                '<div class="tc"><span class="qcode_box"><img src="assets/images/loading.png" class="barcode" alt=""></span><p class="code">请凭二维码入场</p></div>'
                ].join('')
        },
        'signupVip': {
            qcode: true,
            wrapClass: 'dialog-email dialog_qcode',
            templateBgBox: ['email-bg1','email-bg2','email-bg3','email-vip'],
            title: 'VIP用户升级成功<p class="subtitle">您还可获得以下特权</p>',
            content: [
                '<p>1、300元现金抵用券，为您省更多；<br>2、VIP门票免费抽Apple Watch、iPad大奖。</p>',
                '<div class="line-dashed"></div>',
                '<div class="tc"><span class="qcode_box"><img src="assets/images/loading.png" class="barcode" alt=""></span><p class="code">请凭二维码入场</p></div>'
                ].join('')
        },
        'xtip': {
            wrapClass: 'dialog-tip',
            title: "",
            content: [
                '<p class="f14">当前手机号码尚未报名家博会，请先进行报名。</p>'
                ].join('')
        },
        'buynow': {
            //wrapClass: '',
            title: "秒杀活动",
            content: [
                '<p class="f14">秒杀活动尚未开始，敬请期待</p>'
                ].join('')
        },
        'upgrade': {
            wrapClass: 'dialog-expo',
            title: "升级VIP",
            content: ['<h4>您只需支付20元，即可升级VIP用户，20元到场即返还。</h4>',
                '<div class="hr_a"></div>',
                winxinPayBtn,
                '<div class="hr_a"></div>',
                '<div class="btn btn-hollow btn-big btn-pay" data-type="service">等待客服联系我升级 VIP</div>'].join('')
        }
    };
    function checkError(data){
        var bool = false;
        switch(data.code){
            case -1:
                console.log('请先报名');
                showMessage('请先报名！',2000)
                break;
            case 1:
                bool = true;
                console.log('ajax请求成功')
                break;
            case 2:
                bool = true;
                console.log('您已注册')
                break;
            case 0:
            default:
                console.log('请求失败了，请重试');
                break;
        }
        return bool;
    };
    function ajaxRequest(url,params,callback,fail){
        var params = $.extend({'timeout': 10},params);
        if(!ajaxStatus){
            ajaxStatus = true;
            $.post(url || './home.php', params || {}, function(data, textStatus){
                ajaxStatus = false;
                if(textStatus != 'success'){
                    fail && fail();
                    return;
                }
                var data = JSON.parse(data);
                if( checkError(data) ){
                    callback && callback(data);
                }else{
                    fail && fail();
                }
            });
        }else{
            console.log('正在请求中...');
        }
    };
    function countDown(obj,allTime){
        var times = 1000;
        obj.box[0].innerHTML = parseInt(allTime*0.001) + '秒';
        setTimeout(function(){
            allTime-=times;
            if(allTime>0){
                countDown(obj,allTime);
            }else {
                obj.end();
            }
        },times);
    };
    function countFnc(obj){
        var allTime = obj.time || 60000;
        obj.start();
        countDown(obj,allTime);
    };

    var loginType = 'signup';

    App = $.extend(App,{
        init: function(){
            var self = this;
            this.btnsHci();

            //ajax获取当前用户状态，以此确定当前用户的按钮响应

            if(pageData.type === undefined) pageData.type = -1;
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {

                }, function(data, textStatus, jqXHR){
                    tempToast && tempToast.close();
                    ajaxStatus = false;
                    //请求数据后，填充页面
                    pageData = JSON.parse(data);
                    console.log(pageData)
                    if(pageData.type === undefined) {
                        pageData.type = -1;
                    }else{
                        pageData.type = parseInt(pageData.type,10);
                    }
                    self.updateUserStatus();
                    
                    // if(pageData.code ==){//已注册
                    //     // if(pageData.type == 0){
                    //     //     self.showDialog(dialogInfo.signupNormal);
                    //     // }else if(pageData.type == 1){
                    //     //     self.showDialog(dialogInfo.signupVip);
                    //     // };
                    // }
                });
            }
        },
        updateUserStatus: function(){
            var signupBtn = $('.expo-signup'),
                upgradeBtn = $('.expo-vip');

            //注意：这里要求type必须是string类型
            switch(pageData.type){ //-1普通 0注册会员 1付费会员
                case 0:
                    signupBtn.attr('data-type','signupNormal');
                    upgradeBtn.attr('data-type','upgrade');
                    break;
                case 1:
                    signupBtn.attr('data-type','signupVip');
                    upgradeBtn.attr('data-type','signupVip');
                    break;
                case -1:
                default:
                    signupBtn.attr('data-type', 'signup');
                    upgradeBtn.attr('data-type', 'upgrade');
            };
            this.btnsHci();
        },
        btnsHci: function(){
            var self = this;
            $('*[data-type]').unbind();
            $('#w_phone,#w_code').unbind();
            $('ul.ex_list>li.item').unbind();
            
            $('#w_phone').bind('input',function(e){
                var target = $(e.currentTarget);
                var phone = target.val().trim();
                var countdownBtn = $('#countdown');
                if( phoneCheck.test(phone) ){
                    countdownBtn.removeClass('disabled');
                }else{
                    countdownBtn.addClass('disabled');
                }
            });
            $('#w_code').bind('input',function(e){
                var target = $(e.currentTarget);
                var code = target.val().trim();
                var submitBtn = $('.btn-submit');
                if( /\d{6}/.test(code) ){
                    submitBtn.removeClass('disabled');
                }else{
                    submitBtn.addClass('disabled');
                }
            });
            $('ul.ex_list>li.item').bind('click',function(e){
                if(pageData.type === -1){
                    //showMessage('请先验证您的手机号码',2500,function(){
                        loginType = 'signup';
                        self.showDialog(dialogInfo.validate);
                    //});
                }else{
                    showToast('秒杀活动尚未开始，敬请期待！')
                }
            })
            // $el.body.delegate('*[data-type]','click',function(e){
            $('*[data-type]').bind('click',function(e){
                var target = $(e.currentTarget),
                    type = target.data('type');

                switch(type){
                    case 'explain'://活动说明
                        self.showDialog(dialogInfo.explain);
                        break;
                    case 'lottery'://下单奖品说明
                        self.showDialog(dialogInfo.lottery);
                        break;
                    case 'signup':
                        loginType = 'signup';
                        if(pageData.type !== undefined && pageData.type !== -1){
                            showMessage('您已经报名',3500,function(){
                                if(pageData.type === 0){
                                    self.showDialog(dialogInfo.signupNormal);
                                }else{
                                    self.showDialog(dialogInfo.signupVip);
                                }
                            });
                        }else{
                            self.showDialog(dialogInfo.signup);
                        }
                        //self.showDialog(dialogInfo.signup);
                        break;
                    case 'get_phone_code':
                        self.getPhoneCode(target);
                        break;
                    case 'signup_submit':
                        self.signupSubmit();
                        break;
                    case 'login_submit':
                        self.loginSubmit();
                        break;
                    case 'barcode':
                        self.showDialog(dialogInfo.barcode);
                        break;
                    case 'myticket':
                        hideDialog();
                        if(pageData.type === -1){
                            //showMessage('请先报名普通用户，成功后再升级为VIP用户',3500,function(){
                                loginType = 'signup';
                                self.showDialog(dialogInfo.signup);
                            //});
                        }else{
                            if(pageData.type === 2){
                                self.showDialog(dialogInfo.signupVip);
                            }else{
                                self.showDialog(dialogInfo.signupNormal);
                            }
                        }
                        break;
                    case 'upgrade':
                        if(pageData.type === -1){
                            //showMessage('请先报名普通用户，成功后再升级为VIP用户',3500,function(){
                                loginType = 'signup';
                                self.showDialog(dialogInfo.signup);
                            //});
                        }else{
                            if(pageData.type === 2){
                                showMessage('您已经是VIP用户',3500,function(){
                                    self.showDialog(dialogInfo.signupVip);
                                });
                            }else{
                                self.showDialog(dialogInfo.upgrade);
                            }
                        }
                        break;
                    case 'signupNormal':
                        self.showDialog(dialogInfo.signupNormal);
                        break;
                    case 'signupVip':
                        self.showDialog(dialogInfo.signupVip);
                        break;
                    case 'wxpay':
                        console.log('微信支付');
                        if(!/sh\.jjhh\.com/.test(location.hostname)){
                            location.href="./app/wxpay/payment.php"
                        }else{
                            location.href="http://m.jjhh.com/jjhh/app/wxpay/payment.php"
                        }
                        break;
                    case 'alipay':
                        console.log('支付宝支付');
                        location.href="./app/alipay/payment.php"
                        break;
                    case 'buynow':
                    case 'prolist':
                        if(pageData.type === -1){
                            //showMessage('请先验证您的手机号码',2500,function(){
                                loginType = 'signup';
                                self.showDialog(dialogInfo.validate);
                            //});
                        }else{
                            showToast('秒杀活动尚未开始，敬请期待！')
                        }
                        //self.showDialog(dialogInfo.buynow);
                        break;
                    case 'mycenter':
                        self.myCenter();
                        //self.showDialog(dialogInfo.buynow);
                        break;
                    case 'service':
                        console.log('等待客服联系我升级');
                        ajaxRequest('./home.php',{
                            action: 'contactupvip'
                        },function(data){
                            console.log(data);
                            hideDialog();
                            showMessage('提交成功', 2500);
                        });
                        break;
                    case 'tips_info'://申请免费量房
                        self.applyFree();
                        break;
                    default:
                        return;
                }
                
            });
        },
        login: function(cb){
            loginType = 'signup';
            this.showDialog(dialogInfo.signupNew);
            loginCb = cb || null;
        },
        dialogCustom: function(cb,obj){
            pageData.type = parseInt(obj.userType);
            if(obj.loginType){
                loginType = obj.loginType;
            }
            this.showDialog(dialogInfo[obj.dialogType]);
            loginCb = cb || null;
        },
        setQcode: function(){
            var self = this;
            var host = location.origin;
            var hostname = location.hostname;
            var path = '';
            if(/m\.jjhh\.com/.test(hostname)){
                path = '/jjhh';
            }
            if(/sh\.jjhh\.com/.test(hostname)){
                path = '/wap';
            }
            var qcode_box = $('.dialog_qcode').find('.qcode_box');
            if(qcode_box.length){
                var qcode = host + path + '/qrcode.php?mobile=';
                var mobile;
                if(pageData.type != '-1'){
                    mobile = pageData.mobile;
                }else{
                    return;
                }
                var qcode_text = qcode + mobile;
                console.log(qcode_text);
                if(mobile){
                    qcode_box.qrcode({
                        text: qcode_text,
                        width: 120,
                        height: 120,
                        background: '#eee',
                    });
                }
            }else{
                setTimeout(function(){
                    self.setQcode();
                },500);
            }
        },
        myCenter: function(){
            var self = this;
            //首先检查是否登录,否则登录框，已登录则显示个人中心
            if(pageData.type === undefined || pageData.type == '-1'){
                loginType = 'login';
                self.showDialog(dialogInfo.login);
            }else{
                self.showDialog(dialogInfo.mycenter);
            }
        },
        checkForm: function(bool){
            var type = loginType === 'login' ? true : false;
            var $name = $('#w_name'),
                $phone = $('#w_phone'),
                $code = $('#w_code');
                $submit = $('#login_submit');
            var name,
                phone = $phone.val().trim(),
                code = $code.val().trim();
            if(!type){
                name = $name.val().trim();
                $submit = $('#signup_submit');
            }
                
            if(!name && !type){
                showMessage('请输入用户名',1000,function(){
                    $name.focus();
                })
                $submit.addClass('disabled');
                return;
            }
            if(!phone){
                showMessage('请输入有效的手机号',1000,function(){
                    $phone.focus();
                })
                $submit.addClass('disabled');
                return;
            }else{
                if( !phoneCheck.test(phone) ){
                    showMessage('请输入有效的手机号',1000,function(){
                        $phone.focus();
                    })
                    $submit.addClass('disabled');
                    return;
                }
            }

            //$submit.removeClass('disabled');

            if(bool){
                if(!code){
                    showMessage('请输入手机验证码',1000,function(){
                        $code.focus();
                    })
                    //$submit.addClass('disabled');
                    return;
                }
            }

            var result = {
                phoneNum: phone,
                code: code
            };

            if(!type){
                result.name = name;
            }

            return result;
        },
        getPhoneCode: function(target){
            var self = this;
            var form = this.checkForm();
            
            if( form ){
                countFnc({
                    time: 60000,
                    box: target,
                    start: function(){
                        target.unbind();
                    },
                    end: $.proxy(function(){
                        target.html('获取验证码');
                        target.bind('click', function(e){
                            self.getPhoneCode(target);
                        });
                    })
                })
                ajaxRequest('./home.php',{
                    action: 'sendsms',
                    mobile: form.phoneNum
                },function(data){
                    console.log('获取验证码成功！');
                    $('#signup_submit').removeClass('disabled');
                });
            }
        },
        loginSubmit: function(){
            var self = this;
            if( $(this).hasClass('disabled') ){
                return;
            }
            var form = this.checkForm(true);
            if( form ){
                ajaxRequest('./home.php',{
                    action: 'login',
                    mobile: form.phoneNum,
                    code: form.code
                },function(data){
                    hideDialog();
                    console.log('登录成功');
                    if(data.type === undefined) {
                        data.type = -1;
                    }
                    pageData.type = parseInt(data.type,10);
                    pageData.mobile = data.mobile;
                    self.updateUserStatus();
                    showMessage('登录成功',1000,function(){
                        if(data.code == 2){
                            self.showDialog(dialogInfo.mycenter);
                        }else{
                            loginType = 'signup';
                            self.showDialog(dialogInfo.signup);
                        }
                    });
                },function(){
                    showMessage('验证码错误！');
                });
            }
        },
        signupSubmit: function(){
            var self = this;
            var http_url = location.href;

            pageParam = window.name || localStorage.getItem('pageParam') || '';

            if(pageParam){
                http_url = location.origin + location.pathname + pageParam;
            }
            var http_referer = document.referrer;
            if( $(this).hasClass('disabled') ){
                return;
            }

            var form = this.checkForm(true);
            if( form ){
                var loadingBox = '<p style="height:100px;padding-top:50px; text-align:center;"><img src="assets/images/loading.gif" alt="" /></p>';
                $('#signup_box').html(loadingBox);
                var client = 0;
                if(browser.mobile){
                    client = 1;
                }
                if(browser.isWeixin){
                    client = 2;
                };

                ajaxRequest('./home.php',{
                    action: 'regist',
                    name: form.name,
                    mobile: form.phoneNum,
                    code: form.code,
                    client: client,
                    http_referer: http_referer, //来源地址
                    http_url: http_url  //当前地址
                },function(data){
                    hideDialog();
                    console.log(data);
                    if(data.type === undefined) {
                        data.type = -1;
                    }
                    pageData.type = parseInt(data.type,10);

                    pageData.mobile = data.mobile;
                    self.updateUserStatus();

                    if(loginCb){
                        loginCb(pageData.type);
                        return;
                    };
                    if(data.code == 2){
                        data.type = pageData.type;
                        if(data.type == 0){
                            //showMessage('您已经是普通用户，正在更新您的数据！',3500, function(){
                                self.showDialog(dialogInfo.signupNormal);
                            //});
                        }else if(data.type == 1){
                            //showMessage('您已经是VIP，正在更新您的数据！',3500, function(){
                                self.showDialog(dialogInfo.signupVip);
                            //});
                        };
                    }else{
                        self.showDialog(dialogInfo.signupNormal);
                        // showMessage('普通用户报名成功！快看看升级VIP用户还有什么特权吧！',3500,function(){
                        //     pageData.type = 0;
                        //     self.renderSignupHtml(pageData,0);
                        //     self.btnsHci();
                        // });
                    }
                    
                },function(){
                    showMessage('验证码错误！');
                });
            }
        },
        showDialog: function(obj){
            var self = this;
            obj = _.extend(obj,{mask:true})
            //hideDialog();
            // if(!dialogIng){
            //     dialogIng = true;
            //     setTimeout(function(){
            //         dialogIng = false;
            tempDialog = pandora.dialog(obj);
            self.btnsHci();
            var overlay = $('.overlay');
            if(obj.qcode){
                self.setQcode();
            }
            if(obj.overbody){
                $body.addClass('overbody');
                overlay.addClass('transparent')
            }else{
                overlay.removeClass('transparent')
            }
            overlay.unbind().bind('click',function(){
                tempDialog.close();
            });

            //cb && cb();
            //     },100);
            // };
            return tempDialog;
        }
    });
    
    function hideDialog(){
        tempDialog.close();
    }
    function showMessage(msg,time,callback){
        var time = time || 2000;
        if(!tempMsg){
            tempMsg = pandora.msg(msg || '操作提醒', time);
            setTimeout(function(){
                tempMsg = null;
                callback && callback();
            },time);
            return tempMsg;
        }
    };
    function showToast(msg,time,callback){
        if(!tempToast){
            var time = time || 2000;
            tempToast = pandora.msg(msg || '正在处理中...', time );
            setTimeout(function(){
                tempToast = null;
                callback && callback();
            },time);
            return tempToast;
        }
    };
    App.ajaxRequest = ajaxRequest;
    App.checkError = checkError;
    App.showToast = showToast;

    App.init();

    var getQuery = function(query, url, urlfix) {
        var url = url || location.search;
        var param = "";
        var paramStart = url.indexOf(query + "=");
        if (paramStart < 0) {
           return param;
        }else{
            paramStart += query.length + 1;
            urlfix = urlfix || "&";
            var paramEnd = url.substr(paramStart).indexOf(urlfix);
            if (paramEnd > 0) {
                param = url.substring(paramStart, paramStart + paramEnd);
            }else{
                param = url.substr(paramStart);
            }
        }
        return decodeURIComponent(param);
    }

    var searchParam = window.location.search;

    var param_id = getQuery('id'),
        param_pop = getQuery('pop'),
        param_ch = getQuery('ch');
    var pageParam = '';
    if(param_pop || param_ch){
        pageParam = '?pop='+param_pop+'&ch='+param_ch;
        if(param_id){
            pageParam = '?id='+param_id+'&pop='+param_pop+'&ch='+param_ch;
        }
    }
    var localStorage = window.localStorage;
    if(pageParam){
        if(localStorage){
            localStorage.setItem("pageParam",pageParam);
        }else{
            window.name = pageParam;
        }
    }
    window.App = App;
});