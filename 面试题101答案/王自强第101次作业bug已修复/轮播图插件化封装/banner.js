/**
 * Created by wzq on 2016/11/15.
 */
~function(){
    //1.ʵ�����ݰ󶨣�Ajax�������ݣ������ַ���ƴ�ӵķ�ʽ������
    var oSlide = document.getElementById("slide"),
        oSlideInner =utils.children(oSlide,"ul")[0],
        oSlideTip=utils.children(oSlide,"div")[0],
        oSlideLink=utils.children(oSlide,"a"),
        oSlideLeft= oSlideLink[0],
        oSlideRight=oSlideLink[1];
    var oLis=oSlideInner.getElementsByTagName("li"),
        oImgs=oSlideInner.getElementsByTagName("img"),
        oTips=oSlideTip.getElementsByTagName("a");



    console.log(oTips);
    var jsonDate=null;
    ~function(){
        var xhr = new XMLHttpRequest;
        xhr.open("get", "json/banner.txt?_=" + Math.random(), false);
        xhr.onreadystatechange=function(){
            if(xhr.readyState===4 && /^2\d{2}$/.test(xhr.status)){
                jsonDate=utils.toJSON(xhr.responseText)
                console.log(xhr.responseText)
            }
        };
        xhr.send(null);
    }();
    ~function(){
        var str='';
        var str2='';
        console.log(jsonDate)
        if(jsonDate){
            for(var i= 0,len=jsonDate.length;i<len;i++){
                var curDate=jsonDate[i];
                str+="<li><a href='javascript:void(0);'><img src='' tureImg='"+curDate["img"]+"'/></a></li>"
                i===0?str2+="<a class='active' href='javascript:void(0);'></a>":str2+="<a href='javascript:void(0);'></a>"
            }
        }
        oSlideInner.innerHTML=str;
        oSlideTip.innerHTML=str2;

        var baseWidth = oLis[0].offsetWidth;		//һ��li�Ŀ��
        //����
        var oImgList = oLis[0].cloneNode(true);
        oSlideInner .appendChild(oImgList);
        oSlideInner .style.width = baseWidth * oLis.length + 'px';

    }();
//3.ͼƬ�ӳټ���
    window.setTimeout(lazyImg,500);
    function lazyImg(){
        for(var i= 0,len=oImgs.length;i<len;i++){

            ;(function(i){
                var curImg=oImgs[i];
                var oImg=new Image;
                oImg.src=curImg.getAttribute("tureImg");
                oImg.onload=function(){
                    curImg.src=this.src;
                    curImg.style.display="black";
                    oImg=null;
                    animate(curImg,{opacity:1},500);

                };
            })(i)
        }
    };

   // 4.ʵ�ֽ����ֲ�
    for(var i=0;i<oTips.length;i++){
        oTips[i].n=i;
        oTips[i].onclick=function(){
            animate(oSlideInner,{left:this.n*-930},700,1)
            step=this.n;//ȷ���´ζ�����ͣ����һҳ
            selector();

            //window.clearInterval(timer);//���ʱ�������
            //timer= window.setTimeout(function(){//�����֮��ͣ���룬Ȼ����ÿ�������˶�һ��
            //    //ʹ��setTimeout��setInterval���ϵķ�ʽ
            //    timer=window.setInterval(autoMove,1000)
            //},2000)
        }
    }

    //5.�Զ��ֲ��޷�Խ�
    var step=0;
    function autoMove(){
        step++;
        if(step>oTips.length){
            oSlideInner.style.left=0;//������ʽ����˲���oInner��ԭ����λ���л�����0��
            step=1;//������һ�ſ�ʼ
        }
        animate(oSlideInner,{left:step*-930},700,1)
        selector();
    }
   var timer= window.setInterval(autoMove,1000);


    oSlide.onmouseover=function(){
        window.clearInterval(timer);
    }
    oSlide.onmouseout=function(){
        timer= window.setInterval(autoMove,1000);
    }
   //6�������
   // function selector(n){
   //     for(var i=0;i<oTips.length;i++){
   //         oTips[i].className="";
   //         if(n==oTips.length){
   //             n=0;
   //         }
   //         oTips[n].className="active";
   //     }
   // }
   //7.�����ֲ�
    function selector(){
        for(var i=0;i<oTips.length;i++){
            if(step==oTips.length){
                utils.addClass(oTips[0],"active")
            }
            i===step?utils.addClass(oTips[i],"active"):utils.removeClass(oTips[i],"active");
        }
    }
    oSlideRight.onclick=autoMove;
    oSlideLeft.onclick=function(){
        step--;
        if(step<0){
            step=oTips.length;
            utils.setCss(oSlideInner,"left",step*-930);
            step=oTips.length-1;
        }

        animate(oSlideInner,{left:step*-930},700,1);
        selector();
    };
}();