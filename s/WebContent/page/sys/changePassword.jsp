<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>修改密码</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

	<script> 
		 
		function changePasswordOnServer(oldpassword, newpassword){
			var serverAccess = new ServerAccess();
			var requestParam ={
					serviceName:"user", 
					waitingBarParentId : "bobyId",
					funcName : "changePassword",  
					successFunc : function(obj){ 
						var info = obj.result.info; 
						alert(info);
					},
					args : {requestParam:cmnPcr.jsonToStr({
						oldpassword: oldpassword,
						newpassword: newpassword
					})}
				};
			serverAccess.request(requestParam); 
		}
	
		//获取预览数据
		$(document).ready(function(){
			$("#changePasswordBtn").click(function(){
				var oldpassword = $("#oldpasswordTextboxId").val();
				var newpassword = $("#newpasswordTextboxId").val();
				var confirmpassword = $("#confirmpasswordTextboxId").val();
				
				if(oldpassword == "" || newpassword == "" || confirmpassword == ""){
					alert("请输入完整，密码不允许为空!");
				}
				else if(newpassword != confirmpassword){
					alert("新密码两次输入不同!");
				}
				else{
					changePasswordOnServer(oldpassword, newpassword);
				}
			});
			return false;
		});
	</script>
</head>  
<body id="bodyId" style="text-align:center;">
	<table style="width:100%;height:100%;font-size:14px;" cellspacing="0" cellpadding="0">
		<tr style="height:50px;">
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:50px;">
			<td>&nbsp;</td> 
			<td colspan="2" style="font-size:18px;font-weight:800;border-bottom:solid 1px #DDDDDD;">修改密码</td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:10px;">
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:30px;">
			<td>&nbsp;</td> 
			<td style="width:150px;text-align:right;" >原密码：</td> 
			<td style="width:200px;text-align:left;" ><input id="oldpasswordTextboxId" type="password" style="width:150px;"/></td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:30px;">
			<td>&nbsp;</td> 
			<td style="width:150px;text-align:right;" >新密码：</td> 
			<td style="width:200px;text-align:left;" ><input id="newpasswordTextboxId" type="password" style="width:150px;"/></td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:30px;">
			<td>&nbsp;</td> 
			<td style="width:150px;text-align:right;" >确认新密码：</td> 
			<td style="width:200px;text-align:left;" ><input id="confirmpasswordTextboxId" type="password" style="width:150px;"/></td> 
			<td>&nbsp;</td> 
		</tr> 
		<tr style="height:10px;">
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
		</tr>
		<tr style="height:30px;">
			<td>&nbsp;</td> 
			<td colspan="2" style="font-size:14px;font-weight:800;border-top:solid 1px #DDDDDD;"><a id="changePasswordBtn" href="#" >提&nbsp;交</a></td> 
			<td>&nbsp;</td> 
		</tr>
		<tr>
			<td>&nbsp;</td> 			
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
			<td>&nbsp;</td> 
		</tr>
	</table> 
</body>	 
</html>