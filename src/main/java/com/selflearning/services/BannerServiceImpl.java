package com.selflearning.services;

import com.selflearning.entities.Banner;
import com.selflearning.repositories.BannerRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BannerServiceImpl {

    private final BannerRepository bannerRepository;
    public BannerServiceImpl(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public Banner getBannerStatus() {
        Optional<Banner> banner = bannerRepository.findBanner();
        return banner.orElse(null);
    }
}
