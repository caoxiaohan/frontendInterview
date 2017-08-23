<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title>网页标题</title>
</head>
<body>
<?php


if( $_POST )	//如果有post数据
{
	$data1 = $_POST['n1'];		//相应接收每个表单项的数据值
	$data2 = $_POST['n2'];		//特别注意：表单项的值字符串类型
	$fuhao = $_POST['operator'];
	if( is_numeric($data1) && is_numeric($data2) )	//$data1是数字 并且 $data2 是数字
	{	//开始计算
		switch($fuhao){
			case "+":
				$result = $data1 + $data2;
				break;
			case "-":
				$result = $data1 - $data2;
				break;
			case "*":
				$result = $data1 * $data2;
				break;
			case "/":
				if($data2 == 0){
					$result = "除数不能为0";
				}
				else{
					$result = $data1 / $data2;
				}
				break;
		}
		echo "计算结果为： $result";
	}
	else{	//否则：
		echo "请输入数字进行计算";
	}
}
else{
	echo "请从正确的页面输入数据并提交！";
}
?>
</body>
</html>
