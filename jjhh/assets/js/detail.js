
// 客户端js

$(function(){
    var AppDetail = AppDetail || {};

    var ajaxStatus = false;
    var pageData; //页面数据
    // var tempDialog,tempMsg,tempToast;
    // var template,html;

    var userType = -1;

    var $body = $('body');

    var $el = {
        'detailBox': $('#detail_wraper')
    };
    var tpl = {
        'tpl_detail': $('#tpl_detail_container').html()
    };
    var defaultImg = {
        loading: 'assets/images/loading.png',
        noimg: 'assets/images/noimg.png'
    };
    AppDetail = $.extend(AppDetail,{
        initDetail: function(id){

            var self = this;

            if(!browser.isWeixin){
                $('header.flex').show()
            }
            // if(!ajaxStatus){
            //     ajaxStatus = true;
                $.post('./home.php', {
                    module:'Product',
                    action: 'detail',
                    productid:id
                }, function(data, textStatus, jqXHR){
                    //tempToast && tempToast.close();
                    //ajaxStatus = false;
                    var detailData = JSON.parse(data)
                    userType = detailData.type;
                    //请求数据后，填充页面
                    var product = detailData.data;
                    console.log(product);
                    $('title').html(product.name)
                    self.rendDetailPage(product);
                });
            //}
        },
        rendDetailPage: function(data){
            var self = this;
            var html = _.template( tpl.tpl_detail )( {data: data} );

            $el.detailBox.html(html);

            setTimeout(function(){
                self.renderSlide()
            },300);

            //this.bindCenter();

            //绑定事件
            this.bindClick();

            if(browser.isWeixin){
                $('.purchaseTip').show();
            }
            
            $cur_apply_count = $('#cur_apply_count');
        },
        bindCenter: function(){

            if(userType != -1){
                App.dialogCustom(function(){
                    
                },{
                    userType: userType,
                    dialogType: 'mycenter'
                });
            }else{
                App.dialogCustom(function(){
                    location.reload()
                },{
                    userType: userType,
                    loginType: 'login',
                    dialogType: 'login'
                });
            }
        },
        renderSlide: function(){
            var swiper = new Swiper('.swiper-container', {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                pagination: '.swiper-pagination',
                paginationClickable: true,
                // Disable preloading of all images
                preloadImages: false,
                // Enable lazy loading
                lazyLoading: true
            });
        },
        toggleFavorite: function(status,cb){
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {
                    action: 'collection',
                    collection: status,
                    productid: id
                }, function(data){
                    ajaxStatus = false;
                    console.log('操作收藏成功');
                    cb && cb(status);
                });
            }else{
                App.showToast('服务器正在处理中...')
            }
        },
        toggleApply: function(status,cb){
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {
                    action: 'apply',
                    apply: 1,
                    productid: id
                }, function(data){
                    var data = JSON.parse(data);
                    ajaxStatus = false;
                    $cur_apply_count.html(data.apply_count || 0);
                    cb && cb(1);
                });
            }else{
                App.showToast('服务器正在处理中...')
            }
        },
        bindClick: function(){
            var self = this;
            $('#mycenter').unbind().bind('click',function(){
                self.bindCenter();
            })
            $('.button_S').unbind().bind('click',function(e){
                var target = $(e.currentTarget);
                var status = 1;
                if(target.hasClass('favedbox')){
                    status = 0;
                }
                if(userType != -1){
                    self.toggleFavorite(status,function(ss){
                        if(ss == 1){
                            target.addClass('favedbox').html('<i class="icon-fav icon-faved"></i>已收藏');
                        }else{
                            target.removeClass('favedbox').html('<i class="icon-fav"></i>收藏');
                        }
                    });
                }else{
                    App.login(function(type){
                        userType = type;
                        location.reload()
                    });
                }
            });

            $('.button_L').bind('click',function(e){
                var target = $(e.currentTarget);
                var status = target.data('status');
                if(status){
                    App.showToast('您已经预约成功了')
                    return;
                }
                if(userType != -1){
                    if(browser.isWeixin){
                        var jumpUrl = "app/wxpay/apply_payment.php?productid="+ id;
                        var host = './';
                        if(/sh\.jjhh\.com/.test(location.hostname)){
                            host = 'http://m.jjhh.com/jjhh/';
                        }
                        jumpUrl = host + jumpUrl;
                        location.href=jumpUrl;
                    }else{
                        (function(st){
                            self.toggleApply(st,function(ss){
                                target.data('status',1)
                                if(st == 0){
                                    target.html('预约成功');
                                    //App.showToast('预约完成后，客服将与您电话确认预约。',3500);
                                }
                                // else{
                                //     App.showToast('预约完成后，客服将与您电话确认预约。',2000);
                                // }
                            });
                        })(status);
                    }
                }else{
                    App.login(function(type){
                        userType = type;
                        target.data('status',1);
                        self.toggleApply(st,function(ss){
                                target.data('status',1)
                                if(st == 0){
                                    target.html('预约成功');
                                    //App.showToast('预约完成后，客服将与您电话确认预约。',3500);
                                }
                            });
                    });
                }
            });
        }
    });

    var url = location.href;
    var id = 0;
    id = getQuery('id');

    AppDetail.initDetail(id);
    
    function getQuery(query, url, urlfix) {
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

    window.AppDetail = AppDetail;

});
