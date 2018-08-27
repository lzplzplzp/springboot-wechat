var is_smallProgram=false;
if(is_smallProgram){//判断是否在小程序运行
	 $('.login_close').hide()
 }else{
	 $('.login_close').show()
 }

 //在微信端显示关联微信
if(is_smallProgram){
    $('.login_footer').show()
}

 var weiXin={};//微信自动登录
 weiXin.nRealLoginType='';//登录类型
 //weiXin.openid=getMmCookie("openid")||'12';//获取openid,模拟浏览器数据
 $(function(){
 	var strOpenIdToken=localStorage.getItem('strOpenIdToken');
     if(is_smallProgram&&strOpenIdToken){
         beforeWeChatLogin();//在小程序，并且有上次登录的strOpenIdToken，进行自动登录
     }
 })

 //微信登录前
 function beforeWeChatLogin() {
     var cdoRequest = new CDO();
     cdoRequest.setStringValue("strServiceName", "LoginService");
     cdoRequest.setStringValue("strTransName", "beforeWeChatLogin");
     if (!is_smallProgram) {//M站登录
         cdoRequest.setStringValue("strLoginId", weiXin.strUserName);
     }
     else {//小程序登录
         if (is_smallProgram && (!localStorage.getItem('strOpenIdToken'))) {//在小程序、首次登录
             cdoRequest.setStringValue("strLoginId", weiXin.strUserName);
         }
     }
	 cdoRequest.setStringValue("strOpenId", weiXin.openid);
	 cdoRequest.setStringValue("strPlatform", "weixin");
	 cdoRequest.setIntegerValue("nWeixinState", 2);
	 EngineClass.raiseTrans(cdoRequest, "callBack_beforeWeChatLogin");
 }
 function callBack_beforeWeChatLogin(request,cdoResponse,ret){
     if (ret == undefined || ret == null) {
         info("请求失败");
         return;
     };
     if (ret.nCode == 0) {
         var strRandom = cdoResponse.getStringValue("strRandom"); // 从服务器返回结果中取随机数
         var strSalt = cdoResponse.getStringValue("strSalt"); // 取盐
         weiXin.nRealLoginType = cdoResponse.getIntegerValue("nRealLoginType"); //登录类型
		 var strOpenIdToken=localStorage.getItem('strOpenIdToken');//获取上次登录的token值
         if(is_smallProgram&&strOpenIdToken){//小程序中免密登录
             weiXin.strOpenIdToken=hex_md5((hex_md5(strRandom).toLowerCase() + strSalt+strOpenIdToken));
		 }else{
             weiXin.strPassWord =hex_md5(strSalt + hex_md5(weiXin.pwd).toLowerCase()).toLowerCase();
             weiXin.strLoginToken = hex_md5((hex_md5(strRandom).toLowerCase() +weiXin.strPassWord)).toLowerCase();
		 }
         localStorage.setItem('nRealLoginType',weiXin.nRealLoginType);
         localStorage.setItem('strLoginToken',weiXin.strLoginToken);
         doWeChatLogin(weiXin.strOpenIdToken);
         info('登录中...');
     }else{
         EngineClass.info(ret.strText);
     }
 };

 /*微信登录*/
 function doWeChatLogin(strOpenIdToken) {
 	 var wx_strLoginId=weiXin.strUserName||localStorage.getItem('wx_strLoginId');
     var cdoRequest = new CDO();
     cdoRequest.setStringValue("strServiceName", "LoginService");
     cdoRequest.setStringValue("strTransName", "doWeChatLogin");
     cdoRequest.setIntegerValue("nWeixinState",2);// 微信登录类型 微信小程序登录传2
     cdoRequest.setStringValue("strPlatform",'weixin');
     cdoRequest.setStringValue("strOpenId",weiXin.openid);//微信openId
     //cdoRequest.setIntegerValue("strSystemfrom",2);
     cdoRequest.setStringValue("nRealLoginType",localStorage.getItem('nRealLoginType'));// beforeUserLogin返回值
     if(is_smallProgram&&strOpenIdToken){//免密登录
         cdoRequest.setStringValue("strOpenIdToken",strOpenIdToken);//微信openId
     }else{//M站登录
         cdoRequest.setStringValue("strLoginToken",localStorage.getItem('strLoginToken'));
	 }
     cdoRequest.setStringValue("strLoginId", wx_strLoginId);
	 if(!localStorage.getItem('wx_strLoginId')){
         localStorage.setItem('wx_strLoginId',weiXin.strUserName);//存储用户id
	 }
     EngineClass.raiseTranshHttp(cdoRequest, "callBackFordoLogin", "https://ssomobile.dafy.com/handleTrans.cdo");
 }

 /**
 *	页面初始化,显示上次登陆手机号,和头像
 *	@date 2016-09-08
 *  @author 陈洪安
 */
