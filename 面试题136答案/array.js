	 // 一、位置方法
    //1 indexOf
     Array.prototype.myIndexOf = function myIndexOf(item,start) {
        if ("indexOf" in Array.prototype) {
            return this.indexOf(item,start);
        }
        //IE6~8下自己编写回调执行的逻辑
        var len = this.length >>> 0;  
        // 索引必须为整数，忽略小数尾数
        var start = parseInt(start) || 0;                          
        // 当索引小于0时，加上一次数组长度
        start = start < 0 ? start + len : start;                         
        for (; start < len; start++){
            if (start in this && this[start] === item)  return start;
        }
        return -1;
    };   
     //2 lastIndexOf
     Array.prototype.myLastIndexOf = function myLastIndexOf(item,start) {
        if ("lastIndexOf" in Array.prototype) {
            return this.lastIndexOf(item,start);
        }
        //IE6~8下自己编写回调执行的逻辑
        var len = this.length >>> 0;  
        // 索引必须为整数，忽略小数尾数
        var start = parseInt(start) || len-1;                          
        // 当索引小于0时，加上一次数组长度
        start = start < 0 ? start + len : start;                         
        for (; start >=0; start--){
            if (start in this && this[start] === item)  return start;
        }
        return -1;
    };                    
    // 二、迭代方法
    // 1 every
    Array.prototype.myEvery = function myEvery(callBack, context) {
        context = context || window;
        if ("every" in Array.prototype) {
            this.every(callBack, context);
            return;
        }
        //IE6~8下自己编写回调执行的逻辑
        for (var i = 0, len = this.length; i < len; i++) {
            if (typeof callBack === "function") {
                var val = callBack.call(context, this[i], i, this);
                if(!val) return false;
            }           
        }  
         return true;
    }; 
    // 2 some 
	Array.prototype.mySome = function mySome(callBack, context) {
        context = context || window;
        if ("some" in Array.prototype) {
            this.some(callBack, context);
            return;
        }
        //IE6~8下自己编写回调执行的逻辑
        for (var i = 0, len = this.length; i < len; i++) {
            if (typeof callBack === "function") {
                var val = callBack.call(context, this[i], i, this);
                if(val) return true;
            }           
        }  
         return false;
    };  
    //3 filter
    Array.prototype.myFilter = function myFilter(callBack, context) {
        context = context || window;
        if ("filter" in Array.prototype) {
            this.filter(callBack, context);
            return;
        }
        //IE6~8下自己编写回调执行的逻辑
        var newAry = [];
        for (var i = 0, len = this.length; i < len; i++) {
            if (typeof callBack === "function") {
                var val = callBack.call(context, this[i], i, this);
                if(val) newAry[newAry.length] = this[i];;
            }            
        }
        return newAry;
      };	
      //4 map 
     Array.prototype.myMap = function myMap(callBack, context) {
        context = context || window;
        if ("map" in Array.prototype) {
            return this.map(callBack, context);
        }
        //IE6~8下自己编写回调执行的逻辑
        var newAry = [];
        for (var i = 0, len = this.length; i < len; i++) {
            if (typeof callBack === "function") {
                var val = callBack.call(context, this[i], i, this);
                newAry[newAry.length] = val;
            }
        }
        return newAry;
    };
    //5 foreach
   Array.prototype.myForEach = function myForEach(callBack, context) {
        context = context || window;
        if ("forEach" in Array.prototype) {
            this.forEach(callBack, context);
            return;
        }
        //IE6~8下自己编写回调执行的逻辑
        for (var i = 0, len = this.length; i < len; i++) {
        	if (typeof callBack === "function") {
                callBack.call(context, this[i], i, this);
            }            
        }
    };
 
   //三、归并方法
    //1 reduce
    Array.prototype.myReduce = function myReduce(callBack, start) {
        var len=arguments.length;
        if ("reduce" in Array.prototype) {
            return len===1?this.reduce(callBack):this.reduce(callBack,start);
        }
        //IE6~8下自己编写回调执行的逻辑
        var that=this;
        function preFn(n){
                if(len===1){
                    if(n<=1) return that[0]; 
                }else{
                    if(n<=0) return start; 
                }                               
                    return callBack(preFn(n-1),that[n-1], n-1, that);
        }                       
        var num=this.length-1;
        return callBack( preFn(num),this[num], num, this); 
    };
    //2 reduceRight
     Array.prototype.myReduceRight = function myReduce(callBack, start) {
        var len=arguments.length;
        if ("reduceRight" in Array.prototype) {
            return len===1?this.reduceRight(callBack):this.reduceRight(callBack,start);
        }
        //IE6~8下自己编写回调执行的逻辑        
        var that=this.reverse();
        function preFn(n){
                if(len===1){
                    if(n<=1) return that[0]; 
                }else{
                    if(n<=0) return start; 
                }                               
                    return callBack(preFn(n-1),that[n-1], n-1, that);
        }                       
        var num=that.length-1;
        return callBack( preFn(num),that[num], num, that); 
    };