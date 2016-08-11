
// 客户端js

$(function(){
    var ajaxStatus = false;
    var pageData; //页面数据
    // var tempDialog,tempMsg,tempToast;
    // var template,html;

    var $el = {
        'ticket': $('#ticket'),
        'body': $('body')
    };
    var tpl = {
        'tpl_ticket': $('#tpl_ticket').html()
    };
    var defaultImg = {
        loading: 'assets/images/loading.png',
        noimg: 'assets/images/noimg.png'
    };
    var App = {
        init: function(){
            console.log('渲染列表');
            var self = this;
            if(!ajaxStatus){
                ajaxStatus = true;
                $.post('./home.php', {
                    action: 'getUserType'
                }, function(data, textStatus, jqXHR){
                    console.log('Post response:');
                    var pageData = JSON.parse(data);
                    console.log(pageData)
                    //if( checkError(pageData) ){
                    self.rendPage(pageData);
                    //}
                });
            }
        },
        rendPage: function(data){
            var self = this;
            var html = _.template( tpl.tpl_ticket )( {ticket: data} );

            $el.ticket.html(html);

            $('title').text(data.title);
            //$(".lazy").scrollLoading();
        }
    };

    App.init();

});