$(function(){
	$(".login_new").show();
});
/**
 *  登录成功后返回页面
 */
function backToPage(){
    //如果是由手势密码跳转此页面  清空用户信息 切换为游客登录模式
    var operType=EngineClass.getQueryString("operType");
    var pageName=getStringValue("user_from_page");
    //如果启动页面触发登录 点击取消按钮跳转首页
    var testUrl=document.referrer;
   
    if("cookieFailed" == operType || "guidePage" == pageName|| operType == 'sms'){ //operType == 'sms'是短信直连业务
        clearUserLocalInfo();
		EngineClass.openWindow("index.htm", "首页", "user_from_page=clear", 2 , "","");
    }else if(testUrl==""){
		EngineClass.openWindow("index.htm", "首页", "", 2 , "","");
    }else{
        EngineClass.back();   
    }

}

/**
 * liuxueqin 添加手机短信快捷登录
 */
var obj={};
    obj.strMobile = "";
    obj.strCode = "";
    obj.lastArr = {};   //记录上一次输入的值，用于控制输入得时候通过键盘直接进来
obj.mobliePassWordLoginEvent = function(){
	$("#mobliePassWordLogin").on("click",function(){
	     $("#container").addClass("containerAniton").show();
	     $("#container2").hide();
	     obj.timgingNum=0;
	     setTimeout(function(){
			$("#container").removeClass("containerAniton");
		 },700);
	});  
};
obj.moblieCodeLoginEvent = function (){
	$("#moblieCodeLogin").on("click",function(){
		$("#container").hide();
		$("#container2").addClass("containerAniton").show();
		obj.DivFirst();
		obj.timgingNum=60;
		setTimeout(function(){
			$("#container2").removeClass("containerAniton");
		 },700);
	});  
};
obj._lLoginCont_tabEvent=function(){
   $("._lLoginCont_tab li").on("click", function(){
	     $("._lLoginCont_tab li").removeClass("row");
	     $("._lLoginCont_div>div").hide();
	     $(this).addClass("row");
	     console.log($(this).index());
	     $("._lLoginCont_div>div:eq("+$(this).index()+")").show();
	});
};
/**
 * 绑定发送验证码
 */
obj.bindSendCodeEvent=function(){
	//发送短信验证码
	$("#btnCodeId_0").on("click",function(){
		obj.sendCodeHandler(false);
	});
	//发送语音验证码
	$("#btnVoiceId_0 span").on("click",function(){
		obj.sendCodeHandler(true);
	});
};

/**
 * 发送验证码
 * @param {} isVoice  true:发送语言验证码
 */
obj.sendNoteCodeNum = 0;    //发送短信验证码次数
obj.sendVoiceNum = 0;		 //发送语言验证码次数
obj.isVoice = false;  		 //是否是发送的语音验证码
obj.sendCodeFlag = true;	 //是否可以发送验证,控制重复发送请求
obj.sendCodeHandler=function(isVoice){
		if(obj.sendCodeFlag == false){return false;}
		obj.sendCodeFlag = false;
		var strMobile = $("#strMobile").val().trim();
		if(strMobile.length == 0){
			EngineClass.info("请输入手机号码");
			obj.sendCodeFlag = true;
			return false;
		}
		//这里验证一下手机号格式是否正确
		var flag = obj.verify($("#strMobile"));
		if(flag == false){
			EngineClass.info("手机号码有误");
			obj.sendCodeFlag = true;
			return false;
		}
		if(obj.sendVoiceNum >= 3 && isVoice == true){
			EngineClass.info("您操作过于频繁，请稍后再试");
			obj.sendCodeFlag = true;
			return false;
		}
		
		if(obj.sendNoteCodeNum >=3 && isVoice == false){
			EngineClass.info("您操作过于频繁，请稍后再试");
			obj.sendCodeFlag = true;
			return false;
		}
		obj.isVoice = isVoice;
		var cdoRequest = new CDO();
		cdoRequest.setStringValue("strServiceName", "UserService");
		if(obj.isVoice == true){
			obj.sendVoiceNum = obj.sendVoiceNum + 1;
			cdoRequest.setStringValue("bIsVoiceMail", "1");//语音验证码标识
		}else{
			obj.sendNoteCodeNum = obj.sendNoteCodeNum+1;
		}
		cdoRequest.setStringValue("strTransName", "sendMobileLoginCode");
		cdoRequest.setStringValue("strMobile", $("#strMobile").val());
		cdoRequest.setIntegerValue("nSendType", 11); //1:注册、2：找回密码、3：修改登录密码、4：设置支付密码、5：修改支付密码、6：找回支付密码、7：更换设备、8:变更银行卡、11:手机验证码
		EngineClass.raiseTrans(cdoRequest,"callBackSendCodeHandler");
	};

