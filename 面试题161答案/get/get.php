<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title>网页标题</title>
</head>
<body>
	<form  action="getData.php"  method="get" >
		项目1： <input type="text"   name="uName"   />
		项目2： <input type="password"   name="uPswd"   />
		项目3： <input type="text"   name="age"   />
		<br />
		爱好：
			<input type="checkbox" name="hobby[]" value="足球" />足球
			<input type="checkbox" name="hobby[]" value="篮球" />篮球
			<input type="checkbox" name="hobby[]" value="中国足球" />中国足球
		<br />
		<input type="submit"  value="提交"  />
	</form>
	<hr />
	<a  href="getData.php?uName=test1&uPswd=123"  > 文字。。。</a>
</body>
</html>
