<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<form id="UploadForm" action="CommonsFileUploadServlet" name="process" enctype="multipart/form-data" method="post" >
    <input type="hidden" name="FormName" value="UploadVideo"></input>
    <input type="file" name="file"  />
    <input type="submit"/>
 
</form>
</body>
</html>