/**
 * 发送验证码回调
 * @param {} request
 * @param {} response
 * @param {} ret
 */
function callBackSendCodeHandler(request,response,ret){
	obj.sendCodeFlag = true;
	if(typeof ret == "undefined" || ret == null){
		EngineClass.info("请求服务失败");
		return ;
	}
	
	if(ret.nCode == 0){
		if(obj.isVoice == true){
			EngineClass.info("语音验证码已经发出,请注意接听");
			obj.cutCodeState(1,2,"","");
		}else{
			EngineClass.info("短信验证码已经发出,请注意查看");
			obj.cutCodeState(2,1,"","");
		};
		//起一个定时器来倒计时
		if(obj.isVoice == true){ //语音的倒计时
			$("#btnVoiceId_2").find("span").html(obj.timgingNum);	
		}else{
			$("#btnCodeId_2").find("span").html(obj.timgingNum);
		}
		obj.countdown();
	}else{
		EngineClass.info(ret.strText);
	}
};

/**
 * 变换验证码的格式
 * @param {} codeNum      	表示要显示的短信验证码编号
 * @param {} voiceNum		表示要显示的语言验证码编号	
 * @param {} codeContent    表示亮的短信验证的内容
 * @param {} voiceContent	表示亮的语音验证的内容
 */
obj.cutCodeState=function(codeNum,voiceNum,codeContent,voiceContent){
	var arr = [0,1,2];
	for(var i=0;i<arr.length;i++){
		var jcodeDemo = $("#btnCodeId_"+i);
		var jvoiceDemo = $("#btnVoiceId_"+i);
		
		//控制短信那块的亮
		if(codeNum == i){
			jcodeDemo.show();
			if(codeContent){
				jcodeDemo.html(codeContent);
			}
		}else{
			jcodeDemo.hide();
		}
		
		//控制语音那块亮
		if(voiceNum == i){
			jvoiceDemo.show();
			if(voiceContent){
				jvoiceDemo.find("span").html(voiceContent);
			}
		}else{
			jvoiceDemo.hide();
		}
	}
};
//倒计时
obj.timging = "";
obj.timgingNum = 60;
obj.countdown = function(){
	obj.timging = setInterval(function(){
		obj.timgingNum = obj.timgingNum - 1;
		if(obj.timgingNum == 0){ //倒计时结束
			clearInterval(obj.timging);
			
			var noteText = obj.sendNoteCodeNum>0 ? "重新获取" : "获取验证码";//表示输入一次后,就变成重新获取
			var voiceText = obj.sendVoiceNum>0 ? "重新语音获取" : "免费语音获取"; 
			obj.cutCodeState(0,0,noteText,voiceText);
			obj.timgingNum = 60;
		}
		
		//设置倒计时
		if(obj.isVoice == true){ //语音的倒计时
			$("#btnVoiceId_2").find("span").html(obj.timgingNum);	
		}else{
			$("#btnCodeId_2").find("span").html(obj.timgingNum);
		} 
	},1000);
};
//点击恢复起初的问
obj.DivFirst=function(){
	$("#btnCodeId_0").show();
	$("#btnCodeId_1").hide();
	$("#btnCodeId_2").hide();
	$("#btnVoiceId_0").show();
	$("#btnVoiceId_1").hide();
	$("#btnVoiceId_2").hide();
};
/**
 * 各种验证规则
 * @param {} code 验证code
 * @param {} val  验证val
 */
