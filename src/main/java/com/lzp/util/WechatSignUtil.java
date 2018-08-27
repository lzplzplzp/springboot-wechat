package com.lzp.util;

import java.security.MessageDigest;
import java.util.List;
import java.util.Random;

public class WechatSignUtil
{
    public static String genPackageSign(List<SimpleNameValuePair> params, String wxPayApiKey)
    {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < params.size(); i++) {
            if ((((SimpleNameValuePair)params.get(i)).getName() != null) && (((SimpleNameValuePair)params.get(i)).getName().trim().length() != 0))
            {
                sb.append(((SimpleNameValuePair)params.get(i)).getName());
                sb.append('=');
                sb.append(((SimpleNameValuePair)params.get(i)).getValue());
                sb.append('&');
            }
        }
        sb.append("key=");
        sb.append(wxPayApiKey);
        String packageSign = getMessageDigest(sb.toString().getBytes()).toUpperCase();
        return packageSign;
    }

    public static String toXml(List<SimpleNameValuePair> params)
    {
        StringBuilder sb = new StringBuilder();
        sb.append("<xml>");
        for (int i = 0; i < params.size(); i++)
        {
            sb.append("<" + ((SimpleNameValuePair)params.get(i)).getName() + ">");
            sb.append(((SimpleNameValuePair)params.get(i)).getValue());
            sb.append("</" + ((SimpleNameValuePair)params.get(i)).getName() + ">");
        }
        sb.append("</xml>");

        return sb.toString();
    }

    public static String genXml(List<SimpleNameValuePair> params, String privateKey)
            throws Exception
    {
        StringBuilder sb = new StringBuilder();
        StringBuilder sb2 = new StringBuilder();
        sb2.append("<?xml version='1.0' encoding='UTF-8' standalone='yes' ?><xml>");
        for (int i = 0; i < params.size(); i++)
        {
            sb.append(((SimpleNameValuePair)params.get(i)).getName());
            sb.append('=');
            sb.append(((SimpleNameValuePair)params.get(i)).getValue());
            sb.append('&');

            sb2.append("<" + ((SimpleNameValuePair)params.get(i)).getName() + ">");
            sb2.append(((SimpleNameValuePair)params.get(i)).getValue());
            sb2.append("</" + ((SimpleNameValuePair)params.get(i)).getName() + ">");
        }
        sb.append("key=");
        sb.append(privateKey);
        String packageSign = null;

        packageSign = getMessageDigest(sb.toString().getBytes("UTF-8")).toUpperCase();
        sb2.append("<sign><![CDATA[");
        sb2.append(packageSign);
        sb2.append("]]></sign>");
        sb2.append("</xml>");
        return sb2.toString();
    }

    public static String genNonceStr()
    {
        Random random = new Random();
        return getMessageDigest(String.valueOf(random.nextInt(10000)).getBytes());
    }

    public static long genTimeStamp()
    {
        return System.currentTimeMillis() / 1000L;
    }

    public static final String getMessageDigest(byte[] buffer)
    {
        char[] hexDigits = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
        try
        {
            MessageDigest mdTemp = MessageDigest.getInstance("MD5");
            mdTemp.update(buffer);
            byte[] md = mdTemp.digest();
            int j = md.length;
            char[] str = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++)
            {
                byte byte0 = md[i];
                str[(k++)] = hexDigits[(byte0 >>> 4 & 0xF)];
                str[(k++)] = hexDigits[(byte0 & 0xF)];
            }
            return new String(str);
        }
        catch (Exception e) {}
        return null;
    }
}
