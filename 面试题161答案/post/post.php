<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title>网页标题</title>
</head>
<body>
	<form  action="postData.php"  method="post" >
		<input type="text"   name="n1"   />
		<select name="operator" >
			<option value="+" >+</option>
			<option value="-" >-</option>
			<option value="*" >*</option>
			<option value="/" >/</option>
		</select>
		<input type="text"   name="n2"   />
		<input type="submit"  value="提交"  />
	</form>
</body>
</html>
