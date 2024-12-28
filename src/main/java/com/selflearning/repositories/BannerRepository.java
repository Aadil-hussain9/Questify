package com.selflearning.repositories;

import com.selflearning.entities.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    @Query("SELECT b from Banner b")
    Optional<Banner> findBanner();
}
