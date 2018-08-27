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
@RequestMapping(value = "/qr")
public class QrCodeController {

    private final Logger log = LoggerFactory.getLogger(QrCodeController.class);
    @Autowired
    private GoodsService goodsService;


    @RequestMapping(value = "/getGoodsInfo")
    @ResponseBody
    public Result getGoodsInfo(HttpServletRequest request){
        log.info("goods.getGoodsInfo start =============");
        List<Category> list= goodsService.findCatgoryByState(1);
        return ResultUtil.success(list);
    }
}