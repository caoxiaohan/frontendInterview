//->使用惰性思想(JS高阶编程技巧之一)来封装我的常用的方法库:第一次在给utils赋值的时候我们就已经把兼容处理好了,把最后的结果存放在flag变量中,以后在每一个方法中,只要是IE6~8不兼容的,我们不需要重新的检测,只需要使用flag的值即可
var utils = (function () {
    var flag = "getComputedStyle" in window;//->flag这个变量不销毁,存储的是判断当前的浏览器是否兼容getComputedStyle,兼容的话是标准浏览器,但是如果flag=false说明当前的浏览器是IE6~8


    //->children:获取curEle下所有的元素子节点(兼容所有的浏览器),如果传递了tagName,可以在获取的集合中进行二次筛选,把指定标签名的获取到
    function children(curEle, tagName) {
        var ary = [];
        if (!flag) {
            var nodeList = curEle.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var curNode = nodeList[i];
                curNode.nodeType === 1 ? ary[ary.length] = curNode : null;
            }
            nodeList = null;
        } else {
            ary = this.listToArray(curEle.children);
        }
        if (typeof tagName === "string") {
            for (var k = 0; k < ary.length; k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(k, 1);
                    k--;
                }
            }
        }
        return ary;
    }


    return {
        listToArray: function (likeAry) {
            if (flag) {
                return Array.prototype.slice.call(likeAry, 0);
            }
            var ary = [];
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
            return ary;
        },
        formatJSON: function (jsonStr) {
            return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
        },
        offset: function (curEle) {
            var disLeft = curEle.offsetLeft, disTop = curEle.offsetTop, par = curEle.offsetParent;
            while (par) {
                if (navigator.userAgent.indexOf("MSIE 8") === -1) {
                    disLeft += par.clientLeft;
                    disTop += par.clientTop;
                }
                disLeft += par.offsetLeft;
                disTop += par.offsetTop;
                par = par.offsetParent;
            }
            return {left: disLeft, top: disTop};
        },
        win: function (attr, value) {
            if (typeof value === "undefined") {
                return document.documentElement[attr] || document.body[attr];
            }
            document.documentElement[attr] = value;
            document.body[attr] = value;
        },
        getCss: function (curEle, attr) {
            var val = null, reg = null;
            if (flag) {
                val = window.getComputedStyle(curEle, null)[attr];
            } else {
                if (attr === "opacity") {
                    val = curEle.currentStyle["filter"];
                    reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                    val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
                } else {
                    val = curEle.currentStyle[attr];
                }
            }
            reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
            return reg.test(val) ? parseFloat(val) : val;
        },
        children: children
    }
})();