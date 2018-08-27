package com.lzp.repository;

import com.lzp.entity.Goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsRepositoty extends JpaRepository<Goods,Long> {

    @Query(value = "select t from Goods t where t.state = :state")
    List<Goods> findGoodsList(@Param("state") Integer state);

}