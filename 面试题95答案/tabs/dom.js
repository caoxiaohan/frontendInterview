

//给数组扩展一个去除数组中的重复项的方法
Array.prototype.distinct=function (){
	var a=this;
	for(var nIndex=0;nIndex<a.length-1;nIndex++){
		for(var i=nIndex+1;i<a.length;){
			if(a[nIndex]==a[i]){
				a.splice(i,1);				
			}else{
				i++;
			}
		}
	}
	return a;
	
}

//字符串扩展方法：去除字符串首尾的空格
String.prototype.trim=function(){	
	var reg=/^\s+|\s+$/g;	
	return this.replace(reg,'');
	
}
var DOM={}//存在一个对象的属性上，单例模式


DOM.insertAfter=function (oldEle,newEle){
	/*	和DOM方法insertBefore对应，把newEle追加在oldEle的后面	*/
	if(oldEle&&oldEle.nodeType===1&&newEle&&newEle.nodeType===1){
		oldEle.nextSibling?oldEle.parentNode.insertBefore(newEle,oldEle.nextSibling):oldEle.parentNode.appendChild(newEle)
	}else{
		throw new Error('参数错误');
	}
}


//2 在第一元素的的第一个子节点处插入元素
DOM.prepend=function(newNode,parentEle){
	/*	
		此方法和appendChild方法对应，把newNode这个节点，当成第一个子节点追加给parentEle元素。
	*/
	var child=parentEle.firstChild;	
		child?parentEle.insertBefore(newNode,child):parentEle.appendChild(newNode);
}

//3 找出currentEle这个元素的所有的哥哥节点
DOM.preSiblings=function (currentEle){
	var pre=currentEle.previousSibling;
	var a=[];
	while(pre){
		if(pre.nodeType===1){
			a.unshift(pre);
		}
		pre=pre.previousSibling;	
	}
	return a;
}

//4 找出currentEle这个元素节点的所有弟弟节点
DOM.nextSiblings=function (currentEle){
	var next=currentEle.nextSibling;
	var a=[];
	while(next){		
		if(next.nodeType==1){
			a.push(next);
		}
		next=next.nextSibling;
	}
	return a;	
}

//5 获得当前元素currentEle的所有兄弟节点
DOM.siblings=function (currentEle){
	//就是把以上两个方法合并一下
	 return DOM.preSiblings(currentEle).concat(DOM.nextSiblings(currentEle));
	
}


//6获得currentEle的上一个元素节点（相邻的哥哥节点）
DOM.preEle=function (currentEle){
	if(typeof currentEle.previousElementSibling =="object")
	//这里的判断一定要用typeof，而不能用if(currentEle.previousElementSibling)
	//因为如果currentEle是第一个元素，则previousElementSibling为null,null和undefined都是false,
	//用typeof则可以，
		return currentEle.previousElementSibling;
		
		
	var pre=currentEle.previousSibling;
	while(pre){
		if(pre.nodeType===1){
			return pre;
		}
		pre=pre.previousSibling;	
	}
	return null;//它没有哥哥元素则返回null。
	
}

//7   获得currentEle的下一个元素节点（相邻的弟弟节点）
DOM.nextEle=function (currentEle){
	if(typeof currentEle.nextElementSibling=="object"){
		return 	currentEle.nextElementSibling;
	}
	var next=currentEle.nextSibling;
	while(next){
		if(next.nodeType===1){
			return next;	
		}
			next=next.nextSibling;		
	}
	return null;	
}

//8 获得currentEle的相邻的两个元素节点
DOM.closet=function (currentEle){
	var a=[];
	var n=DOM.nextEle(currentEle);
	var p=DOM.preEle(currentEle);
	if(p) a.push(p);
	if(n) a.push(n);
	
	return a;	
}

//9 判断ele元素在兄弟节点中是不是第一个，既是不是长子
DOM.isFirstChild=function (ele){
	return DOM.preEle(ele)?false:true;
}

