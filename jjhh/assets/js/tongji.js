( function(){
    function LoadJS( jsUrl ) {
      var oHead = document.getElementsByTagName('HEAD').item(0);
      //var oHead = document.getElementById('tongji')
      var oScript= document.createElement("script"); 
      oScript.type = "text/javascript"; 
      oScript.src=jsUrl; 
      oHead.appendChild( oScript); 
    };
    //var seed = new Date().getTime();
    //<script src="http://s11.cnzz.com/z_stat.php?id=1254463052&web_id=1254463052" language="JavaScript"></script>
    var tjUrl = 'http://s11.cnzz.com/z_stat.php?id=1254463052&web_id=1254463052';
    
    //<script src="http://s4.cnzz.com/z_stat.php?id=1254406384&web_id=1254406384" language="JavaScript"></script>
    if( /sh\.jjhh\.com/.test(location.hostname) ){
        tjUrl = 'http://s4.cnzz.com/z_stat.php?id=1254406384&web_id=1254406384';
    }
    
    LoadJS(tjUrl);
} )();


