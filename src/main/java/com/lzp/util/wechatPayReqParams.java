package com.lzp.util;

public class wechatPayReqParams
{
    private String appkey;
    private String appid;
    private String noncestr;
    private String packageinfo;
    private String partnerid;
    private String prepayid;
    private String timestamp;
    private String sign;

    public String getAppkey()
    {
        return this.appkey;
    }

    public void setAppkey(String appkey)
    {
        this.appkey = appkey;
    }

    public String getAppid()
    {
        return this.appid;
    }

    public void setAppid(String appid)
    {
        this.appid = appid;
    }

    public String getNoncestr()
    {
        return this.noncestr;
    }

    public void setNoncestr(String noncestr)
    {
        this.noncestr = noncestr;
    }

    public String getPackageinfo()
    {
        return this.packageinfo;
    }

    public void setPackageinfo(String packageinfo)
    {
        this.packageinfo = packageinfo;
    }

    public String getPartnerid()
    {
        return this.partnerid;
    }

    public void setPartnerid(String partnerid)
    {
        this.partnerid = partnerid;
    }

    public String getPrepayid()
    {
        return this.prepayid;
    }

    public void setPrepayid(String prepayid)
    {
        this.prepayid = prepayid;
    }

    public String getTimestamp()
    {
        return this.timestamp;
    }

    public void setTimestamp(String timestamp)
    {
        this.timestamp = timestamp;
    }

    public String getSign()
    {
        return this.sign;
    }

    public void setSign(String sign)
    {
        this.sign = sign;
    }
}