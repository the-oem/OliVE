<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="com.readytalk.olive.util.Attribute"%>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Forgot Password? | The Online Video Editor</title>

<link rel="shortcut icon" href="/olive/images/olive.ico" />

<link rel="stylesheet" type="text/css" href="/olive/css/reset.css" />
<link rel="stylesheet" type="text/css"
	href="/olive/scripts/jquery-ui-1.8.9.custom/css/custom-theme/jquery-ui-1.8.11.custom.css" />
<link rel="stylesheet" type="text/css" href="/olive/css/master.css" />
<link rel="stylesheet" type="text/css" href="/olive/css/account.css" />
<link href="http://fonts.googleapis.com/css?family=Lato:%20regular,bold"
	rel="stylesheet" type="text/css">


<script src="/olive/scripts/jquery-1.5.min.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.9.custom/js/jquery-ui-1.8.9.custom.min.js"></script>
<script src="/olive/scripts/master.js"></script>
<script src="/olive/scripts/account.js"></script>
<script src="/olive/scripts/google-analytics.js"></script>
</head>
<body>
<%
	Boolean isSafe = (Boolean) session.getAttribute(Attribute.IS_SAFE
			.toString());
	Boolean isCorrect = (Boolean) session
			.getAttribute(Attribute.IS_CORRECT.toString());
	String username = (String) session.getAttribute(Attribute.USERNAME
			.toString());
	String securityQuestion = (String) session
			.getAttribute(Attribute.SECURITY_QUESTION.toString());
	String confirmation = "";
	if (isCorrect == null) {
		confirmation = "";
	} else if (isCorrect == false) {
		if (isSafe == null) {
			confirmation = "";
		} else if (isSafe) {
			confirmation = "Answer does not match database records";
		} else {
			confirmation = "Unsafe input";
		}
	} else if (isCorrect) {
		confirmation = "";
		response.sendRedirect("new-password-form.jsp");
	}
	session.removeAttribute(Attribute.IS_SAFE.toString());
	session.removeAttribute(Attribute.IS_CORRECT.toString());
%>
<div id="header">
<div id="header-left"><a href="projects.jsp"><img
	id="olive-icon" src="/olive/images/olive.png" alt="" /></a>
<h1 id="olive-title"><a href="projects.jsp">Olive</a></h1>
</div>
<!-- end #header-left -->
<div id="header-right">
<div><strong><a href="index.jsp">Home</a></strong>&nbsp;&nbsp;&nbsp;&nbsp;<span
	id="help-dialog-opener"><a href="">Help</a></span>&nbsp;&nbsp;&nbsp;&nbsp;<span
	id="about-dialog-opener"><a href="">About</a></span></div>
</div>
<!-- end #header-right --></div>

<!-- end #header -->

<div class="clear"></div>

<div id="main">
<div id="edit-account-container">
<h2>Forgot Password?</h2>
<div class="edit-name-container">
<p>Welcome <%=username%>. Please enter the answer you gave for your
security question. Thank you</p>
<!-- end #about-title -->

<form id="security-question-form-2" action="OliveServlet" name="process"
	method="post">
<p>Security Question:<br />
<%=securityQuestion%></p>
<p><label for="security_answer">Security Answer</label><br />
<input type="text" name="security_answer" id="security_answer" value=""
	size="32" maxlength="128" /></p>
<input type="hidden" name="FormName" value="security-question-form-2" /><br />
<input type="submit" value="Recover Password" /><span><%=confirmation%></span>
</form>
</div>
</div>
<!-- end #main --></div>

<!-- Everything below this line will be hidden and inserted in pop-ups. -->
<div id="shared-dialogs" class="hidden"></div>

</body>
</html>