obj.verify=function(jthat){
	var code = Number(jthat.attr("verify"));
	code = code == 3 ? 1 : code;   //因为3的规则和1是一样的，只是在input输入控制的时候有些特别要控制一下
	var val = jthat.val().trim();
	switch(code)
	{
		case 1:
		 var reg =  /^\d{11}$/;
		 if(!reg.test(val)){
		 	return false;
		 }
		 break;
		case 2:
		  var reg = /\d{4}/;
		  if(!reg.test(val)){
		  	return false;
		  }
		  break;
		case 4:
		  var flag = checkPwdLvl(val);
		  return flag;
		  break;
		default:
	}
	return true;
};

/**
 * 绑定登录事件-密码登录
 */
obj.isPassWordFlag=false;
obj.bindpassWordEvent=function(){
	//这东西就是加一个点击的效果
	$("#loginPassword").bind("click",function(){
		if(obj.isPassWordFlag == false){
			return false;
			};
		obj.blur();
        weiXin.strUserName=$('#strUserName').val()+'';
        weiXin.pwd=$('#pwd').val()+'';
        if(is_smallProgram){
            beforeWeChatLogin();
		}else{
            ssoLogin();
		}
	});
};


/**
 * 绑定登录事件
 * 1.先验证填的是不是有问题
 * 2.发送请求验证验证码
 */
obj.isPassWordFlag = false; 
obj.bindNextStepEvent=function(){
	//这东西就是加一个点击的效果
	$("#btnNextStep").bind("click",function(){
		obj.nextStepBefore();
	});
	
};

/**
 * 防止键盘弹起
 */
obj.blur = function(){
	var ac = document.activeElement;
	ac.blur();
}

/**
 * 登录之前input的验证
 */
obj.isNextStepFlag = false;   //登录按钮是否可以点击，如果false直接跳出来，没有点击事件
obj.nextStepBefore=function(){
	if(obj.isNextStepFlag == false){return false;};
	obj.blur();
	//1、先验证一遍,可能在输入的时候漏了
	$("._lRegInput").find("input").each(function(){
		var jdom = $(this); 
		var val = jdom.val().trim();
		var msg = jdom.attr("msg");
		if(val.length > 0){
			var flag = obj.verify(jdom);
			if(flag == false){
				if(msg == "手机号"){
					EngineClass.info(msg+"必须是手机号");						
				}else{
					EngineClass.info(msg+"格式不正确");
				}					
				return false;
			};
			
		};
	});
	
	//2、验证验证码
	obj.verifyCodeHandler();
	
};

/**
 * 登录验证验证码是否正确
 */
obj.isAgainVerifyCodeFlag = true;   //防止重复点击
obj.verifyCodeHandler=function(){
	if(obj.isAgainVerifyCodeFlag == false){return false;}
	obj.isAgainVerifyCodeFlag = false;
	var cdoRequest = new CDO();
	cdoRequest.setStringValue("strServiceName", "UserService");
	cdoRequest.setStringValue("strTransName", "verifySendMobileLoginCode");
	cdoRequest.setStringValue("strMobile", $("#strMobile").val()+"");
	cdoRequest.setStringValue("strMobileCode", $("#strCode").val()+"");				
	EngineClass.raiseTrans(cdoRequest, "callBackVerifyCode");
	_shade_layer.show("验证中...");
};

/**
 * 下一步验证回调
 * @param {} request
 * @param {} response
 * @param {} ret
 */
function callBackVerifyCode(request,response,ret){
	_shade_layer.hide();
	obj.isAgainVerifyCodeFlag = true;
	
	if(typeof ret == "undefined" || ret == null){
		EngineClass.info("请求服务失败");
		return ;
	}
	
	if(ret.nCode == 0){
		var isMobileRegister=response.getStringValue("isMobileRegister");
		/*isMobileRegister1表示已注册，0表示未注册*/
		if(isMobileRegister==1){
			//如果用户存在调用登录
			var strRandom = response.getStringValue("strRandom"); // 从服务器返回结果中取随机数
			obj.loginCodEvent(strRandom);
		}else if(isMobileRegister==0){
			//如果用户不存在，进入设置密码页面
			//验证成功，进入下一个页面
			var strMobile = $("#strMobile").val();
			var strCode = $("#strCode").val();
			var para = "strMobile="+strMobile+"&strCode="+strCode+"";
			EngineClass.openDelayWindow("login/registerTwoStepMobilePhone.htm", "设置密码",para,0,"");
		};
	}else{
		EngineClass.info(ret.strText);
	};
};
/**
 * 绑定input事件,及时输入事件
 * 2.各种验证
 */
