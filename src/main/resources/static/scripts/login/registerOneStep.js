
var _obj = {};
	_obj.strMobile = "";
	_obj.strCode = "";
	_obj.strRecommendMobile = "";
	_obj.lastArr = {};   //记录上一次输入的值，用于控制输入得时候通过键盘直接进来

	$(document).ready(function(){
		_obj.init();
		/*把所有Input内容清空*/
	    $("._lRegInput input").val("");
	})
	
	//初始化
	_obj.init = function(){
		_obj.bindClearEvent();     //绑定清除icon事件 清除input内容 并置灰提交按钮，验证码不置灰按钮 
		_obj.bindFocusEvent();	   //绑定input获取焦点事件
		_obj.bindInputEvent();     //绑定input在输入的过程中的监听事件
		_obj.bindSendCodeEvent();       //绑定发送验证码事件,语音和短信
		_obj.bindNextStepEvent();  //绑定下一步事件
	}

	
	
	/**
	 * 绑定清除图标事件
	 * 1.去掉input内容;
	 * 2.隐藏x图标
	 * 3.置灰按钮
	 */
	_obj.bindClearEvent=function(){
		$("._lRegInput").on("tap","._lRegInputEyeBtn",function(){
			var jthat = $(this);
			var src = jthat.attr("src");
			var jinputDom = jthat.siblings("input");
			var inputId = jinputDom.attr("id");
			
			//清除
			_obj.lastArr[inputId] = "";
			jinputDom.val("");
			jthat.hide();			
			if(jthat.siblings("input")[0].id == "strRecommendMobile" ){return false;}  //填的推荐码不用置灰按钮
			
			_obj.isNextStepFlag = false;
			_obj.showBtn(false)
		});
	}
	

	
	/**
	 * 绑定input元素获取焦点事件
	 * 1.将当前input图标置为写作状态;
	 * 2.同时将其他input图标置为灰色状态
	 */
	_obj.bindFocusEvent=function(){
		$("._lRegInput").on("focus","input",function(){
			var jthat = $(this);
			var jIconDom = jthat.siblings("img:first");
			var jcloseDomBTn = jthat.siblings("._lRegInputEyeBtn"); 
			var jcloseDom2BTn =$("._lRegCont").find("img._lRegInputEyeBtn"); 
			jcloseDom2BTn.hide();
			
			/*如果当前有文字输入就显示X，如果为0就不显示X*/
			if(jthat.val().length>0){
				jcloseDomBTn.show();
			}else{
				jcloseDomBTn.hide();
			}
			
			//先置灰所有按钮
			$("._lRegInputIco").each(function(){
				var jIconDom2 = $(this);
				_obj.changeImgSrc(jIconDom2,false);
			});
			_obj.changeImgSrc(jIconDom,true);
		});
	}
	
	/**
	 * 绑定input事件,及时输入事件
	 * 2.各种验证
	 */
	_obj.bindInputEvent=function(){
		$("._lRegInput").on("input","input",function(){
			var jthat = $(this);
			var jcloseDomBTn = jthat.siblings("._lRegInputEyeBtn"); 
			var flag = _obj.inputVerify(jthat);
			
			if(jthat.val().length>0){
				jcloseDomBTn.show();
			}else{
				jcloseDomBTn.hide();
			}
			if(this.id == "strRecommendMobile"){return ;} //推荐码不控制按钮的显示
			_obj.showBtn(flag);
		});
	}
	
	/**
	 * 下一步和注册按钮显示控制
	 * @param {} flag
	 */
	_obj.showBtn=function(flag){
		
		//第一页的下一步按钮显示控制
		if($("#strCode")[0]){
			if(flag == true && ($("#strMobile").val().length == 11 && $("#strCode").val().length == 4)){ //置亮下一步按钮
				$("#btnNextStep").addClass("public_btn").removeClass("public_btnNoClick");
				_obj.isNextStepFlag = true;
			}else{
				_obj.isNextStepFlag = false;
				$("#btnNextStep").addClass("public_btnNoClick").removeClass("public_btn");	
			}
		}
		
	
	}
	
	
	/**
	 * input输入验证
	 * @return {Boolean}
	 * @jthat {}  jQuery的dom对象
	 */
	_obj.inputVerify = function(jthat){
		var id = jthat.attr("id");
		var val = jthat.val().trim();
		var verify = jthat.attr("verify");
		
		if(verify == 1){//控制手机号输入
			return _obj.controlMobile(jthat,val);		
		}else if(verify == 2){ //控制验证码输入
			return _obj.controlVerificationCode(/^[0-9]*$/,jthat,/^[0-9]*$/g);		
		}else if(verify == 3){//控制推荐码输入
			var flag = _obj.controlMobile(jthat,val);
			if(flag == true){ //如果规则正确，验证是否和注册手机号一致
				if(val == $("#strMobile").val().trim()){
					EngineClass.info("推荐码不能和注册手机号一样");
					jthat.val("");
					return false;
				}
			}
			return flag;			
		}
		return true;
	}
	
	/**
	 * 控制验证码输入
	 * @param {} reg 	 正则
	 * @param {} jthat	 jQuery的dom对象
	 */
	_obj.controlVerificationCode = function(reg,jthat,newReg){
		var id = jthat.attr("id");
		var val = jthat.val().trim();
		var lastStr = _obj.lastArr[id] || "";
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
			_obj.lastArr[id] = val;
		}
		return true;
	}
	
	/**
	 * 控制密码输入,不让输入中文
	 * @param {}  jthat   jQuery的dom对象
	 */
	_obj.controlPassword = function(jthat){
		var reg = /^[\u4e00-\u9fa5]*$/;
		var id = jthat.attr("id");
		var val = jthat.val().trim();
		var lastStr = _obj.lastArr[id] || "";
		var temp = val.substring(lastStr.length,val.length);
		if(reg.test(temp) && temp != ""){ //表示输入的是中文，不让输入
			jthat.val(lastStr);
			return false;
		}else{
			
			//再次全局验证一下，因为手写可以通过上面的
			if(/.*[\u4e00-\u9fa5]+.*$/g.test(jthat.val())){
				jthat.val(lastStr);
				return false;
			}
			_obj.lastArr[id] = val;
		}
		return true;
	}
	
	/**
	 * 控制手机号输入
	 * @param {} jthat
	 * @param {} val
	 * @return {Boolean}
	 */
	_obj.controlMobile=function(jthat,val){
		var reg = /^[0-9]*$/;
		var id = jthat.attr("id");
		var lastStr = _obj.lastArr[id] || "";
		var temp = val.substring(lastStr.length,val.length);
		if(!reg.test(temp)){
			jthat.val(lastStr);
			return false;
		}
		_obj.lastArr[id] = val;
		return true;
	}
	
	/**
	 * 绑定发送验证码
	 */
	_obj.bindSendCodeEvent=function(){
		//发送短信验证码
		$("#btnCodeId_0").on("touchstart click",function(){
			_obj.sendCodeHandler(false);
		});
		
		//发送语音验证码
		$("#btnVoiceId_0 span").on("touchstart click",function(){
			_obj.sendCodeHandler(true);
		});	
	}

	/**
	 * 发送验证码
	 * @param {} isVoice  true:发送语言验证码
	 */
	_obj.sendNoteCodeNum = 0;    //发送短信验证码次数
	_obj.sendVoiceNum = 0;		 //发送语言验证码次数
	_obj.isVoice = false;  		 //是否是发送的语音验证码
	_obj.sendCodeFlag = true;	 //是否可以发送验证,控制重复发送请求
	_obj.sendCodeHandler=function(isVoice){
		
		if(_obj.sendCodeFlag == false){return false;}
		_obj.sendCodeFlag = false;
		
		var strMobile = $("#strMobile").val().trim();
		if(strMobile.length == 0){
			EngineClass.info("请输入手机号码");
			_obj.sendCodeFlag = true;
			return false;
		}
		
		//这里验证一下手机号格式是否正确
		var flag = _obj.verify($("#strMobile"));
		if(flag == false){
			EngineClass.info("手机号码有误");
			_obj.sendCodeFlag = true;
			return false;
		}
		
		if(_obj.sendVoiceNum >= 3 && isVoice == true){
			EngineClass.info("您操作过于频繁，请稍后再试");
			_obj.sendCodeFlag = true;
			return false;
		}
		
		if(_obj.sendNoteCodeNum >=3 && isVoice == false){
			EngineClass.info("您操作过于频繁，请稍后再试");
			_obj.sendCodeFlag = true;
			return false;
		}
		
		
		_obj.isVoice = isVoice;
		var cdoRequest = new CDO();
		cdoRequest.setStringValue("strServiceName", "UserService");
		if(_obj.isVoice == true){
			_obj.sendVoiceNum = _obj.sendVoiceNum + 1;
			cdoRequest.setStringValue("bIsVoiceMail", "1");//语音验证码标识
		}else{
			_obj.sendNoteCodeNum = _obj.sendNoteCodeNum+1;
		}
		cdoRequest.setStringValue("strTransName", "registerMobileCode");
		cdoRequest.setIntegerValue("nUserSource", 9);//用户注册标识  0-云贷APP   1-商城APP  9-商城H5
		cdoRequest.setStringValue("strMobile", $("#strMobile").val());
		cdoRequest.setIntegerValue("nSendType", 1); //1:注册、2：找回密码、3：修改登录密码、4：设置支付密码、5：修改支付密码、6：找回支付密码、7：更换设备、8:变更银行卡
		EngineClass.raiseTrans(cdoRequest,"callBackSendCodeHandler");
	}
	
	/**
	 * 发送验证码回调
	 * @param {} request
	 * @param {} response
	 * @param {} ret
	 */
	function callBackSendCodeHandler(request,response,ret){
		_obj.sendCodeFlag = true;
		if(typeof ret == "undefined" || ret == null){
			EngineClass.info("请求服务失败");
			return ;
		}
		
		if(ret.nCode == 0){
			if(_obj.isVoice == true){
				EngineClass.info("语音验证码已经发出,请注意接听");
				_obj.cutCodeState(1,2,"","");
			}else{
				EngineClass.info("短信验证码已经发出,请注意查看");
				_obj.cutCodeState(2,1,"","");
			}
			
			//起一个定时器来倒计时
			if(_obj.isVoice == true){ //语音的倒计时
				$("#btnVoiceId_2").find("label").html(_obj.timgingNum);	
			}else{
				$("#btnCodeId_2").find("span").html(_obj.timgingNum);
			}
			_obj.countdown();
		}else{
			EngineClass.info(ret.strText);
		}
	}
	
	/**
	 * 绑定下一步事件
	 * 1.先验证填的是不是有问题
	 * 2.置灰所有icon
	 * 3.发送请求验证验证码
	 */
	_obj.bindNextStepEvent=function(){
		//这东西就是加一个点击的效果
		$("#btnNextStep").bind("tap",function(){
			_obj.nextStepBefore();
		});
		
	}
	
	/**
	 * 防止键盘弹起
	 */
	_obj.blur = function(){
		var ac = document.activeElement;
		ac.blur();
	}
	
	/**
	 * 下一步之前的验证
	 */
	_obj.isNextStepFlag = false;   //是否可以点击下一步按钮
	_obj.nextStepBefore=function(){
		if(_obj.isNextStepFlag == false){return false;}
		_obj.blur();
		var jthat = $(this);
		
		//1、先验证一遍,可能在输入的时候漏了
		var verifyFlag = true;
		$("._lRegInput").find("input").each(function(){
			var jdom = $(this); 
			var val = jdom.val().trim();
			var msg = jdom.attr("msg");
			if(val.length > 0){
				var flag = _obj.verify(jdom);
				if(flag == false){
					if(msg == "推荐码"){
						EngineClass.info(msg+"必须是手机号");						
					}else{
						EngineClass.info(msg+"格式不正确");
					}					
					verifyFlag = false;
					jthat.removeClass("public_btnNoClick");
					return false;
				}
			}
		});
		if(verifyFlag == false){return false;}
		
		//2、置灰所有input的icon
		$("._lRegInputIco").each(function(){
			var jIconDom2 = $(this);
			_obj.changeImgSrc(jIconDom2,false);
		});
		
		//3、验证验证码
		_obj.verifyCodeHandler();
	}
	
	/**
	 * 下一步验证验证码是否正确
	 */
	_obj.isAgainVerifyCodeFlag = true;   //防止重复点击
	_obj.verifyCodeHandler=function(){
		if(_obj.isAgainVerifyCodeFlag == false){return false;}
		_obj.isAgainVerifyCodeFlag = false;
		var recommendVal = $("#strRecommendMobile").val();		
		var cdoRequest = new CDO();
		cdoRequest.setStringValue("strServiceName", "UserService");
		cdoRequest.setStringValue("strTransName", "verifyRegisterMobileCode");
		cdoRequest.setStringValue("strMobile", $("#strMobile").val()+"");
		cdoRequest.setStringValue("strMobileCode", $("#strCode").val()+"");		
		if(recommendVal.length != 0 || recommendVal != ""){			
			cdoRequest.setStringValue("strInvitedCode", recommendVal+"");	
		}		
		cdoRequest.setIntegerValue("nUserSource", 9);//用户注册标识  0-云贷APP   1-商城APP  9-商城H5
		EngineClass.raiseTrans(cdoRequest, "callBackVerifyCode");
		_shade_layer.show("验证中...");
	}
	
	/**
	 * 下一步验证回调
	 * @param {} request
	 * @param {} response
	 * @param {} ret
	 */
	function callBackVerifyCode(request,response,ret){
		_shade_layer.hide();
		_obj.isAgainVerifyCodeFlag = true;
		
		if(typeof ret == "undefined" || ret == null){
			EngineClass.info("请求服务失败");
			return ;
		}
		
		if(ret.nCode == 0){
			//验证成功，进入下一个页面
			var strMobile = $("#strMobile").val();
			var strCode = $("#strCode").val();
			var strRecommendMobile = $("#strRecommendMobile").val();
			var para = "strMobile="+strMobile+"&strCode="+strCode+"&strRecommendMobile="+strRecommendMobile;
			EngineClass.openDelayWindow("login/registerTwoStep.htm", "确认密码",para,0,"");
		}else{
			EngineClass.info(ret.strText);
		}
	}
	
	
	//倒计时
	_obj.timging = "";
	_obj.timgingNum = 60;
	_obj.countdown = function(){
		_obj.timging = setInterval(function(){
			_obj.timgingNum = _obj.timgingNum - 1;
			if(_obj.timgingNum == 0){ //倒计时结束
				clearInterval(_obj.timging);
				
				var noteText = _obj.sendNoteCodeNum>0 ? "重新获取" : "获取验证码";//表示输入一次后,就变成重新获取
				var voiceText = _obj.sendVoiceNum>0 ? "重新语音获取" : "免费语音获取"; 
				_obj.cutCodeState(0,0,noteText,voiceText);
				_obj.timgingNum = 60;
			}
			
			//设置倒计时
			if(_obj.isVoice == true){ //语音的倒计时
				$("#btnVoiceId_2").find("label").html(_obj.timgingNum);	
			}else{
				$("#btnCodeId_2").find("span").html(_obj.timgingNum);
			} 
		},1000);
	}
	
	/**
	 * 变换验证码的格式
	 * @param {} codeNum      	表示要显示的短信验证码编号
	 * @param {} voiceNum		表示要显示的语言验证码编号	
	 * @param {} codeContent    表示亮的短信验证的内容
	 * @param {} voiceContent	表示亮的语音验证的内容
	 */
	_obj.cutCodeState=function(codeNum,voiceNum,codeContent,voiceContent){
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
	}
	
	/**
	 * 各种验证规则
	 * @param {} code 验证code
	 * @param {} val  验证val
	 */
	_obj.verify=function(jthat){
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
	}
	
	/**
	 * 更换图片
	 */
	_obj.changeImgSrc = function(jthat,isHover){
		var tempName = "";
		var src = jthat.attr("src");
		if(src.indexOf("Hover") > -1){
			var reg = /\/(\w*)(?=_Hover)/;
			tempName = src.match(reg)[1];
		}else{
			var reg = /\/(\w*)(?=.png)/;
			tempName = src.match(reg)[1];
		}
		
		if(isHover == true){
			src = "http://img.dafy.com/mall/login/img/20180108/"+tempName+"_Hover.png";
		}else{
			src = "http://img.dafy.com/mall/login/img/20180108/"+tempName+".png";
		}
		jthat.attr("src",src);
	}
	

	
	
	String.prototype.trim = function(){ 
	    return this.replace(/(^\s*)|(\s*$)/g, ""); 
	} 