//10 判断ele元素在兄弟节点中是不是最后一个
DOM.isLastChild=function (ele){
	return DOM.nextEle(ele)?false:true;
}

//11 在所有的元素节点集eles中，找出所有的长子
DOM.getFirstEles=function (eles){
	var a=[];
	for(var i=0;i<eles.length;i++){
		var ele=eles[i];
		if(DOM.isFirstChild(ele)){
			a.push(ele);
		}			
	}
	return a;	
}


//12 在所有的元素节点集eles中，找出所有的幼子
DOM.getLastEles=function(eles){
	
	var a=[];
	for(var i=0;i<eles.length;i++){
		var ele=eles[i];
		if(DOM.isLastChild(ele)){
			a.push(ele);
		}			
	}
	return a;	
}

//13、获得ele指定标签名为tag的子元素。tag参数如果不传，则表示获取ele的所有子元素
//如果不考虑注释节点，直接用children属性效率更高
DOM.getChildren=function (ele,tag){
	var children=ele.childNodes;//先把ele所有子节点取到
	if(typeof tag=='string'){
			tag=tag.toUpperCase();
			var a=[];
			for(var i=0;i<children.length;i++){//做循环
				var node=children[i];
				if(node.nodeType==1&&node.nodeName==tag){
					//如果当前这个子元素的“节点类型"是1 并且 节点名是tag的值
					a.push(node);//则把此子节点放到数组里			
				}		
			}
			return a;
			
	}else if(typeof tag=='undefined'){
			var a=[];
			for(var i=0;i<children.length;i++){//做循环
				var node=children[i];
				if(node.nodeType==1){
					a.push(node);//则把此子节点放到数组里			
				}		
			}
			return a;
	}else{
		throw new Error('tag参数类型错误！');	
	}	
}

//14 获取元素ele的索引号
DOM.getIndex=function (ele){
	var nIndex=0;
	var p=ele.previousSibling
	while(p){
		if(p.nodeType==1){//如果这个哥哥是元素节点，则
			nIndex++;//让累加一次
		}			
		p=p.previousSibling;//继续判断它的下一个哥哥		
	}
	return nIndex;	
}

//15 给ele元素增加类样式
DOM.addClass=function (ele,strClass){
	var reg=new RegExp("\\b"+strClass+"\\b");
	if(reg.test(ele.className)){
		//如果此类样式已经存在，则什么也不需要做
	}else{//不存在
		ele.className=ele.className.trim()+" "+strClass;
	}
}


//16，判断某元素上是不是有某个类
//判断某元素上是不是有某个类
DOM.hasClass=function(ele,strClass){
	if(!(ele&&ele.nodeType==1))	throw new Error('第一参数ele需要是一个DOM元素对象');
	if(typeof strClass != 'string')	throw new Error('第二参数必须为string类型');			
	var reg=new RegExp("\\b"+strClass+"\\b");
	return reg.test(ele.className);				
}

//17 给ele元素移除类样式
DOM.removeClass=function (ele,strClass){
	if(!(ele&&ele.nodeType==1)){	
		alert('第一参数ele需要是一个DOM元素对象');
		throw new Error('第一参数ele需要是一个DOM元素对象');
	}
	if(typeof strClass != 'string'){
		alert('第二参数必须为string类型');
		throw new Error('第二参数必须为string类型');
		
	}
	
	var reg=new RegExp("\\b"+strClass+"\\b",'g');	
	ele.className=ele.className.replace(reg,'').trim();	
}