obj.bindInputEvent=function(){
	$("#div_login").on("input","input",function(){
		var jthat = $(this);
		var flag = obj.inputVerify(jthat);
		obj.showBtn(flag);
	});
};

/**
 * 下一步和注册按钮显示控制
 * @param {} flag
 */
obj.showBtn=function(flag){	
	if($("#container").css("display")=="block"){
		if(flag == true && ($("#strUserName").val().length >0 && $("#pwd").val().length >0)){ //置亮登录按钮
			$("#loginPassword").addClass("z_login_subbtn").removeClass("z_login_subbtnNOClick");
			obj.isPassWordFlag = true;
		}else{
			obj.isPassWordFlag = false;
			$("#loginPassword").addClass("z_login_subbtnNOClick").removeClass("z_login_subbtn");	
		}
	}else{
		//登录按钮显示效果
		if(flag == true && ($("#strMobile").val().length >0 && $("#strCode").val().length == 4)){ //置亮登录按钮
			$("#btnNextStep").addClass("z_login_subbtn").removeClass("z_login_subbtnNOClick");
			obj.isNextStepFlag = true;
		}else{
			obj.isNextStepFlag = false;
			$("#btnNextStep").addClass("z_login_subbtnNOClick").removeClass("z_login_subbtn");	
		}
	};
};
/**
 * input输入验证
 * @return {Boolean}
 * @jthat {}  jQuery的dom对象
 */
obj.inputVerify = function(jthat){
	var id = jthat.attr("id");
	var val = jthat.val().trim();
	var verify = jthat.attr("verify");
	if(verify == 1){//控制手机号输入
		return obj.controlMobile(jthat,val);		
	}else if(verify == 2){ //控制验证码输入
		return obj.controlVerificationCode(/^[0-9]*$/,jthat,/^[0-9]*$/g);		
	};
	return true;
};
/**
 * 控制手机号输入
 * @param {} jthat
 * @param {} val
 * @return {Boolean}
 */
obj.controlMobile=function(jthat,val){
	var reg = /^[0-9]*$/;
	var id = jthat.attr("id");
	var lastStr = obj.lastArr[id] || "";
	var temp = val.substring(lastStr.length,val.length);
	if(!reg.test(temp)){
		jthat.val(lastStr);
		return false;
	};
	obj.lastArr[id] = val;
	return true;
};
/**
 * 控制验证码输入
 * @param {} reg 	 正则
 * @param {} jthat	 jQuery的dom对象
 */
obj.controlVerificationCode = function(reg,jthat,newReg){
	var id = jthat.attr("id");
	var val = jthat.val().trim();
	var lastStr = obj.lastArr[id] || "";
	var temp = val.substring(lastStr.length,val.length);
	if(!reg.test(temp)){
		jthat.val(lastStr);
		return false;
	}else{
		
		//再次全局验证一下，因为手写可以通过上面的
		if(!newReg.test(jthat.val())){
			jthat.val(lastStr);
			return false;
		}
		obj.lastArr[id] = val;
	}
	return true;
};
/**
 * 校验验证码成功后预登录
 */
obj.loginCodEvent=function(strRandom){
	msgBeforeLogin();
};
/**
 * 校验验证码回调
 */
function msgBeforeLogin(){
	 _user.strLoginId=$("#strMobile").val();
	if(!_user.strLoginId || "null" == _user.strLoginId){
			clearUserLocalInfo();
			info("请求失败");
			return;
		};
	var cdoRequest = new CDO();
	cdoRequest.setStringValue("strServiceName", "UserService");
	cdoRequest.setStringValue("strTransName", "beforeMobileLogin");
	cdoRequest.setStringValue("strMobile", _user.strLoginId);
	cdoRequest.setStringValue("strLoginId", _user.strLoginId);
	cdoRequest.setStringValue("strPlatform", Math.random());
	cdoRequest.setStringValue("strMobileCode", $("#strCode").val());
	EngineClass.raiseTrans(cdoRequest,"callBackForMsgLogin");
}

/**
 * 短信验证码密登录
 * @param request
 * @param response
 * @param ret
 * @returns
 */
