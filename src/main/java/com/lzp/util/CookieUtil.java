package com.lzp.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class CookieUtil {

    public static Cookie getCookie(HttpServletRequest request, String name) {
        if (name == null) {
            return null;
        } else {
            Cookie[] cookies = request.getCookies();
            if (cookies == null) {
                return null;
            } else {
                int length = cookies.length;

                for(int i = 0; i < length; ++i) {
                    if (name.equals(cookies[i].getName())) {
                        return cookies[i];
                    }
                }

                return null;
            }
        }
    }
    /**
     * 保存Cookies
     *
     * @param response
     *            servlet请求
     * @param value
     *            保存值
     * @author jxf
     */
    public static HttpServletResponse setCookie(HttpServletResponse response, String name, String value) {
        // new一个Cookie对象,键值对为参数
        Cookie cookie = new Cookie(name, value);
        // tomcat下多应用共享
        cookie.setPath("/");
        // 如果cookie的值中含有中文时，需要对cookie进行编码，不然会产生乱码
        try {
            URLEncoder.encode(value, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        cookie.setMaxAge(8640000);
        // 将Cookie添加到Response中,使之生效
        // addCookie后，如果已经存在相同名字的cookie，则最新的覆盖旧的cookie
        response.addCookie(cookie);
        return response;
    }
}
