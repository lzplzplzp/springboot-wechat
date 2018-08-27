package com.lzp.util;


public class WechatUnifiedorderResp
{
    public static final String RETURN_CODE_OF_SUCCESS = "SUCCESS";
    public static final String RETURN_CODE_OF_FAIL = "FAIL";
    public static final String RESULT_CODE_OF_SUCCESS = "SUCCESS";
    public static final String RESULT_CODE_OF_FAIL = "FAIL";
    private String result_code = "FAIL";
    private String return_code = "FAIL";
    private String sign = "";
    private String device_info = "";
    private String mch_id = "";
    private String prepay_id = "";
    private String code_url = "";
    private String return_msg = "";
    private String appid = "";
    private String noce_str = "";
    private String trade_type = "";
    private String err_code;
    private String err_code_des;

    public boolean isSuccess()
    {
        return (this.return_code.equals("SUCCESS")) && (this.result_code.equals("SUCCESS"));
    }

    public String getResult_code()
    {
        return this.result_code;
    }

    public void setResult_code(String result_code)
    {
        this.result_code = result_code;
    }

    public String getReturn_code()
    {
        return this.return_code;
    }

    public void setReturn_code(String return_code)
    {
        this.return_code = return_code;
    }

    public String getSign()
    {
        return this.sign;
    }

    public void setSign(String sign)
    {
        this.sign = sign;
    }

    public String getDevice_info()
    {
        return this.device_info;
    }

    public void setDevice_info(String device_info)
    {
        this.device_info = device_info;
    }

    public String getMch_id()
    {
        return this.mch_id;
    }

    public void setMch_id(String mch_id)
    {
        this.mch_id = mch_id;
    }

    public String getPrepay_id()
    {
        return this.prepay_id;
    }

    public void setPrepay_id(String prepay_id)
    {
        this.prepay_id = prepay_id;
    }

    public String getCode_url()
    {
        return this.code_url;
    }

    public void setCode_url(String code_url)
    {
        this.code_url = code_url;
    }

    public String getReturn_msg()
    {
        return this.return_msg;
    }

    public void setReturn_msg(String return_msg)
    {
        this.return_msg = return_msg;
    }

    public String getAppid()
    {
        return this.appid;
    }

    public void setAppid(String appid)
    {
        this.appid = appid;
    }

    public String getNoce_str()
    {
        return this.noce_str;
    }

    public void setNoce_str(String noce_str)
    {
        this.noce_str = noce_str;
    }

    public String getTrade_type()
    {
        return this.trade_type;
    }

    public void setTrade_type(String trade_type)
    {
        this.trade_type = trade_type;
    }

    public String getErr_code()
    {
        return this.err_code;
    }

    public void setErr_code(String err_code)
    {
        this.err_code = err_code;
    }

    public String getErr_code_des()
    {
        return this.err_code_des;
    }

    public void setErr_code_des(String err_code_des)
    {
        this.err_code_des = err_code_des;
    }

    public String toString()
    {
        return "WechatUnifiedorderResp [result_code=" + this.result_code + ", return_code=" + this.return_code + ", sign=" + this.sign + ", device_info=" + this.device_info + ", mch_id=" + this.mch_id + ", prepay_id=" + this.prepay_id + ", code_url=" + this.code_url + ", return_msg=" + this.return_msg + ", appid=" + this.appid + ", noce_str=" + this.noce_str + ", trade_type=" + this.trade_type + ", err_code=" + this.err_code + ", err_code_des=" + this.err_code_des + "]";
    }
}