function callBackForMsgLogin(request,cdoResponse,ret){
	if (ret == undefined || ret == null) {
		info("请求失败");
		return;
	};
	if (ret.nCode == 0) {
		var strRandom = cdoResponse.getStringValue("strRandom"); // 从服务器返回结果中取随机数
		var strSalt = cdoResponse.getStringValue("strSalt"); // 取盐
		var nRealLoginType = cdoResponse.getIntegerValue("nRealLoginType"); //登录类型
		//_user.strPassword=hex_md5(strRandom +hex_md5(_user.strLoginId));
		_user.strPassword=hex_md5(hex_md5(strRandom).toLowerCase() +''+strSalt).toLowerCase();
		// 请求令牌+随机数强混淆，因为盐也是固定的，防止被猜出来的危险，使用随机数
		_user.nTypeLogin=4; //短信验证码登录
		//_user.strTokenRandom=hex_md5(strRandom +hex_md5(_user.strLoginId));
		_user.strTokenRandom=hex_md5(hex_md5(strRandom).toLowerCase() +''+strSalt).toLowerCase();
		EngineClass.getMobileBasicInfo();//调用获取手机硬件信息
	}else {
		EngineClass.info(ret.strText);
	}
};
/**
 * 短信验证码密登录回调
 */
function callBackForMessageLogin(request,cdoResponse,ret){
	if (ret == undefined || ret == null) {
		info("请求失败");
		return;
	}
	if (ret.nCode == 0) {
		if (!cdoResponse.exists("cdoUser")) {
			EngineClass.info("请求失败");
			return;
		}
		// lUserId、用户名、真实姓名、手机号、登录记录、身份（1-业务员，0-不是该身份）
		//获取参数
		var cdoUser = cdoResponse.getCDOValue("cdoUser");
		var lUserId = cdoUser.getLongValue("lId");
		var lOldCustomerId = cdoUser.getLongValue("lOldCustomerId");// 1.0用户id
		var strLoginId = cdoUser.getStringValue("strLoginId");
		var nProtocolState = cdoUser.getStringValue("nProtocolState");
		var strName = cdoUser.getStringValue("strName");
		var strMobile = cdoUser.getStringValue("strMobile");
		var bIsSalesman = cdoUser.getStringValue("bIsSalesman");// 业务员标识：bIsSalesman=true 是业务员
		var nIsEmployee = cdoUser.getStringValue("nIsEmployee");//0-不是员工，1-员工
		var dianzhu = cdoUser.getStringValue("bIsConStore");// 便利店标识:dianzhu = true 老板
		var nIdentityState = cdoUser.getStringValue("nIdentityState");// 实名认证状态
		_user.lUserId = lUserId;
		_user.strMobile = strMobile;
		//存储用户id或设备号
		setScreenshotID(lUserId);
		// 存储登陆信息到手机本地
		setStringValue("lUserId", lUserId + "");
	//	setStrUserId(lUserId + "");
		setStringValue("strLoginId", strLoginId);
		setStringValue("strName", strName);
		setStringValue("strMobile", strMobile);
		setStringValue("nProtocolState", nProtocolState);
		setStringValue("nIdentityState", nIdentityState);
		setStringValue("lOldCustomerId", lOldCustomerId);
		setStringValue("bIsSalesman", bIsSalesman);// 业务员标识：bIsSalesman=true 是业务员
		setStringValue("nIsEmployee", nIsEmployee);//0-不是员工，1-员工
		setStringValue("strCityName", "秦皇岛市");//保存默认的商户定位信息  (城市名:秦皇岛) 线下分期定位用
		setStringValue("strGPSFlag", "true");//登录后默认设置打开GPS  (到首页获取完GPS后，置为false)
		var channelType = getChannelType();
		if (channelType == 2 || channelType == "2") {
			setUserDataCache("user_login_flag" + lUserId, "isLogin"); //IOS
		} else {
			setDataToCache("user_login_flag" + lUserId, "isLogin"); //安卓
		}
		setStringValue("strLoginToken", cdoResponse.getStringValue("strLoginToken"));//登录成功保存token
		//消息通知用：修改登录状态 state 0：未登录；1：已登录
		EngineClass.ChangeLoginState(1);
		//无论是否业务员都进2.0
		loginToIndex();
     }else{
    	EngineClass.info(ret.strText);
   }
}
