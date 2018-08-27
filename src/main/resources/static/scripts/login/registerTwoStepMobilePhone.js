
var _obj = {};
	_obj.strMobile = "";
	_obj.strCode = "";
	_obj.lastArr = {};   //记录上一次输入的值，用于控制输入得时候通过键盘直接进来
	$(document).ready(function(){
		_obj.init();
		/*把所有Input内容清空*/
	    $("._lRegInput input").val("");
	})
	
	//初始化
	_obj.init = function(){
		_obj.bindClearEvent();     //绑定清除icon事件
		_obj.bindEyeEvent();	   //绑定眼睛事件
		_obj.bindFocusEvent();	   //绑定input获取焦点事件
		_obj.bindInputEvent();     //绑定input在输入的过程中的监听事件
		_obj.bindRegisterEvent();  //绑定注册事件
		_obj.bindCheckboxEvent();  //绑定复选框事件
		_obj.bindAgreement();	   //绑定协议事件
		
		//获取第一个页面过来的参数
		_obj.strMobile = EngineClass.getQueryString("strMobile");
		_obj.strCode = EngineClass.getQueryString("strCode");
		//给第二个页面的隐藏的strMobile赋值
		if($("#strPassword")[0]){
			$("#strMobile").val(_obj.strMobile);
		}
	}
	
	/**
	 * 给协议绑定事件，主要是用于阻止冒泡
	 */
	_obj.bindAgreement=function(){
		
		$("#xieyi1").bind("tap",function(e){
			_obj.blur();
			EngineClass.showSignatureBeforeXieyi("zcxy","协议");
			e.preventDefault(); 
			e.stopPropagation();
		});
		
		$("#xieyi2").bind("tap",function(e){
			_obj.blur();
			EngineClass.showSignatureBeforeXieyi("cfca","协议");
			e.preventDefault(); 
			e.stopPropagation(); 
		});
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
			
			_obj.isNextStepFlag = false;
			_obj.showBtn(false)
		});
	}
	
	/**
	 * 绑定输入密码的眼睛事件
	 */
	_obj.bindEyeEvent=function(){
		$("._lRegInputEyeBtnClose").on("tap","",function(){
			var jthat = $(this);
			var src = jthat.attr("src");
			var isHover = false;
			if(src.indexOf("Hover") > -1){
				isHover = false;
				jthat.siblings("input")[0].type = "password";
			}else{
				isHover = true;
				jthat.siblings("input")[0].type = "text";
			}
			_obj.changeImgSrc(jthat,isHover);
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
			/*如果当前有文字输入就显示X，如果为0就不显示X*/
			if(jthat.val().length>0){
				jcloseDomBTn.show();
			}else{
				jcloseDomBTn.hide();
			}
			_obj.changeImgSrc(jIconDom,true);
		});
	};
	
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
			_obj.showBtn(flag);
		});
	}
	
	/**
	 * 下一步和注册按钮显示控制
	 * @param {} flag
	 */
	_obj.showBtn=function(flag){		
		//第二页注册按钮的显示控制
		if($("#strPassword")[0]){
			var pwd1len = $("#strPassword").val().length;
			if(flag == true && (pwd1len > 5)){ //置亮下一步按钮
				$("#btnRegister").addClass("public_btn").removeClass("public_btnNoClick");
				_obj.isRegisterFlag = true;
			}else{
				_obj.isRegisterFlag = false;
				$("#btnRegister").addClass("public_btnNoClick").removeClass("public_btn");
			}
		}
	}
	
	
	/**
	 * input输入验证
	 * @return {Boolean}
	 * @jthat {}  jQuery的dom对象
	 */
	_obj.inputVerify = function(jthat){
		var verify = jthat.attr("verify");	
		if(verify == 4){//控制密码输入,不让输入中文
			return _obj.controlPassword(jthat);			
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
	 * 防止键盘弹起
	 */
	_obj.blur = function(){
		var ac = document.activeElement;
		ac.blur();
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
	
	/**
	 * 复选框变化事件
	 */	
	_obj.bindCheckboxEvent=function(){
		$(".agreeSpan img").attr("src","http://img.dafy.com/mall/login/img/20180108/resAdioHover.png");
		$("._lRegAgree .agreeSpan").bind("tap",function(e){
			
			if($(".agreeSpan img").attr("src")=="http://img.dafy.com/mall/login/img/20180108/resAdioHover.png"){
				$(".agreeSpan img").attr("src","http://img.dafy.com/mall/login/img/20180108/resAdio.png");
				_obj.showBtn(false);
				_obj.isAgreeAgreement= false;
			}else{
				$(".agreeSpan img").attr("src","http://img.dafy.com/mall/login/img/20180108/resAdioHover.png");
				_obj.isAgreeAgreement= true;
				_obj.showBtn(true);
			}
			
			e.preventDefault();
			e.stopPropagation();
		});
		
	}
	
	/**
	 * 绑定注册事件
	 */
	_obj.isRegisterFlag = false;	 //是否可以点击注册按钮
	_obj.isAgreeAgreement = true;    //是否同意协议
	_obj.bindRegisterEvent=function(){
		$("#btnRegister").bind("tap",function(){
			_obj.registerBefore();
		});
	}
	
	/**
	 * 注册
	 */
	_obj.registerBefore=function(){
		if(_obj.isRegisterFlag == false){return false;}
		_obj.blur();
		
		//1、验证密码规则是否正确
		var jpwdDom = $("#strPassword");
		var flag = _obj.verify(jpwdDom);
		if(flag == false){ return false;}

		//3、验证是否勾选了复选框
		if(_obj.isAgreeAgreement == false){
			EngineClass.info("请同意协议");
			return false;
		}
		//4、注册服务
		_obj.registerHandler();
	};
	
	/**
	 * 注册
	 */
	_obj.isAgainRegisterFlag =  true;  //防止重复点击
	_obj.registerHandler=function(){
		if(_obj.isAgainRegisterFlag == false){return ;}
		_obj.isAgainRegisterFlag = false;
		
		_shade_layer.show("提交中...");
		var cdoRequest = new CDO();
		var strPassword = $("#strPassword").val();
		var strRecommendMobile = $("#strRecommendMobile").val();
		var strEquipmentNo = EngineClass.getDeviceCode();		//获取设备号
		
		cdoRequest.setStringValue("strServiceName", "UserService");
		cdoRequest.setStringValue("strTransName", "register");
		cdoRequest.setStringValue("nUserSource", '9');//用户注册标识  0-云贷APP   1-商城APP  9-商城H5
		cdoRequest.setStringValue("strLoginId", _obj.strMobile);
		cdoRequest.setStringValue("strPassword", hex_md5(strPassword));
		cdoRequest.setIntegerValue("nValidateType", 1);// 验证方式  1，短信验证，2邮箱验证
		cdoRequest.setStringValue("strMobile", _obj.strMobile);
		cdoRequest.setStringValue("strEquipmentNo",strEquipmentNo);//获取设备号
		cdoRequest.setStringValue("strInvitedCode",strRecommendMobile);  //推荐码
		cdoRequest.setStringValue("strMobileCode",_obj.strCode);	//验证码
		EngineClass.raiseTrans(cdoRequest,"callBackRegister");   //设备号
	}
	
	/**
	 * 注册回调
	 * @param {} request
	 * @param {} response
	 * @param {} ret
	 */
	function callBackRegister(request,response,ret){
		_obj.isAgainRegisterFlag = true;
		
		if(typeof ret == "undefiend" || ret == null){
			EngineClass.info("请求服务失败");
			_shade_layer.hide();
			return ;
		}
		if(ret.nCode == 0){ //注册成功
			setTimeout(function() {
				_shade_layer.hide();
				EngineClass.info("注册成功！");
				//调用验证码登录
				ssoCodeRegLogin();
			}, 1500);//注册成功自动登录 ,延迟2秒，是为了，注册数据，读写同步
		}else{
			_shade_layer.hide();
			if(ret.nCode == -70005){ //验证码失效
				EngineClass.info("验证码失效，请重新获取");
				setTimeout(function(){
					back();
				},1500);
			}else{
				EngineClass.info(ret.strText);
			}
		}
	}
	
	String.prototype.trim = function(){ 
	    return this.replace(/(^\s*)|(\s*$)/g, ""); 
	} 