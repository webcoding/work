
// 客户端js

$(function(){

    // Zepto.post('./home.php', {}, function(data, textStatus, jqXHR){
    //     console.log('Post response:');
    //     var data = JSON.parse(data);
    //     console.log(data)
    // });
    var HEIGHT = $(window).height();
    var ajaxStatus = false;
    var pageData,target,proTab,curIndex,curId,sumNum,tabData,curItem; //页面数据
    var tempDialog,tempMsg,tempToast;
    var template,html;
    var phoneCheck = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17(0|[6-8]))|(18([0-3]|[5-9])))\d{8}$/;

    function getScrollTop(){
        var scrollTop=0;
        if(document.documentElement&&document.documentElement.scrollTop){
            scrollTop=document.documentElement.scrollTop;
        }else if(document.body){
            scrollTop=document.body.scrollTop;
        }
        return scrollTop;
    };

    /**
     * check browser version
     * @authors K
     * @date    2014-04-11 14:48:39
     * @version 1
     */
    /**
     * detect browser info with navigator userAgent
     * @return object browser info
     */
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

    console.log(browser);

    var winxinPayBtn = browser.isWeixin ? '<div class="btn btn-hollow btn-big" data-type="weinxin_pay">微信支付并升级 VIP</div>' : '';

    var dialogInfo = {
        'explain': {
            title: "活动说明",
            content: ['<p>专注于为广大装修用户提供一站式装修指导服务的北京家家户户文化有限公司（www.jjhh.com），为上海首屈一指的家装一站式服务管理平台。是以建材、家具、电器等大宗生活消费品为主导，集展览团购、电子商务、行业资讯、设计施工为一体的O2O（线下商务与互联网的结合）模式家庭生活指导性消费平台。</p>',
            '<p>花样家博 一起来购！家家户户网5月29日-31日第二届夏季新型家博会，将在光大会展中心如期举行，本次将有众多品牌参与活动，品类涉及橱柜、洁具、木门、地板、设计、施工、地暖、软、木家具等组成，现场还有逛家博无需下单领好礼、联单兑奖、整点抽奖等各种活动，让您省时、省心、省力享受超低价折扣的一站式服务。</p>',
            '<p>花最少的钱，装最好的家！扫描二维码：立即加入我们，或咨询：4008 190 180    网址：www.jjhh.com   微信号：家家户户等方式与我们联系，期待您的参与！</p>'].join('')
        },
        'lottery': {
            title: '奖品说明',
            content: ['<h4>整点抽奖</h4>',
'<p>礼品：</p>',
'<p>现金红包，电水壶，微波炉，榨汁机，液晶电视，智能扫地机，空气净化器</p>',
'<p>整点抽奖时间：</p>',
'<p>5月29日： 12:00、13:30、15:00、16:30</p>',
'<p>5月30日： 10:00、11:00、12:30、14:00、15:30、17:00</p>',
'<p>5月31日： 11:00、12:30、14:00 </p>',
'<p>终极大奖：5月31日 15:30</p>',
'<h4>整点抽奖规则：</h4>',
'<p>1、家博会现场下订单即可参与抽奖，订单金额不限制；</p>',
'<p>2、下订单后将订单投入抽奖箱，等待整点抽奖；</p>',
'<p>3、必须使用家家户户网统一订单方可抽奖，其他订单一律不参与抽奖；</p>',
'<p>4、抽奖现场唱票3次，过期作废，重新抽取；</p>',
'<p>5、领奖时凭借顾客手中订单与中奖订单一致方可兑奖；</p>',
'<p>6、领取时间当天活动现场，其他补充规则，详见现场公布；</p>',
'<h4>联单奖品</h4>',
'<p>礼品：</p>',
'<p>2单胶棉拖把，4单电烤箱，6单电水壶，8单榨汁机，10单微波炉</p>',
'<p>联单抽奖规则：</p>',
'<p>1.订单金额满200元即为有效兑奖订单；</p>',
'<p>2.累计订单达到双数即可参与，仅限家家户户网统一订单；</p>',
'<p>3.联单奖品仅限现场领取，如遇奖品发完，将在活动后15天内快递到家；</p>',
'<p>4.现场订单不可重复兑奖，不可兑换现金；</p>',
'<p>5.现场兑奖奖品请以现场展示为准；</p>',
'<p>6.订单签订日期仅限5月29日-31日家博会活动现场订单；</p>'].join('')
        },
        'signup': {
            title: "手机报名",
            content: [' <form class="wform">',
                    '<label class="w_name"><input class="w_input" id="w_name" type="text" placeholder="请填写姓名"></label>',
                    '<label class="w_phone"><input class="w_input" id="w_phone" type="tel" maxlength="11" placeholder="请填写手机号"></label>',
                    '<label class="w_code"><input class="w_input" id="w_code" type="tel" maxlength="6" placeholder="请输入手机验证码"></label>',
                '</form>',
                '<div class="col-2">',
                    '<div class="btn btn-hollow btn-big" id="countdown" data-type="get_phone_code">获取验证码</div><div class="btn btn-solid disabled btn-big" id="signup_submit" data-type="signup_submit">提交报名</div>',
                '</div>'].join('')
        },
        'barcode': {
            wrapClass: 'dialog-barcode',
            title: "入场条形码",
            content: ['<img src="assets/images/barcode.png" class="barcode" alt="">',
                '<p class="gray f14">温馨提示：2015年5月29日——31日，在上海光大会展中心，凭条形码门票换取纸质门票进场。</p>'].join('')
        },
        'upgrade': {
            title: "升级VIP",
            content: ['<h4>您只需支付10元，即可升级VIP用户，VIP用户限额100名。</h4>',
                '<div class="hr_a"></div>',
                winxinPayBtn,
                '<div class="hr_a"></div>',
                '<div class="btn btn-hollow btn-big" data-type="service">等待客服联系我升级 VIP</div>'].join('')
        },
        'detail': {
            wrapClass: 'dialog-detail',
            title: "限时抢购",
            content: ''
        }
    };

    function checkError(data){
        var bool = false;
        switch(data.code){
            case -1:
                console.log('请先索票');
                showMessage('请先索票！',2000)
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
            $.post(url, params || {}, function(data, textStatus){
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

    // var DocumentRow = Backbone.View.extend({
    //      
    

    var $el = {
        'signup_box': $('#signup_box'),
        'prize_box': $('#prize_box'),
        'pro_box': $('#pro_box'),
        'body': $('body')
    };
    var tpl = {
        'tpl_signup_default': $('#tpl_signup_default').html(),
        'tpl_signup_normal': $('#tpl_signup_normal').html(),
        'tpl_signup_vip': $('#tpl_signup_vip').html(),
        'tpl_prize': $('#tpl_prize').html(),
        'tpl_pro_header': $('#tpl_pro_header').html(),
        'tpl_signup_header': $('#tpl_signup_header').html(),
    };

    var tpl_pro_text = {
        '1': {
            'title': '限时抢购',
            'imgtext': '<%if(v.end_time && v.time){%><p class="countdown" data-day="<%=v.end_time%>" data-time="<%=v.time%>"></p><%}%>',
            'content': '<p><dfn>&yen;<i><%=v.present_price %></i></dfn></p>'
        },
        '2': {
            'title': '精品团购',
            'imgtext': '<p class="limit" data-over="<%=v.over %>">限<%=v.inventory%>件|已定<%=v.apply_count%>件</p>',
            'content': '<p><dfn>¥<i><%=v.present_price %></i></dfn></p>'
        },
        '3': {
            'title': '劲爆特价',
            'imgtext': '',
            'content': '<p><%if(v.present_price){%><dfn>¥<i><%=v.present_price %></i></dfn><%}%> <%if(v.original_price){%><del>¥<%=v.original_price %></del><%}%>  <%if(v.present_price && v.original_price){%><span class="sale"><dfn><%=v.original_price ? ((v.present_price/v.original_price)*10).toFixed(1) + "折" : "" %></dfn></span><%}%></p>'
        }
    };
    var defaultImg = {
        loading: 'assets/images/loading.png',
        noimg: 'assets/images/noimg.png'
    }
    var tpl_pro_item = function(tab,dialog){
        var dialog = dialog || false;
        if(!dialog){
            return ['<div class="img">',
                    '<img class="lazy" src="'+ defaultImg.loading +'" data-url="<%=v.img_url %>">',
                    tpl_pro_text[1].imgtext,
                '</div>',
                '<span class="favorite <%=parseInt(v.iscollection) ? "favorited" : ""%> "></span>',
                '<h4><%=v.name %></h4>',
                tpl_pro_text[3].content,
                // '<div class="mbox">',
                //     '<%if( v.disabled ){%>',
                //         '<div class="btn btn-solid disabled">已结束</div>',
                //     '<%}else if( parseInt(v.isapply) ){%>',
                //         '<div class="btn btn-hollow">已预约</div>',
                //     '<%}else{%>',
                //      '<div class="btn btn-solid">预约购买</div>',
                //     '<%}%>',
                // '</div>',
                ''].join('');
        }else{
            return ['<div class="imgbox" data-id="<%=v.id%>">',
                    '<img src="<%=v.img_url%>" alt="">',
                    '<%if(v.end_time && v.time){%><p class="text"><span class="countdown" data-day="<%=v.end_time%>" data-time="<%=v.time%>"></span><i> </i></p><%}%>',
                    '<span class="favorite <%=parseInt(v.iscollection) ? "favorited" : ""%> "></span>',
                '</div>',
                tpl_pro_text[3].content,
                '<p class="info"><%=v.description%></p>',
                '<%if( v.disabled ){%>',
                        '<div class="btn btn-solid disabled">已结束</div>',
                '<%}else if( parseInt(v.isapply) ){%>',
                    '<div class="btn btn-hollow btn-big">已预约</div>',
                '<%}else{%>',
                    '<div class="btn btn-solid btn-big">预约购买</div>',
                '<%}%>',
                '<div class="detail-btns">',
                '    <span class="next <%=(index==sumNum) ? " disabled" : "" %>">下一产品</span>',
                '    <span class="prev <%=(index==1)? " disabled" : "" %>">上一产品</span>',
                '    <span class="numbox"><dfn><%=index%></dfn>/<%=sumNum%></span>',
                '</div>'].join('');
        }
        
    };
    var tpl_pro_content = function(tab){
        var isHide = '';
        if(tab != 1){
            isHide = ' hide';
        }
        //<%=v.img_url %>
        return ['<div class="wtab-c'+ isHide +'">',
            '<ul class="pro-list">',
                '<%_.each(list,function(v){%>',
                '<li data-id="<%=v.id %>" data-pro="'+ tab +'">',
                    tpl_pro_item(tab),
                '</li>',
                '<%})%>',
            '</ul>',
        '</div>'].join('');
    };
 // events: {
    //         "click .icon":          "open",
    //         "click .button.edit":   "openEditDialog",
    //         "click .button.delete": "destroy"
    //       },

    //       initialize: function() {

    //         //this.listenTo(this.model, "change", this.render);
    //       },

    //       render: function() {
    //         ...
    //       }

    // });

    $('#go_top').bind('click',function(e){
        var offsetTop = $('#signup_box')[0].offsetTop;
        window.scrollTo(0,offsetTop);
    });
    $('#go_tab').bind('click',function(e){
        var offsetTop = $('#pro_tab')[0].offsetTop;
        window.scrollTo(0,offsetTop);
    });

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
    }

    var App = {
        init: function(bool){
            var self = this;
            // if(bool){
            //     showToast('正在处理中...', 5000);
            // };
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {}, function(data, textStatus, jqXHR){
                    tempToast && tempToast.close();
                    ajaxStatus = false;
                    //请求数据后，填充页面
                    pageData = JSON.parse(data);
                    console.log(pageData);
                    if( pageData.product ){
                        self.rendPage(pageData);
                    }else{
                        console.log('暂无产品')
                    }
                });
            }
        },
        checkData: function(data){

        },
        // checkError: function(data){
        //     var bool = false;
        //     switch(data.code){
        //         case 1:
        //             bool = true;
        //             console.log('请求成功')
        //             break;
        //         case -1:
        //             console.log('请先报名');
        //             showMessage('请先报名！',function(){
        //                 dialogSignup();
        //             })
        //             break;
        //         case 0:
        //         default:
        //             console.log('请求失败了，请重试');
        //             break;
        //     }
        //     return bool;
        // },
        rendPage: function(data){
            var self = this;

            this.renderSignupHtml(data);

            this.renderPrizeHtml(data);

            this.renderProHtml(data);

            
            this.hciPanel();

            this.btnsHci();

            if(!this.firstLoad){
                this.firstLoad = true;

                this.otherHciPanel();

                this.delegateDetail();
            }

            $(".lazy").scrollLoading();
        },
        signupStatus: function(type){
            var html;
            type = parseInt(type);
            switch(type){
                case 0:
                    html = tpl.tpl_signup_normal;
                    break;
                case 1:
                    html = tpl.tpl_signup_vip;
                    break;
                case -1:
                default:
                    html = tpl.tpl_signup_default;
                    break;
            }
            return html;
        },
        //报名及状态
        renderSignupHtml: function(data,type){
            if(type == 0 || type == 1){
                data.type = type;
            }

            var headerHtml = _.template( tpl.tpl_signup_header )( data );

            $el.signup_box.html( [
                    headerHtml,
                    this.signupStatus(data.type)
                ].join('') );

            if( parseInt(data.measure) ){
                $('[data-type="tips_info"]').text('量房已申请成功');
            }
        },

        //活动奖品
        renderPrizeHtml: function(data){
            var prize_html = _.template( tpl.tpl_prize )( {'list': data.product[4]} );
            $el.prize_box.html(prize_html);
        },
        //'<!--限时抢购1/精品团购2/劲爆特价3-->'
        renderProHtml: function(data){
            $el.pro_box.html( [tpl.tpl_pro_header,
                '<div class="content">',
                this.renderItem(data,1),
                this.renderItem(data,2),
                this.renderItem(data,3),
                '</div>'].join('') );
        },
        renderItem: function(data,tab){
            //数据禁用的条件是非限制库存的产品达到截止日期，或达到库存限制
            //库存：v.inventory 已定 v.apply_count
            var proData = data.product[tab];
            proData.forEach(function(v){
                v.over = 0;
                v.disabled = 0;
                if(v.inventory){
                    v.over = (parseInt(v.inventory - v.apply_count) >0 ? 0 : 1);
                }
                if(v.end_time){
                    var time = (new Date(v.end_time).getTime() ) -(new Date().getTime());
                    v.time = time > 0 ? time : 0;
                    v.disabled = !v.time && v.over;
                }else{
                    v.disabled = v.over;
                };
            });
            //data.product[tab].concat(data.product[tab],data.product[tab]
            return _.template( tpl_pro_content(tab) )({'list': proData});
        },
        //交互操作
        hciPanel: function(data){
            $('p.countdown').countdown({
                format : "dd:hh:mm",
                timeauto : true,
                pretext: '剩余',
                timediff: 86400000-28800000
            });

            //$(window).trigger("scroll");
            this.fixTabParam = {
                tabBox: $el.body.find('.dflex'),
                isFixed: false
            };
            $el.pro_tab = $('#pro_tab');
            this._fixtab = $.proxy(this.fixtab, this);

            // if (!this.isIOS) {
            //     $(window).bind('touchmove', this._fixtab);
            //     $(window).bind("scroll", this._fixtab);
            //     $(window).trigger("scroll");
            // }
            $(window).unbind().bind('touchmove', this._fixtab);
            $(window).unbind().bind("scroll", this._fixtab);
            $(window).trigger("scroll");
        },
        // isIOS: function() {
        //     var userAgent = window.navigator.userAgent,
        //         ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
        //         ios5below = ios && ios[2] && (parseInt(ios[2].replace(/_/g, '.'), 10) < 5),
        //         operaMini = /Opera Mini/i.test(userAgent),
        //         body = document.body,
        //         div, isFixed;

        //     div = document.createElement('div');
        //     div.style.cssText = 'display:none;position:fixed;z-index:100;';
        //     body.appendChild(div);
        //     isFixed = window.getComputedStyle(div).position != 'fixed';
        //     body.removeChild(div);
        //     div = null;
        //     return !!(isFixed || ios5below || operaMini);
        // },
        fixtab: function() {
            if (getScrollTop() > $el.pro_tab[0].offsetTop) {
                if (this.fixTabParam.isFixed) return;
                this.fixTabParam.tabBox.addClass('fixed-top');
                this.fixTabParam.isFixed = true;
            } else {
                if (!this.fixTabParam.isFixed) return;
                this.fixTabParam.tabBox.removeClass('fixed-top');
                this.fixTabParam.isFixed = false;
            }
        },
        btnsHci: function(){
            var self = this;
            $('*[data-type],.toggle-barr').unbind();

            $('.toggle-barr').bind('click',function(e){
                var target = $(e.currentTarget);
                target.parent().addClass('toggle-text');
            });


            //报名
            // $('*[data-type]').bind('click',function(e){
            //     var target = $(e.currentTarget),
            //         type = target.data('type');
            //     alert(111)
            // });
            // $el.body.delegate('*[data-type]','click',function(e){
            $('*[data-type]').bind('click',function(e){
                var target = $(e.currentTarget),
                    type = target.data('type');

                switch(type){
                    case 'explain'://活动说明
                        self.showDialog(dialogInfo.explain);
                        break;
                    case 'lottery'://抽奖
                        self.showDialog(dialogInfo.lottery);
                        break;
                    case 'signup':
                        self.showDialog(dialogInfo.signup);
                        break;
                    case 'get_phone_code':
                        self.getPhoneCode(target);
                        break;
                    case 'signup_submit':
                        self.signupSubmit();
                        break;
                    case 'barcode':
                        self.showDialog(dialogInfo.barcode);
                        break;
                    case 'upgrade':
                        self.showDialog(dialogInfo.upgrade);
                        break;
                    case 'weinxin_pay':
                        console.log('微信支付');
                        location.href="./app/wxpay/payment.php"
                        break;
                    case 'service':
                        console.log('等待客服联系我升级');
                        ajaxRequest('home.php',{
                            action: 'contactupvip'
                        },function(data){
                            console.log(data);
                            hideDialog();
                            showMessage('提交成功', 2500);
                        });
                        break;
                    // case 'favorite'://收藏
                    //     self.toggleFavorite();
                    //     //self.showDialog(dialogInfo.signup);
                    //     break;
                    // case 'apply'://预约
                    //     self.toggleApply();
                    //     //self.showDialog(dialogInfo.signup);
                    //     break;
                    case 'tips_info'://申请免费量房
                        self.applyFree();
                        break;
                    default:
                        return;
                }
                
            });
        },
        showDialog: function(obj){
            obj = _.extend(obj,{mask:true})
            tempDialog = pandora.dialog(obj);
            this.btnsHci();
            return tempDialog;
        },
        signupSubmit: function(){
            var self = this;
            var http_url = location.href;
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
                    console.log('报名成功');
                    if(data.code ==2){
                        if(data.type == 0){
                            showMessage('您已经是普通用户，正在更新您的数据！',3500);
                        }else if(data.type == 1){
                            showMessage('您已经是VIP，正在更新您的数据！',3500);
                        };
                        self.init(true);
                    }else{
                        showMessage('普通用户报名成功！快看看升级VIP用户还有什么特权吧！',3500,function(){
                            pageData.type = 0;
                            self.renderSignupHtml(pageData,0);
                            self.btnsHci();
                        });
                    }
                    
                },function(){
                    showMessage('验证码错误！');
                });
            }
        },
        checkForm: function(bool){
            var $name = $('#w_name'),
                $phone = $('#w_phone'),
                $code = $('#w_code');
                $submit = $('#signup_submit');
            var name = $name.val().trim(),
                phone = $phone.val().trim(),
                code = $code.val().trim();
            if(!name){
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

            $submit.removeClass('disabled');

            if(bool){
                if(!code){
                    showMessage('请输入手机验证码',1000,function(){
                        $code.focus();
                    })
                    //$submit.addClass('disabled');
                    return;
                }
            }

            return {
                name: name,
                phoneNum: phone,
                code: code
            };
        },
        applyFree: function(){
            ajaxRequest('./home.php',{
                action: 'measurehouse'
            },function(data){
                console.log(data);
                showMessage('申请免费量房成功',3000,function(){
                    $('[data-type="tips_info"]').text('量房已申请成功');
                });
            });
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
        toggleFavorite: function(status,cb){
            ajaxRequest('./home.php',{
                'action': 'collection',
                'productid': curId,
                'collection': status
            },function(data){
                console.log('操作收藏成功');
                cb && cb();
            });
        },
        toggleApply: function(status,cb){
            ajaxRequest('./home.php',{
                'action': 'apply',
                'productid': curId,
                'apply': status
            },function(data){
                console.log('操作预约购买成功');
                cb && cb();
            });
        },
        otherHciPanel: function(){
            var self = this;
            // tabs 切换
            var tab_li = $("#pro_tab li");
            var tab_con = $el.pro_box.find(".wtab-c");
            function JS_tab_nav(tab_nav,tab_con,selected,tri_type){
                //$tab_obj=$(tab_nav);
                tab_nav.bind(tri_type,function(){
                    var tab_li_index = tab_nav.index(this);
                    $(this).addClass(selected).siblings().removeClass(selected);
                    tab_con.eq(tab_li_index).removeClass('hide').siblings().addClass('hide');
                    // return false;
                });
            };
            JS_tab_nav(tab_li,tab_con,"active","click");
            //JS_tab_nav(".JS_tabnav>li",".JS_tabsbox>.tabcon","selected","click");
            //收藏功能
            $el.pro_box.delegate('.favorite', 'click', function(e){
                e.stopPropagation();
                var target = $(e.currentTarget),
                    status = 1;
                if( target.hasClass('favorited') ){
                    status = 0;
                }
                curId = target.parent('li').attr('data-id');
                if(pageData.type === -1){
                    showMessage('请先索票，之后再进行收藏！',2500);
                    return;
                }
                self.toggleFavorite(status,function(){
                    target.toggleClass('favorited');
                });
            });

            //预约购买
            // $el.pro_box.delegate('.mbox>.btn', 'click', function(e){
            //     e.stopPropagation();
            //     var target = $(e.currentTarget),
            //         status = 1;

            //     if( target.hasClass('btn-hollow') ){
            //         showMessage('预约完成后，客服将与您电话确认预约。',3000);
            //         return;
            //     }
            //     if( target.hasClass('disabled') ){
            //         showMessage('此产品活动已结束！',3000);
            //         return;
            //     }

            //     var $limitBox = target.parents('li').find('[data-over]');
            //     var limit = $limitBox.data('over');
            //     if($limitBox.length && parseInt(limit) && status ){
            //         showMessage('您下手晚了',2000);
            //         return;
            //     }
            //     curId = target.parent().parent('li').attr('data-id');

            //     self.toggleApply(status,function(){
            //         if(status == 1){
            //             target.removeClass('btn-solid').addClass('btn-hollow').text('已预约');
            //         }else{
            //             showMessage('预约完成后，客服将与您电话确认预约。',3000);
            //             //target.removeClass('btn-hollow').addClass('btn-solid').text('预约购买');
            //         }
            //     });
            // });

            // var tempData = pageData.
            $el.pro_box.delegate('.content li', 'click', function(e){
                var target = $(e.target),
                    currentTarget = $(e.currentTarget);
                if( target.hasClass('favorite') || target.hasClass('btn') ){
                    return;
                }
                curId = currentTarget.attr('data-id');
                proTab = currentTarget.attr('data-pro');
                tabData = pageData.product[proTab];
                sumNum = tabData.length,

                tabData.forEach(function(v,i){
                    if(v.id == curId){
                        curItem = v;
                        curIndex = i;
                    }
                });
                self.renderDialogDetail();
            });
        },
        renderDialogDetail: function(){
            var self = this;
            curItem = pageData.product[proTab][curIndex];
            var html = _.template( tpl_pro_item(proTab,true) )( {
                'v': curItem,
                'sumNum': sumNum,
                'index': curIndex + 1
            } );
            dialogInfo.detail.title = tpl_pro_text[proTab].title;
            dialogInfo.detail.content = html;
            this.detailDialog = this.showDialog(dialogInfo.detail);

            $('span.countdown').countdown({
                format : "dd:hh:mm:ss",
                timeauto : true,
                pretext: '剩余',
                timediff: 86400000-28800000
            });
            console.log(curId)
        },
        delegateDetail: function(){
            var self = this;
            $el.body.delegate('span.next','click',function(){
                if( $(this).hasClass('disabled') ){
                    return;
                }
                self.updateDialogDetail(1);
            });
            $el.body.delegate('span.prev','click',function(){
                if( $(this).hasClass('disabled') ){
                    return;
                }
                self.updateDialogDetail(-1);
            });
            $el.body.delegate('.dialog-detail .favorite','click',function(e){
                var target = $(e.currentTarget);
                var status = 1;
                if( target.hasClass('favorited') ){
                    status = 0;
                }
                var target = $(e.currentTarget);
                self.toggleFavorite(status,function(){
                    target.toggleClass('favorited');
                    //更新容器
                    curItem.iscollection = status;
                    self.updateProList();
                });
            });
            $el.body.delegate('.dialog-detail .btn','click',function(e){
                var target = $(e.currentTarget);
                var status = 1;
                if( target.hasClass('btn-hollow') ){
                    showMessage('预约完成后，客服将与您电话确认预约。',3000);
                    return;
                }
                if( target.hasClass('disabled') ){
                    showMessage('此产品活动已结束！',3000);
                    return;
                }
                var $limitBox = target.parents('.dialog').find('[data-over]');
                var limit = $limitBox.data('over');
                if($limitBox.length && parseInt(limit) && status ){
                    showMessage('您下手晚了',2000);
                    return;
                }
                self.toggleApply(status,function(){
                    if(status == 1){
                        target.removeClass('btn-solid').addClass('btn-hollow').text('已预约');
                    }else{
                        showMessage('预约完成后，客服将与您电话确认预约。',2000);
                        //target.removeClass('btn-hollow').addClass('btn-solid').text('预约购买');
                    }
                    //更新容器
                    curItem.isapply = status;
                    //self.updateProList();
                });
            });
        },
        updateProList: function(){
            var tpl = tpl_pro_content(proTab);
            var $box = $el.pro_box.find('.wtab-c').eq(proTab-1);
            var data = pageData.product[proTab];
            var html = _.template(tpl)({list: data});
            $box.html(html);
        },
        updateDialogDetail: function(index){
            if( (curIndex+index < 0) || (curIndex+index+1 > sumNum) ){
                return;
            }
            curIndex += index;
            console.log(curIndex)
            curItem = pageData.product[proTab][curIndex];
            curId = curItem.id;
            console.log(curId)
            var html = _.template( tpl_pro_item(proTab,true) )( {
                'v': curItem,
                'sumNum': sumNum,
                'index': curIndex + 1
            } );
            this.detailDialog.title(tpl_pro_text[proTab].title);
            this.detailDialog.content(html);

            $('span.countdown').countdown({
                format : "dd:hh:mm:ss",
                timeauto : true,
                pretext: '剩余',
                timediff: 86400000-28800000
            });
            //this.checkChange();
        },

    };

    App.init();
    
    

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

});
