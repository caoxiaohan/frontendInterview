/**
 * Created by wzq on 2016/11/16.
 */
~function(){
    function AutoBanner(curEleId,ajaxURL,inteval){
        this.oSlide = document.getElementById(curEleId);
        this.oSlideInner = utils.children(this.oSlide, "ul")[0];
        this.oSlideInner2 = utils.first(this.oSlide);
        this.oSlideTip = utils.children(this.oSlide, "div")[0];
        this.oSlideLink = utils.children(this.oSlide, "a");
        this.oSlideLeft = this.oSlideLink[0];
        this.oSlideRight = this.oSlideLink[1];
        //this.oLis = oSlideInner.getElementsByTagName("li");
        //this.oImgs = oSlideInner.getElementsByTagName("img");
        //this.oTips = oSlideTip.getElementsByTagName("a");
        this.oLis = this.oSlideInner.getElementsByTagName("li");        
        this.oImgs = this.oSlideInner.getElementsByTagName("img");        
        this.oTips = this.oSlideTip.getElementsByTagName("a");
        this.inteval=inteval||1000;
        this.jsonDate=null;
        this.ajaxURL=ajaxURL;
        this.timer=null;
        this.step = 0;
        return this.init();
    }
    AutoBanner.prototype={
        constructor:AutoBanner,
        //-->1.ajax»ñÈ¡Êý¾Ý£»
         getDate: function () {
            var _this = this;
            var xhr = new XMLHttpRequest;
            xhr.open("get", this.ajaxURL + "?_=" + Math.random(), false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                    _this.jsonDate = utils.toJSON(xhr.responseText);
                }
            };
            xhr.send(null);
        },
        //-->2.×Ö·û´®°ó¶¨Êý¾Ý£»
        bindDate:function(){
            var str='',str2='';
            if(this.jsonDate){
                for(var i= 0,len=this.jsonDate.length;i<len;i++){
                    var curDate=this.jsonDate[i];
                    str+="<li><a href='javascript:void(0);'><img src='' tureImg='"+curDate["img"]+"'/></a></li>"
                    i===0?str2+="<a class='active' href='javascript:void(0);'></a>":str2+="<a href='javascript:void(0);'></a>"
                }
            }
            this.oSlideInner.innerHTML=str;
            this.oSlideTip.innerHTML=str2;

            var baseWidth = this.oLis[0].offsetWidth;		//Ò»¸öliµÄ¿í¶È
            //¸´ÖÆ
            var oImgList = this.oLis[0].cloneNode(true);
            this.oSlideInner .appendChild(oImgList);
            //this.oSlideInner .style.width = baseWidth * oLis.length + 'px';
            this.oSlideInner .style.width = baseWidth * this.oLis.length + 'px';
        },

        //-->3.Í¼Æ¬ÑÓ³Ù¼ÓÔØ
        //window.setTimeout(lazyImg,500);
        lazyImg:function() {
            var _this = this;
            for (var i = 0, len = this.oImgs.length; i < len; i++) {
                ;
                (function (i) {
                    var curImg = _this.oImgs[i];
                    var oImg = new Image;
                    oImg.src = curImg.getAttribute("tureImg");
                    oImg.onload = function () {
                        curImg.src = this.src;
                        curImg.style.display = "black";
                        oImg = null;
                        animate(curImg, {opacity: 1}, 500);
                    };
                })(i)
            }
        },
        // -->4.ÊµÏÖ½¹µãÂÖ²¥
        setBanner:function(){
            var _this=this;
            for(var i=0;i<this.oTips.length;i++){
                this.oTips[i].n=i;
                this.oTips[i].onclick=function() {
                    animate(this.oSlideInner, {left: this.n * -930}, 700, 1)
                    //animate(this, {left: this.n * -930}, 700, 1)
                    this.step = this.n;//È·¶¨ÏÂ´Î¶¯»­»áÍ£ÔÚÄÇÒ»Ò³
                    //this.selector();
                     _this.selector();

                }
            }
        },
        //-->5.×Ô¶¯ÂÖ²¥ÎÞ·ì¶Ô½Ó
        autoMove:function(){
            //function autoMove(){
                this.step++;
                //if(step>oTips.length){
                    if(this.step>this.oTips.length){
                    this.oSlideInner.style.left=0;//Õâ¸ö±í´ïÊ½¿ÉÒÔË²¼ä°ÑoInner´ÓÔ­À´µÄÎ»ÖÃÇÐ»»µ½µÚ0ÕÅ
                    this.step=1;//¶¯»­´ÓÒ»ÕÅ¿ªÊ¼
                }
                animate(this.oSlideInner,{left:this.step*-930},700,1)
                //selector();
                this.selector();
            //}
        },
   // var timer= window.setInterval(autoMove,1000);


    //-->6½¹µã¶ÔÆë
        selector: function () {
            for (var i = 0; i < this.oTips.length; i++) {
                if (this.step == this.oTips.length) {
                    utils.addClass(this.oTips[0], "active")
                }
                i === this.step ? utils.addClass(this.oTips[i], "active") : utils.removeClass(this.oTips[i], "active");

            }

        },

        //-->7.¿ØÖÆ×Ô¶¯ÂÖ²¥£»
        mouseEvent:function(){
            var _this=this;
            this.oSlide.onmouseover=function(){
                window.clearInterval(_this.timer);
            }
            this.oSlide.onmouseout=function(){
                _this.timer= window.setInterval(function(){
                    _this.autoMove();
                },_this.inteval);
            }
        },
        //8.-->×óÓÒÂÖ²¥
        rightLeft: function () {
            var _this = this;
            this.oSlideRight.onclick = function () {
                _this.autoMove();
            }
             this.oSlideLeft.onclick=function(){
            _this.step--;
            if(_this.step<0){
                _this.step=_this.oTips.length;
                //utils.setCss(_this.oSlideInner,"left",step*-930);
                utils.setCss(_this.oSlideInner,"left",_this.step*-930);
                _this.step=_this.oTips.length-1;
            }
         
           //_this.animate(_this.oSlideInner,{left:step*-930},700,1);
           animate(_this.oSlideInner,{left:_this.step*-930},700,1);
                 _this.selector();
        };
    },
        //9.-->ÃüÁîÄ£Ê½
        init:function(){
            var _this=this;
            this.getDate();
            this.bindDate();
            window.setTimeout(function(){
               //this.lazyImg();
               _this.lazyImg();
            },500);
           this.timer= window.setInterval(function(){
               _this.autoMove();
           },this.inteval);
            this.selector();
            this.setBanner();
            this.mouseEvent();
            this.rightLeft();
            return this;
        }
    };
    window.AutoBanner=AutoBanner;
}();
