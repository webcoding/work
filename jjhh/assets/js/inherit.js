/**
 * params 1、parent
 * inherit
 * return 一个构造函数，包含superclass,subclasses以及property及constructor
 */
define(['libs'], function (libs) {

  var slice = [].slice;
  var Core = function () {
  };
  
  Core.Class = function () {
    if (arguments.length == 0 || arguments.length > 2) throw '参数错误';

    var parent = null;
    //将参数转换为数组
    var properties = slice.call(arguments);

    //如果第一个参数为类（function），那么就将之取出
    if (typeof properties[0] === 'function')
      parent = properties.shift();
    properties = properties[0];

    function klass() {
      this.__propertys__();
      this.initialize.apply(this, arguments);
    }

    klass.superclass = parent;
    klass.subclasses = [];

    var sup__propertys__ = function () {
    };
    var sub__propertys__ = properties.__propertys__ || function () {
    };

    if (parent) {
      if (parent.prototype.__propertys__) sup__propertys__ = parent.prototype.__propertys__;

      var subclass = function () {
      };
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }


    var ancestor = klass.superclass && klass.superclass.prototype;
    for (var k in properties) {
      var value = properties[k];

      //满足条件就重写
      if (ancestor && typeof value == 'function') {
        var argslist = /^\s*function\s*\(([^\(\)]*?)\)\s*?\{/i.exec(value.toString())[1].replace(/\s/i, '').split(',');
        //只有在第一个参数为$super情况下才需要处理（是否具有重复方法需要用户自己决定）
        if (argslist[0] === '$super' && ancestor[k]) {
          value = (function (methodName, fn) {
            return function () {
              var scope = this;
              var args = [function () {
                return ancestor[methodName].apply(scope, arguments);
              } ];
              return fn.apply(this, args.concat(slice.call(arguments)));
            };
          })(k, value);
        }
      }

      klass.prototype[k] = value;
    }

    if (!klass.prototype.initialize)
      klass.prototype.initialize = function () {
      };

    //兼容现有框架，__propertys__方法直接重写
    klass.prototype.__propertys__ = function () {
      sup__propertys__.call(this);
      sub__propertys__.call(this);
    };

    //兼容代码，非原型属性也需要进行继承
    for (key in parent) {
      if (parent.hasOwnProperty(key) && key !== 'prototype' && key !== 'superclass')
        klass[key] = parent[key];
    }

    klass.prototype.constructor = klass;

    return klass;
  };


  /**
   * @description 对象扩展
   */
  Core.extend = function () {
    var args = slice.call(arguments);
    var source = args.shift() || {};

    if (!source) return false;

    for (var i = 0, l = args.length; i < l; i++) {
      if (typeof args[i] === 'object') {
        for (var key in args[i]) {
          source[key] = args[i][key];
        }
      }
    }

    return source;
  };

  /**
   * @description 对原型链的扩充
   */
  Core.implement = function (fn, propertys) {
    if (typeof fn !== 'function') return false;

    for (var i in propertys) {
      fn.prototype[i] = propertys[i];
    }

    return fn;
  };

  return Core;
});