function init(){  
     _table=document.getElementById("table");
	 _table.border="1px";
	 _table.width="800px";
	
 	for(var i=1;i<6;i++){
		 var row=document.createElement("tr");  
		 row.id=i;
		 for(var j=1;j<6;j++){
			 var cell=document.createElement("td");  
			 cell.id=i+"/"+j;
			 cell.appendChild(document.createTextNode("第"+cell.id+"列"));  
			 row.appendChild(cell);  
		 }
		 document.getElementById("newbody").appendChild(row);  
	 }
 }  
 
 function rebulid(){
 	var beginRow=document.getElementById("beginRow").value;/*开始行*/
	var endRow=document.getElementById("endRow").value;/*结束行*/
	/*/*/
	var beginCol=document.getElementById("beginCol").value;/*开始列*/
	var endCol=document.getElementById("endCol").value;/*结束列*/
	
    var tempCol=beginRow+"/"+beginCol;/*定位要改变属性的列*/
	alert(tempCol);
	var td=document.getElementById(tempCol);
	for(var x=beginRow;x<=endRow;x++){
		for(var i=beginCol;i<=endCol;i++){
		  if(x==beginRow){
			document.getElementById("table").rows[x].deleteCell(i+1);
		  }
		  else{
		     document.getElementById("table").rows[x].deleteCell(i);
		  }
			
		}
	}
	td.rowSpan=(endRow-beginRow)+1;
}
 /*添加行，使用appendChild方法*/
 function addRow(){
   var length=document.getElementById("table").rows.length;
   /*document.getElementById("newbody").insertRow(length);
   document.getElementById(length+1).setAttribute("id",length+2);*/
   var tr=document.createElement("tr");
   tr.id=length+1;
   var td=document.createElement("td");
   for(i=1;i<4;i++){
   	td.id=tr.id+"/"+i;
	td.appendChild(document.createTextNode("第"+td.id+"列"));
	tr.appendChild(td);
   
   }
  document.getElementById("newbody").appendChild(tr);  
 } 
 
 function addRow_withInsert(){
 	var row=document.getElementById("table").insertRow(document.getElementById("table").rows.length);
	var rowCount=document.getElementById("table").rows.length;
	
	var countCell=document.getElementById("table").rows.item(0).cells.length;
    for(var i=0;i<countCell;i++){
	  var cell=row.insertCell(i);
	 
	  cell.innerHTML="新"+(rowCount)+"/"+(i+1)+"列";
	  cell.id=(rowCount)+"/"+(i+1);
	  
	  }
 }
 
 /*删除行，采用deleteRow(row Index)*/
 function removeRow(){
  /* var row=document.getElementById("2"); 
   var index=row.rowIndex;
   alert(index);*/
   document.getElementById("newbody").deleteRow(document.getElementById(document.getElementById("table").rows.length).rowIndex); 
 }
 
 /*添加列，采用insertCell(列位置)方法*/
 function addCell(){
 /*document.getElementById("table").rows.item(0).cells.length
  用来获得表格的列数
 */
    for(var i=0;i<document.getElementById("table").rows.length;i++){
		var cell=document.getElementById("table").rows[i].insertCell(2);
		cell.innerHTML="第"+(i+1)+"/"+3+"列";
		
	}
 }
 /*删除列，采用deleteCell(列位置)的方法*/
 function removeCell(){
	for(var i=0;i<document.getElementById("table").rows.length;i++){
		document.getElementById("table").rows[i].deleteCell(0);
	}
}