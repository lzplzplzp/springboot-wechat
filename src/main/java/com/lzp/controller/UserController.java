package com.lzp.controller;

import com.lzp.entity.User;
import com.lzp.service.UserService;
import com.lzp.util.CookieUtil;
import com.lzp.util.JwtUtil;
import com.lzp.util.Result;
import com.lzp.util.ResultUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping(value = "/user")
public class UserController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/index")
    public String index(){
        return "user/index";
    }

    @RequestMapping(value = "/show.do")
    @ResponseBody
    public Result show(HttpServletRequest request){
        log.info("user.show start =============");
        User user = (User)request.getAttribute("user");
        if(null != user) {
            return ResultUtil.success(user);
        }else {
            return ResultUtil.error();
        }
    }
    @RequestMapping(value = "/loginView")
    public String login(){
        return "login/login";
    }

    @RequestMapping(value = "/login.do")
    @ResponseBody
    public Result login(HttpServletRequest request,HttpServletResponse response,
                        @RequestParam(value = "name")String name,
                        @RequestParam(value = "password")String password){
        try {
            User user = userService.findUserByName(name);
            if(null != user) {
                if(user.getPassword().equals(password)){
                    String jwt= JwtUtil.createJWT("token", JwtUtil.generalSubject(user),31536000000L);
                    CookieUtil.setCookie(response,"token",jwt);
                    return ResultUtil.success(user);
                }else{
                    request.setAttribute("result",ResultUtil.error());
                    return ResultUtil.error();
                }
            }else {
                return ResultUtil.success();
            }
        } catch (Exception e) {
            return ResultUtil.error();
        }
    }
}