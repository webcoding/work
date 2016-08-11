
// 客户端js

$(function(){
    
    var ajaxStatus = false;
    var pageData; //页面数据
    // var tempDialog,tempMsg,tempToast;
    // var template,html;
    var $body = $('body'),
        $tabWrap;

    var curTabIndex = 0;

    var $el = {
        'listBtmBox': $('#list_wraper'),
        'listWrap': $('.listWrap')
    };
    var tpl = {
        'tpl_list': $('#tpl_list').html()
    };
    var defaultImg = {
        loading: 'assets/images/loading.png',
        noimg: 'assets/images/noimg.png'
    };
    var AppList = {
        initList: function(type){
            var self = this;
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {
                    action: type
                }, function(data, textStatus, jqXHR){
                    //tempToast && tempToast.close();
                    ajaxStatus = false;

                    var list = JSON.parse(data);
                    if(list.code == -1){
                        $el.listWrap.html('<p class="tc">您无权限访问此页面，即将返回</p>');
                        history.go(-1);
                        return;
                    }
                    //请求数据后，填充页面
                    var product = list.data;
                    console.log(product);
                    self.renderListPage(product);
                });
            }
        },
        renderListPage: function(data){
            if(!data.length){
                var text = (type === 'myApply' ? '去预约' : '去收藏');
                var textTip = (type === 'myApply' ? '暂无预约' : '暂无收藏');
                $el.listBtmBox.html('<p class="tc f14" style="margin-top:20px;">'+textTip+'</p><p class="empty"><a href="http://m.jjhh.com/jjhh/expolist.html">'+text+'</a></p>');
                return;
            }
            var self = this;

            var html = _.template( tpl.tpl_list )( {data: data} );

            $el.listBtmBox.html(html);

            var appText = (type === 'myApply' ? '我已预约的产品' : '我已收藏的产品');
            $el.listWrap.append('<p class="tc" style="color:#999;">—————— ' + appText + ' ——————</p>')
            

            $(".lazy").scrollLoading();
        }
    };

    var url = location.href;
    var type = /myapply\.html/.test(url) ? 'myApply' : 'myCollection';
    
    AppList.initList(type);
    
    function formatDate(time,format){
        var dates = time.split(' ');
        var date = dates[0].split('-');
        return date[0] + '年' + date[1] + '月' + date[2] + '日';
    }

});
