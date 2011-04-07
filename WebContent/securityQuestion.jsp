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
	href="/olive/scripts/jquery-ui-1.8.9.custom/css/custom-theme/jquery-ui-1.8.11.custom.css"/>
<link rel="stylesheet" type="text/css" href="/olive/css/master.css" />
<link rel="stylesheet" type="text/css" href="/olive/css/account.css" />
<link href='http://fonts.googleapis.com/css?family=Lato: regular,bold' rel='stylesheet' type='text/css'>


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
	String username = (String) session.getAttribute(Attribute.USERNAME.toString());
	String securityQuestion = (String) session.getAttribute(Attribute.SECURITY_QUESTION.toString());
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
<div id="header-left">
<img id="olive-icon"
	src="/olive/images/olive.png" />
<h1 id= "olive-title">Olive</h1>
</div>
<!-- end #header-left -->
<div id="header-right">
<div><strong><a href="index.jsp">Home</a></strong>&nbsp;<span
	id="help-dialog-opener"><a href="">Help</a></span></div>
</div>
<!-- end #header-right --></div>

<!-- end #header -->

<div class="clear"></div>

<div id="main">
<div id="edit-account-container">
<h2>Forgot Password?</h2>
<p>Welcome <%=username%>. Please enter the answer you gave for your security question.
Thank you</p>
<!-- end #about-title -->

<form id="security-question-form-2" action="OliveServlet" name="process"
	method="post">
<p>Security Question:<br />
<%=securityQuestion%>
</p>
<p><label for="security_answer">Security Answer</label><br />
<input type="text" name="security_answer" id="security_answer"
	value="" size="32" maxlength="128" /></p>
<input type="hidden" name="FormName" value="security-question-form-2"></input><br />
<input type="submit" value="Recover Password" /><span><%=confirmation%></span>
</form>
</div>
<!-- end #main --></div>

<div id="footer"></div>

<!-- Everything below this line will be hidden and inserted in pop-ups. -->
<div id="help-dialog" class="hidden" title="How to use Olive">
<ul>
	<li>1. Create a new account.</li>
	<li>2. Create a new project.</li>
	<li>3. Upload your videos.</li>
	<li>4. Edit your videos.</li>
	<li>5. Export to your computer.</li>
</ul>
</div>

</body>
</html>