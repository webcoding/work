
// 客户端js

$(function(){
    var ajaxStatus = false;
    var pageData; //页面数据
    // var tempDialog,tempMsg,tempToast;
    // var template,html;

    var $el = {
        'pbox': $('#pbox'),
        'article': $('#article'),
        'body': $('body')
    };
    var tpl = {
        'tpl_list': $('#tpl_list').html(),
        'tpl_article': $('#tpl_article').html()
    };
    var defaultImg = {
        loading: 'assets/images/loading.png',
        noimg: 'assets/images/noimg.png'
    };
    var App = {
        initList: function(){
            console.log('渲染列表');
            var self = this;
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {
                    action: 'news'
                }, function(data, textStatus, jqXHR){
                    //tempToast && tempToast.close();
                    ajaxStatus = false;
                    //请求数据后，填充页面
                    pageData = JSON.parse(data);
                    console.log(pageData);
                    if( pageData.length ){
                        self.rendListPage(pageData);
                    }else{
                        self.rendListPage(pageData,false);
                    }
                });
            }
        },
        initArticle: function(id){
            console.log('渲染文章');
            var self = this;
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {
                    action: 'shownews',
                    newsid: id
                }, function(data, textStatus, jqXHR){
                    //tempToast && tempToast.close();
                    ajaxStatus = false;
                    //请求数据后，填充页面
                    pageData = JSON.parse(data);
                    console.log(pageData);
                    if( pageData.content ){
                        self.rendArticlePage(pageData);
                    }else{
                        console.log('暂无内容')
                    }
                });
            }
        },
        rendListPage: function(data,bool){
            var bool = bool || true;
            if(!bool){
                $el.pbox.html('<p class="empty">暂无产品</p>');
                return;
            }
            var self = this;
            var html = _.template( tpl.tpl_list )( {list: data} );

            $el.pbox.html(html);
            $(".lazy").scrollLoading();
        },
        rendArticlePage: function(data){
            var self = this;

            var time = data.create_time;
            data.date = formatDate(time);
            var html = _.template( tpl.tpl_article )( {article: data} );

            $el.article.html(html);

            $('title').text(data.title);
            //$(".lazy").scrollLoading();
        },
    };

    var url = location.href;
    var id = 0;
    if(/\/article\.html\?id=/.test(url)){
        id = getQuery('id');
        App.initArticle(id);
    }else{
        App.initList();
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

});
