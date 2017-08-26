~function(){
	function ajax(json){
		//第一步：创建xhr对象
		var xhr = null;
		if(window.XMLHttpRequest){//标准的浏览器
			xhr = new XMLHttpRequest();
		}else{
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
		//第二步：准备发送前的一些配置参数
		var type = json.type == 'get'?'get':'post';
		var flag = json.asyn == 'true'?'true':'false';
		xhr.open(type,json.url,flag);

		//第三步：执行发送的动作
		if(type == 'get'){
		   xhr.send(null);
		}else if(type == 'post'){
		   xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		   xhr.send(json.param);
		}

		//第四步：指定回调函数
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				var data = json.dataType == 'xml'?xhr.responseXML:xhr.responseText;
				if(typeof json.success == 'function') json.success(data);
			}else{
				if(typeof json.failure == 'function') json.failure();			
			}
		}
	}
	window.ajax = ajax;
}();