//18 通过类名获取一组元素。类名可以是多个，比如第一个参数是"a1 a2 a3",则表示获取类名即是a1,还要是a2,a3的元素（交集）
DOM.getElesByClass=function (strClass,contextEle){
	if(typeof strClass!='string'){
		alert('第一个参数错误！');	
		throw new Error('第一个参数strClass错误!')
	}
	
		function getEle(strClass,eles){//获取只包括一个类的函数
			var a=[];
			var reg=new RegExp('\\b'+strClass+'\\b');
			for(var i=0;i<eles.length;i++){			
					if(reg.test(eles[i].className)){
						a.push(eles[i]);			
					}
			}
			return a;
		}
		//以上这些是个单独的模块	
	contextEle=contextEle||document;
	if(contextEle.nodeType!=1&&contextEle.nodeType!=9){
		alert('第二个参数错误！');	
		throw new Error('第二个参数contextEle错误!');
	}
	if(contextEle.getElementsByClassName){
		return contextEle.getElementsByClassName(strClass);	
	}else{
		var aClass=[];
		aClass=strClass.split(' ');		
		var eles=contextEle.getElementsByTagName('*');
		for(var i=0;i<aClass.length;i++){	
				if(aClass[i].replace(/\s/g,'').length>0)	
					eles=getEle(aClass[i],eles);
			}
		return eles;
	}
}

//19 获取某元素距离浏览器的绝对位置,相当于jQuery中的offset
DOM.offset=function (ele){
 //1 获取html左边框和上边框分别距离屏幕最左侧和最上方的距离 
    var bLeft= utils.getCsss(document.documentElement,"marginLeft"),bTop=utils.getCsss(document.documentElement,"marginTop");
    if(curEle==document.documentElement)  return {left:bLeft,top:bTop};           
    //2 获取body左边框和上边框分别距离屏幕最左侧和最上方的距离  
    var hLeft = utils.getCsss(document.documentElement,"marginLeft")+utils.getCsss(document.documentElement,"borderLeftWidth")+utils.getCsss(document.documentElement,"paddingLeft")+utils.getCsss(document.body,"marginLeft");
    var hTop = utils.getCsss(document.documentElement,"marginTop")+utils.getCsss(document.documentElement,"borderTopWidth")+utils.getCsss(document.documentElement,"paddingTop")+utils.getCsss(document.body,"marginTop");
    if(curEle==document.body) return {left:hLeft,top:hTop}; 
    var tempPar=par = curEle.parentNode,  pos = utils.getCsss(par,"position");
    tempPar.style.position="static";//将父元素统一设置为不定位                                          
    var totalLeft =curEle.offsetLeft,totalTop = curEle.offsetTop;
    if(/Firefox/.test(navigator.userAgent)){                
            totalLeft+= utils.getCsss(document.documentElement,"marginLeft")-document.body.offsetLeft;
            totalTop+= utils.getCsss(document.documentElement,"marginTop")-document.body.offsetTop;                
    }else if(/(MSIE\s(8.0|9.0|10.0))|(rv:\d+\.\d\)\slike Gecko)/.test(navigator.userAgent)){                
                                
    }else if(/MSIE\s(5.0|6.0|7.0)/.test(navigator.userAgent)){                                  
            while (par){ //直到html为止                                    
                    totalLeft += par.clientLeft+par.offsetLeft;  
                    totalTop += par.clientTop+par.offsetTop;
                    curEle = par;
                    par = par.offsetParent;                        
            } 
    }else{
            totalLeft +=utils.getCsss(document.documentElement,"marginLeft");
            totalTop +=utils.getCsss(document.documentElement,"marginTop");
    }
    tempPar.style.position=pos;//恢复原来的样式
    return {left:totalLeft,top:totalTop};       	
}
//20 设置CSS样式
DOM.setCss=function (ele,attr,svalue){
	with(ele){//理解with的用法，这样就把ele当前当前的作用域了，不必在写每一个CSS属性之前再写ele.了
		switch(attr){
			case 'float'://处理float的兼容性问题
					style['cssFloat']=svalue;				
					style['styleFloat']=svalue;
				break;
			case 'opacity':	//处理不透明度的兼容性问题
		//这儿还应该处理一下，因为opacity的值是介于0和1之间的
					svalue=Math.max(0,svalue);
					svalue=Math.min(1,svalue);	
					style['opacity']=svalue;
					style['filter']="alpha(opacity:"+svalue*100+")";		
				break;
			case 'width':
			case 'height':
			case 'borderLeftWidth':
			case 'paddingLeft':
			case 'paddingBottom':
			case 'paddingTop':
			case 'paddingRight':
			//这些css属性值的特点就是都不能为负数，所以会用max方法运算一下
			var reg=/^(-?\d+(?:\.\d+)?)(pt|px|em|in)?$/;
			//这个正则相对要完善一点，可以判断带小数的
			if(reg.test(svalue)){
				var num=RegExp.$1;//取出第一个分组
				var danwei=RegExp.$2;//取出第二个分组：单位部分
				num=Math.max(0,num);//如果传进来的值是负数，则用0
				if(danwei)//如果有单位，则加上单位，如果没有单位，则以px为默认单位
					svalue=num+danwei;
				else
					svalue=num+'px';
			}
				style[attr]=svalue;
				break;
			case 'top':
			case 'marginLeft':
			case 'marginRight':
			case 'marginTop':
			case 'marginBottom':
			case 'right':
			case 'left':
			var reg=/^(-?\d+(?:\.\d+)?)(pt|px|em|in)?$/;
			//这个正则相对要完善一点，可以判断带小数的了.
			//这个正则可以处理象：2.5em,22px,22,3pt,-10.6in这样的css单位
			if(reg.test(svalue)){
				//如果符合此正则，则按以下方式处理
				var num=RegExp.$1;
				var danwei=RegExp.$2;				
				if(danwei)
					//如果是带单位的，则加上单位
					svalue=num+danwei;
				else
					//如果不带单位，则用默认的单位px
					svalue=num+'px';
			}
				style[attr]=svalue;
				break;
			default:
				style[attr]=svalue;
		}		}};
