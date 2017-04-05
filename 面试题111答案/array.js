	Array.prototype.myEvery = function myEvery(callBack, context) {
        context = context || window;
        if ("forEach" in Array.prototype) {
            this.forEach(callBack, context);
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
	Array.prototype.mySome = function mySome(callBack, context) {
        context = context || window;
        if ("forEach" in Array.prototype) {
            this.forEach(callBack, context);
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
    Array.prototype.myFilter = function myFilter(callBack, context) {
        context = context || window;
        if ("forEach" in Array.prototype) {
            this.forEach(callBack, context);
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