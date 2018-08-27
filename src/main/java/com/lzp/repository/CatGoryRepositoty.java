package com.lzp.repository;

import com.lzp.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatGoryRepositoty extends JpaRepository<Category,Long> {

    @Query(value = "select t from Category t where t.state = :state order by t.sort")
    List<Category> findCatgoryList(@Param("state") Integer state);

}