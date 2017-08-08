
function animate(curEle,obj,interval,fn){
    interval=interval||15
    window.clearInterval(curEle.timer);
    curEle.timer=setInterval(move,interval);
    function move(){
        var flag=true;
        for(var key in obj){
            var start=getCss(curEle,key);
            var step=(obj[key]-start)/10;
            step=step>0?Math.ceil(step):Math.floor(step);
            start+=step;
            setCss(curEle, key, start);
            if(Math.ceil(start)!==obj[key]) flag=false;
        }

        if(flag){
            window.clearInterval(curEle.timer);
            if(fn && typeof fn==="function")fn();
        }
    }
}

function getCss(curEle,attr){
     var val = typeof window.getComputedStyle == "function" ? getComputedStyle(curEle,null)[attr] : curEle.currentStyle[attr];
     if(!isNaN(parseFloat(val))) val = parseFloat(val);
      return val;
}; 
function setCss(curEle, attr, value) {
    var reg = /^(width|height|top|left|right|bottom|((margin|padding)(Left|Top|Right|Bottom)?))$/;
    if (attr === "opacity") {
        curEle["style"]["opacity"] = value;
        curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
    } else if (reg.test(attr)) {
        curEle["style"][attr] = /^[+-]?(\d|[1-9]\d+)(\.\d+)?$/.test(value) ? value + "px" : value;
    } else {
        curEle["style"][attr] = value;
    }
}; 