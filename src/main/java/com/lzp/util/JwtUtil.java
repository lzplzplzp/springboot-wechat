package com.lzp.util;

import com.alibaba.fastjson.JSONObject;
import com.lzp.controller.UserController;
import com.lzp.entity.Role;
import com.lzp.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

public class JwtUtil {
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(JwtUtil.class);
    private static String jianshu="A";

    /**
     * 由字符串生成加密key
     * @return
     */
    public static SecretKey generalKey(){
        String stringKey = jianshu+ Constant.JWT_SECRET;
        byte[] encodedKey = Base64.decodeBase64(stringKey);
        SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
        return key;
    }

    /**
     * 创建jwt
     * @param id
     * @param subject
     * @param ttlMillis
     * @return
     * @throws Exception
     */
    public static String createJWT(String id, String subject, long ttlMillis) throws Exception {

        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        long expMillis = nowMillis + ttlMillis;
        Date exp = new Date(expMillis);
        SecretKey key = generalKey();
        JwtBuilder builder = Jwts.builder()
                .setId(id)
                .setExpiration(exp)
                .setIssuedAt(now)
                .setSubject(subject)
                .signWith(signatureAlgorithm, key);
        return builder.compact();
    }

    /**
     * 解密jwt
     * @param jwt
     * @return
     * @throws Exception
     */
    private static Claims parseJWT(String jwt) throws Exception{
        SecretKey key = generalKey();
        Claims claims = Jwts.parser().setSigningKey(key).parseClaimsJws(jwt).getBody();
        return claims;
    }

    /**
     * 生成subject信息
     * @param user
     * @return
     */
    public static String generalSubject(User user){
        JSONObject jo = new JSONObject();
        jo.put("userId", user.getId());
        jo.put("userName", user.getName());
        jo.put("roles",user.getRoles());
        return jo.toString();
    }

    /**
     * 获取用户信息
     * @param jwt
     * @return
     */
    public static User getlUser(String jwt) throws Exception{
        try {
            Claims claims= parseJWT(jwt);
            String subject=  claims.getSubject();
            JSONObject jo =JSONObject.parseObject(subject);
            User user = new User();
            user.setId(Long.valueOf((Integer)jo.get("userId")));
            user.setName((String) jo.get("userName"));
            user.setRoles((List<Role>) jo.get("roles"));
            return user;
        } catch (Exception e) {
            log.error("获取用户信息异常",e);
            return null;
        }
    }

    public static void main(String[] args) {
        User user = new User();
        user.setId(1L);
        user.setName("a");

        String a = generalSubject(user);
        System.out.println(a);
        JSONObject jo =JSONObject.parseObject(a);
        Integer b= (Integer)jo.get("userId");
        System.out.println(b+"=======");
    }


}
