    var utils={};
    
    //兼容的获取样式写法
    utils.getCss=function (curEle,attr){
        var val = typeof window.getComputedStyle == "function" ? getComputedStyle(curEle,null)[attr] : curEle.currentStyle[attr];
        if(!isNaN(parseFloat(val))) val = parseFloat(val);
        return val;
    };    
    
    //兼容的获取offsetLeft和offsetTop写法
    utils.offset=function(curEle){  
         var flag=false,parent=par = curEle.parentNode,  pos = utils.getCss(curEle,"position");
         while(parent!==document){
             if(/(relative|absolute|fixed)/.test(utils.getCss(parent,"position"))){
                   flag=true;
                   break;
             }                        
             parent=parent.parentNode;
         }
         //1 当父级元素存在定位时，求当前元素外边框到最近定位父级元素内边框的距离             
         if(flag){
              if(curEle===document.body||curEle===document.documentElement) return {left:0,top:0};     
              //2.1 当父级元素定位时，将当前元素统一设置为不定位后，IE7以下版本跟标准浏览器的结果一致
              curEle.style.position="static";//将子元素统一设置为不定位
              var totalLeft =curEle.offsetLeft,totalTop = curEle.offsetTop;
              while (par!==parent){ //直到最近定位元素为止                                
                  totalLeft += par.clientLeft+par.offsetLeft;  
                  totalTop += par.clientTop+par.offsetTop;
                   par = par.offsetParent;                        
              }   
        }else{//2 当父级元素不做定位时，求当前元素外边框到浏览器原点的垂直距离。
             //2.1 当父级元素不定位是，将当前元素统一设置为定位后，IE7以下版本跟标准浏览器的结果一致
            curEle.style.position="relative";//将子元素统一设置为定位
            var totalLeft =curEle.offsetLeft,totalTop = curEle.offsetTop;
            if(/Firefox/.test(navigator.userAgent)){                
                    totalLeft+= utils.getCss(document.documentElement,"marginLeft")-document.body.offsetLeft;
                    totalTop+= utils.getCss(document.documentElement,"marginTop")-document.body.offsetTop;                
            }else if("ActiveXObject" in window){  //IE浏览器              
                 if(/MSIE\s(5.0|6.0|7.0)/.test(navigator.userAgent)&&document.compatMode==="BackCompat"){
                     totalLeft +=document.body.clientLeft;
                     totalTop +=document.body.clientTop;
                 }              
            }else{//其他标准浏览器chrome/safari/opera
                totalLeft +=utils.getCss(document.documentElement,"marginLeft");
                totalTop +=utils.getCss(document.documentElement,"marginTop");
            }
        }    
        curEle.style.position=pos;//恢复原来的样式                
        return {left:totalLeft,top:totalTop};       
    }   

    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)"