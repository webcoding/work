var nbBrain_dir = '';
require.config({
	baseUrl:'assets/js/',
	shim:{
    layerScroll: {
      deps: ['libs', 'inherit', 'layer','scroll'],
      exports: 'layerScroll'
    },
    mask:{
      deps: ['libs', 'inherit', 'layer','scroll'],
      exports: 'layerScroll'
    }
	},
	paths:{
    "libs": "lib.min",
    'inherit':'inherit',
    'baseView':'baseView',
    'mask':'mask',
    'layer':'layer',
    'scroll':'screen',
    'layerScroll':'layer.scroll'
	}

});

define(['libs','layerScroll'],function(libs, layerScroll){
    $('body').click(function(){
        var aa = new layerScroll();
        aa.show();
    })
});