/* 21 setGrounpCss方法：批量设置css属性的方法
（就是一次给一个或多个元素的多个CSS属性设置值）
第一个参数ele可以是一个元素节点，也可以是多个可以。
第二个参数类似这样：
{height:100,float:'left',width:300,opacity:0.5,lineHeight:'1.5em'}
其实原理就是循环调用上边的setCss方法  */
DOM.setGrounpCss=function(ele,oCss){
	if(typeof oCss=='object')
	if(ele&&ele.nodeType&&ele.nodeType===1){
		for(var attr in oCss){	//用for in循环来遍历JSON对象集合
			DOM.setCss(ele,attr,oCss[attr]);		}
	}else if(ele&&ele.length&&ele.length>0){
		//如果ele一个元素集合，则做两重循环
		for(var i=0;i<ele.length;i++){			
			for(var attr in oCss){	DOM.setCss(ele[i],attr,oCss[attr]);	}			
		}
	}	
};

//22 获取某个元素ele的演示attr
DOM.getCss=function(ele,attr){
	//此方法用来获取网页元素的CSS属性的值，是固定的知识点。
	//此方法不但可以获取行内样式，还可以获取内嵌和外链的样式
	//ele.currentStyle?ele.currentStyle[attr]属性是IE8及其以下版本浏览器的
	//getComputedStyle(ele,false)[attr];是IE9及其以上版本和其他浏览器的方法
	if(ele&&ele.nodeType&&ele.nodeType===1&&attr&&typeof attr=='string'){
	return ele.currentStyle?ele.currentStyle[attr]:getComputedStyle(ele,null)[attr];
	}else{	  
		throw new Error('参数错误！！');
		}
	};

//23 用来把NodeList转换为数组类型的作用
DOM.domToArray=function (eles){
	try{
		var a=Array.prototype.slice.call(eles,0);
	}catch(e){
		var a=[];
		for(var i=0;i<eles.length;i++){
			a.push(eles[i]);			
		}		
	}
	return a;

}

