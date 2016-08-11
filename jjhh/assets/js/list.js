
// 客户端js

$(function(){
    var AppList = AppList || {};
    
    var ajaxStatus = false;
    var pageData; //页面数据
    // var tempDialog,tempMsg,tempToast;
    // var template,html;
    var $body = $('body'),
        $tabWrap;

    var curTabIndex = 0;

    var $el = {
        'listTopBox': $('#top_list_wraper'),
        'listBtmBox': $('#list_wraper')
    };
    var tpl = {
        'tpl_list_top': $('#tpl_list_top').html(),
        'tpl_list': $('#tpl_list').html()
    };
    var defaultImg = {
        loading: 'assets/images/loading.png',
        noimg: 'assets/images/noimg.png'
    };
    AppList = $.extend(AppList,{
        /**category
        {
            "id": 1,
            "name": "地板"
        },
        {
            "id": 2,
            "name": "瓷砖"
        },
        {
            "id": 3,
            "name": "卫浴"
        },
        {
            "id": 4,
            "name": "家用电器"
        }
        **/
        initList: function(type,categoryid){
            var self = this;
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {
                    module:'Product',
                    category_id:categoryid,
                    type: type
                }, function(data, textStatus, jqXHR){
                    //tempToast && tempToast.close();
                    ajaxStatus = false;
                    //请求数据后，填充页面
                    var product = JSON.parse(data).data;
                    console.log(product);
                    self.renderListPage(product);
                });
            }
        },
        initListTop:function(){
            var self = this;
            // if(!ajaxStatus){
            //     ajaxStatus = true;
                $.post('./home.php', {
                    action: 'getCategoryAndBanner',
                    module:'Product'
                }, function(data, textStatus, jqXHR){
                    //tempToast && tempToast.close();
                    //ajaxStatus = false;
                    //请求数据后，填充页面
                    pageData = JSON.parse(data).data;
                    console.log(pageData);

                    self.renderListTop(pageData);

                    setTimeout(function(){
                        $('#filterProduct .tag').bind('click',filterProduct);
                        $('#listTab .tab').bind('click',switchTab);
                    },300)
                    $tabWrap = $body.find('.tabWrap p');
                    $curTabWrap = $tabWrap.eq(0);
                    
                });
            //}
        },
        renderListPage: function(data){
            if(!data.length){
                $el.listBtmBox.html('<p class="empty">暂无产品</p>');
                return;
            }
            var self = this;
            var html = _.template( tpl.tpl_list )( {data: data} );

            $el.listBtmBox.html(html);

            $(".lazy").scrollLoading();
        },
        renderListTop: function(data){
            var self = this;
            //{category: Array[16], banner: Array[3]}
            var html = _.template( tpl.tpl_list_top )( {data: data} );

            $el.listTopBox.html(html);

            setTimeout(function(){
                self.renderSlide()
            },300)
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
        }
    });

    var url = location.href;
    var type = 0,categoryid = 0;

    type = getQuery('type');
    categoryid = getQuery('categoryid');

    AppList.initListTop();

    AppList.initList(type,categoryid);
    
    function switchTab(e){
        var target = $(e.currentTarget);
        var index = target.index()>1 ? 1 : 0;
        curTabIndex = index;
        //if(!target.hasClass('currentTab')){
            target.addClass('currentTab').siblings().removeClass('currentTab');
            var targetCon = $('.tagWrap').eq(index);
            if(targetCon.css('display') == 'block'){
                $('.tagWrap').hide();
            }else{
                $('.tagWrap').hide();
                targetCon.show();
            }
            //$('.tagWrap').hide().eq(index).show();
        //}
    }
    function filterProduct(e){
        var target = $(e.currentTarget);
        if(!target.hasClass('currentTag')){
            if(curTabIndex == 0){
                categoryid = target.data('categoryid') || 0;
            }else{
                type = target.data('type') || 0;
            }
            AppList.initList(type,categoryid);
            target.addClass('currentTag').siblings().removeClass('currentTag');
            $tabWrap.eq(curTabIndex).html(target.text());//.removeClass('currentTab')
        }
        $('.tagWrap').hide();
        $tabWrap.removeClass('currentTab');
    }
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

    function formatDate(time,format){
        var dates = time.split(' ');
        var date = dates[0].split('-');
        return date[0] + '年' + date[1] + '月' + date[2] + '日';
    }

    window.AppList = AppList;
});
