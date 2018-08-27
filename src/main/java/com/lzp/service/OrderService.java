package com.lzp.service;

import com.lzp.entity.Category;
import com.lzp.repository.CatGoryRepositoty;
import com.lzp.repository.GoodsRepositoty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private GoodsRepositoty goodsRepositoty;
    @Autowired
    private CatGoryRepositoty catGoryRepositoty;

    public List findCatgoryByState(Integer state){
        List<Category> categoryList = null;
        try{
            categoryList = catGoryRepositoty.findCatgoryList(state);
        }catch (Exception e){}
        return categoryList;
    }
}