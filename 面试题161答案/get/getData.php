<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title>网页标题</title>
</head>
<body>
<?php
$v1 = $_GET['uName'];		
//单引号也可以用双引号，本质是一个字符串，其实是数组的键名（下标）

$v2 = $_GET["uPswd"];		
//该键名必须跟提交的时候的名字完全一致（区分大小写）

echo "v1=$v1, v2=$v2";
echo "<hr />";
echo "<pre>";
var_dump($_GET);	//var_dump()用于输出一个变量的“最完整信息”
					//（包括变量名，变量数据值，变量长度（如果有）
					//这里是在试图输出$_GET这个“数组”；
echo "</pre>";

//理解：

?>
</body>
</html>
