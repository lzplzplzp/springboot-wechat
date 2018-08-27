package com.lzp.entity;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="tbGoods")
public class Goods {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private Integer price;
    private Integer dealerPrice;
    private String categoryName;
    private String showURL;
    private Integer state;
    private Integer stock;
    private String lableName;
    private Integer lableId;
    private Integer sort;
    private Date crateTime;
    private Date updateTime;
    @JoinColumn(name="categoryId")
    private Integer categoryId;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "goodsId")
    private List<GoodsSKU> goodsSKUS;

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getDealerPrice() {
        return dealerPrice;
    }

    public void setDealerPrice(Integer dealerPrice) {
        this.dealerPrice = dealerPrice;
    }



    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Date getCrateTime() {
        return crateTime;
    }

    public void setCrateTime(Date crateTime) {
        this.crateTime = crateTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getShowURL() {
        return showURL;
    }

    public void setShowURL(String showURL) {
        this.showURL = showURL;
    }

    public String getLableName() {
        return lableName;
    }

    public void setLableName(String lableName) {
        this.lableName = lableName;
    }

    public Integer getLableId() {
        return lableId;
    }

    public void setLableId(Integer lableId) {
        this.lableId = lableId;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public List<GoodsSKU> getGoodsSKUS() {
        return goodsSKUS;
    }

    public void setGoodsSKUS(List<GoodsSKU> goodsSKUS) {
        this.goodsSKUS = goodsSKUS;
    }
}