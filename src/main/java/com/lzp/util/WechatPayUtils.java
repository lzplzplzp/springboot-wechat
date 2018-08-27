package com.lzp.util;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class WechatPayUtils
{
    public static final Logger logger = LoggerFactory.getLogger(WechatPayUtils.class);
    public String URL_UNIFIEDORDER = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    public String URL_TRANSFTER = "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers";
    public static final String TRADE_TYPE_OF_JSAPI = "JSAPI";
    public static final String TRADE_TYPE_OF_APP = "APP";
    public static final String TRADE_TYPE_NATIVE = "NATIVE";
    public static final String TRADE_TYPE_MICROPAY = "MICROPAY";
    private String appId = "wx1ee6a2253e14791a";
    private String mchId = "1371155002";
    private String notifyUrl = "eno.ngrok.cc";
    private String wxPayApiKey = "7030e6073fa55ba406d769164ade877e";
    public static final String CALLBACK_SUCCESS_RESPONSE = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
    private static WechatPayUtils instance = null;

    private WechatPayUtils()
    {
        this.appId = "";
        this.mchId = "";
        this.wxPayApiKey = "";
    }

    public static WechatPayUtils instance()
    {
        if (instance == null) {
            instance = new WechatPayUtils();
        }
        return instance;
    }

    public WechatUnifiedorderResp genPrepareId(String tradeType, String tradeno, String body, String totalfee, String notifyUrl, String openid)
    {
        return genPrepareId(tradeType, tradeno, body, "", totalfee, "", "", "", "", notifyUrl,openid);
    }

    public WechatUnifiedorderResp genPrepareId(String tradeType, String tradeno, String body, String detail, String totalfee, String attach, String ip, String goodsTag, String productId, String notifyUrl, String openid)
    {
        if ((notifyUrl == null) || (notifyUrl.trim().length() == 0)) {
            notifyUrl = this.notifyUrl;
        }
        WechatUnifiedorderResp rep = new WechatUnifiedorderResp();
        try
        {
            List<SimpleNameValuePair> packageParams = new LinkedList();
            packageParams.add(new SimpleNameValuePair("appid", this.appId));
            if (StringUtils.isNotBlank(attach)) {
                packageParams.add(new SimpleNameValuePair("attach", attach));
            }
            if (StringUtils.isNotBlank(body)) {
                packageParams.add(new SimpleNameValuePair("body", body));
            }
            if (StringUtils.isNotBlank(detail)) {
                packageParams.add(new SimpleNameValuePair("detail", detail));
            }
            packageParams.add(new SimpleNameValuePair("mch_id", this.mchId));
            packageParams.add(new SimpleNameValuePair("nonce_str", "000000000000000"));
            packageParams.add(new SimpleNameValuePair("notify_url", notifyUrl));
            packageParams.add(new SimpleNameValuePair("out_trade_no", tradeno));
            if (StringUtils.isNotBlank(productId)) {
                packageParams.add(new SimpleNameValuePair("product_id", productId));
            }
            if (StringUtils.isBlank(ip)) {
                ip = "127.0.0.1";
            }
            packageParams.add(new SimpleNameValuePair("spbill_create_ip", ip));

            packageParams.add(new SimpleNameValuePair("total_fee", totalfee));
            packageParams.add(new SimpleNameValuePair("trade_type", tradeType));
            // 用户在小程序下的唯一标示

            packageParams.add(new SimpleNameValuePair("openid", openid));

//            packageParams.add(WechatSignUtil.genPackageSign(signParams, this.wxPayApiKey));




            String xmlstring = WechatSignUtil.genXml(packageParams, this.wxPayApiKey);

            String str = WechatHttpKit.post(this.URL_UNIFIEDORDER, xmlstring);
            logger.info("generate prepay result:" + str);

            Map<String, String> map = WechatXmlUtil.getMapFromXML(str);

            logger.info("preorderidinfo:" + map);
            if (map.containsKey("return_code")) {
                rep.setReturn_code((String)map.get("return_code"));
            }
            if (map.containsKey("return_msg")) {
                rep.setReturn_msg((String)map.get("return_msg"));
            }
            if (map.containsKey("return_code")) {
                rep.setReturn_code((String)map.get("return_code"));
            }
            if (map.containsKey("return_msg")) {
                rep.setReturn_msg((String)map.get("return_msg"));
            }
            if (map.containsKey("appid")) {
                rep.setAppid((String)map.get("appid"));
            }
            if (map.containsKey("mch_id")) {
                rep.setMch_id((String)map.get("mch_id"));
            }
            if (map.containsKey("device_info")) {
                rep.setDevice_info((String)map.get("device_info"));
            }
            if (map.containsKey("nonce_str")) {
                rep.setNoce_str((String)map.get("nonce_str"));
            }
            if (map.containsKey("sign")) {
                rep.setSign((String)map.get("sign"));
            }
            if (map.containsKey("result_code")) {
                rep.setResult_code((String)map.get("result_code"));
            }
            if (map.containsKey("err_code")) {
                rep.setErr_code((String)map.get("err_code"));
            }
            if (map.containsKey("err_code_des")) {
                rep.setErr_code_des((String)map.get("err_code_des"));
            }
            if (map.containsKey("trade_type")) {
                rep.setTrade_type((String)map.get("trade_type"));
            }
            if (map.containsKey("prepay_id")) {
                rep.setPrepay_id((String)map.get("prepay_id"));
            }
            if (map.containsKey("code_url")) {
                rep.setCode_url((String)map.get("code_url"));
            }
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
        }
        return rep;
    }

    public wechatPayReqParams genPayReqParams(String prepayid)
    {
        return genPayReqParams(prepayid, null);
    }

    public wechatPayReqParams genPayReqParams(String prepayid, String packageinfo)
    {
        wechatPayReqParams req = new wechatPayReqParams();
        req.setAppkey(this.wxPayApiKey);
        req.setAppid(this.appId);
        req.setPartnerid(this.mchId);
        req.setPrepayid(prepayid);
        if (StringUtils.isBlank(packageinfo)) {
            packageinfo = "Sign=WXPay";
        }
        req.setPackageinfo(packageinfo);
        req.setNoncestr(WechatSignUtil.genNonceStr());
        req.setTimestamp(String.valueOf(WechatSignUtil.genTimeStamp()));

        List<SimpleNameValuePair> signParams = new LinkedList();
        signParams.add(new SimpleNameValuePair("appid", req.getAppid()));
        signParams.add(new SimpleNameValuePair("noncestr", req.getNoncestr()));
        signParams.add(new SimpleNameValuePair("package", req.getPackageinfo()));
        signParams.add(new SimpleNameValuePair("partnerid", req.getPartnerid()));
        signParams.add(new SimpleNameValuePair("prepayid", req.getPrepayid()));
        signParams.add(new SimpleNameValuePair("timestamp", req.getTimestamp()));
        req.setSign(WechatSignUtil.genPackageSign(signParams, this.wxPayApiKey));
        logger.info(signParams.toString());
        return req;
    }
}