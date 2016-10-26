var aEffect=['Linear','easeIn'];
var ele=document.getElementById('idMove');
var oPlay=document.getElementById('play');
var oRunCode=document.getElementById('runCode');
function callback(){this.style.backgroundColor='green';}
oPlay.onclick=function(e){//事件委托
	var e=e||event;
	var t=e.target||e.srcElement;
	var nDuration=parseFloat(idSpeed.value)?parseFloat(idSpeed.value):1000;
	//name="vTween" type="radio"
	if(t.type=='radio'){
		if(t.name=='vTween'){
			aEffect[0]=t.value;
			
			drawLine(aEffect);//画函数曲线
		}else if(t.name=='vEase'){
			aEffect[1]=t.value;
			drawLine(aEffect);//画函数曲线
		}
	}else if(t.id=='idRun'){
		ele.style.left=0;
		ele.style.backgroundColor='blue';
		animate(ele,{left:600},nDuration,aEffect,callback);
	}
	oRunCode.value="animate(ele,{left:600},"+nDuration+",['"+aEffect[0]+"','"+aEffect[1]+"'],callback)";	
};
function drawLine(arr){//画函数曲线
	if(arr[0]=='Linear'){
		var fn=animate()[arr[0]]
	}else{
		var fn=animate()[arr[0]][arr[1]];
	}
	var strHTML='';
	var oChart=document.getElementById('idChart');
	oChart.innerHTML=''
	for(var i=0;i<648;i++ ){
		var y=fn(i,0,200,648);
		//i是x轴，即为时间轴 长度是648（其实应该是650）
		//y是运动的距离 长度是200px
		//可以理解为在648个时间单位内，走完200个距离单位
		strHTML+="<div class='runLine' style='top:"+(200-y)+"px;left:"+i+"px;'></div>"
    }
    oChart.innerHTML+=strHTML;
}
drawLine(aEffect);//画函数曲线