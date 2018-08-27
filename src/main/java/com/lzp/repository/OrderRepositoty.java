package com.lzp.repository;

import com.lzp.entity.Goods;
import com.lzp.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepositoty extends JpaRepository<Order,Long> {

    @Query(value = "select t from Order t where t.state = :state")
    List<Goods> findOrderByUser(@Param("state") Integer state);

}