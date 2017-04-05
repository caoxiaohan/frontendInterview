var bofuwaEvent = (function () {
   function on(ele,type,fn){
		if(ele.addEventListener){
			ele.addEventListener(type,fn,false);
			return this;	
		}
		if(!ele["aEvent"+type]){
			ele["aEvent"+type]=[];
			ele.attachEvent("on"+type,function(){run.call(ele)});
		}
		var a=ele["aEvent"+type];
		if(!a.some(function(item){return item==fn})) a.push(fn);
		return this;	
	}

	function run(){
		var e=e||window.event;
		var type=e.type;
		if(!e.target){
			e.target=e.srcElement;
			e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
			e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
			e.preventDefault=function(){e.returnValue=false;}	
			e.stopPropagation=function(){e.cancelBubble=true;}
			
		}
		var a=this["aEvent"+type];
		if(a) a.forEach(function(item){item.call(this,e)},this);
		return this;
	}
	function off(ele,type,fn){
		if(ele.removeEventListener){
			ele.removeEventListener(type,fn,false);
			return this;	
		}
		
		var a=ele["aEvent"+type];
		if(a) ele["aEvent"+type]=a.filter(function(item){return item!=fn});
		return this;
	}

	function processThis(fn,obj){
		return function(e){fn.apply(obj,[e]);}	
	}

    return {
        on: on,
        off: off,
        run: run,
        processThis: processThis
    }
})();