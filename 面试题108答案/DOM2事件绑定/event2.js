 //bind:给元素curEle的eventType事件绑定方法eventFn
 function bind(curEle, eventType, eventFn) {
    if ("addEventListener" in window) curEle.addEventListener(eventType, eventFn, false);
    else{
		if(curEle[eventType+eventFn]) return;    //已绑定的方法不再重复绑定
		curEle[eventType+eventFn] = function () {//给eventFn添加自定义属性。
			eventFn.call(curEle);//修改eventFn中的this为当前元素
		};
		curEle.attachEvent("on" + eventType, curEle[eventType+eventFn] );
	}
}
//unbind:给元素curEle的eventType事件解除绑定方法eventFn
function unbind(curEle, eventType, eventFn) {
    if ("removeEventListener" in window) curEle.removeEventListener(eventType, eventFn, false);
    else  curEle.detachEvent("on" + eventType, curEle[curEle+eventFn] );     
}
//on:创建一个事件池ary，把需要事件绑定的方法eventFn都放进去
function on(curEle, eventType, eventFn) {
    !curEle["myEvent" + eventType] ? curEle["myEvent" + eventType] = [] : null;
    var ary = curEle["myEvent" + eventType];
	if (typeof eventFn !== "function") return; 
    for (var i = 0; i < ary.length; i++) if (ary[i] == eventFn) return;  
    ary.push(eventFn);            //每次执行on传入的不同方法都被添加进数组ary中
    bind(curEle, eventType, run);//bind中已经做了重复绑定处理，同名方法run只被绑定一次
}
//off:在自己的事件池ary中，把需要移除的方法eventFn去掉
function off(curEle, eventType, eventFn) {
    var ary = curEle["myEvent" + eventType];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === eventFn) {
             ary[i] = null;
             return;
        }
    }
}
//run:按照自己的事件池ary，依次执行我们的绑定的方法eventFn
function run(e) {//绑定时自带的参数e
	 e = e || window.event;
     setE(e);   	 
    var ary = this["myEvent" + e.type];//this-->curEle
    for (var i = 0; i < ary.length; i++) {
        var curFn = ary[i];
        if (typeof curFn === "function") curFn.call(this, e);       
    }
}
//解决e的兼容问题
function setE(e){	 
    var flag = e.target ? true : false;
    if (!flag) {
        e.target = e.srcElement;
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };
    }
}
 