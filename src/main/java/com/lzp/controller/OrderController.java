package com.lzp.controller;

import com.lzp.entity.Category;
import com.lzp.service.GoodsService;
import com.lzp.util.Result;
import com.lzp.util.ResultUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping(value = "/order")
public class OrderController {

    private final Logger log = LoggerFactory.getLogger(OrderController.class);
    @Autowired
    private GoodsService goodsService;


    @RequestMapping(value = "/getOrderListByUser")
    @ResponseBody
    public Result getOrderListByUser(HttpServletRequest request){
        log.info("order.getOrderListByUser start =============");
        List<Category> list= goodsService.findCatgoryByState(1);
        return ResultUtil.success(list);
    }
}