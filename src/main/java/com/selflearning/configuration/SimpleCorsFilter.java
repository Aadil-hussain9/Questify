package com.selflearning.configuration;

import com.selflearning.entities.Banner;
import com.selflearning.services.BannerServiceImpl;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter implements Filter {
    private final String clientAppUrl = "http://localhost:4200/*";

    private final BannerServiceImpl bannerService;

    public SimpleCorsFilter(BannerServiceImpl bannerService) {
        this.bannerService = bannerService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        String originHeader = request.getHeader("origin");
        if (originHeader != null) {
            response.setHeader("Access-Control-Allow-Origin", originHeader);
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept");
            response.setHeader("Access-Control-Expose-Headers", "X-Banner-Status, X-Banner-Message"); // Expose custom headers
        }

        Banner banner = bannerService.getBannerStatus();
        if(banner!=null && banner.isActive()){
          response.setHeader("X-Banner-Status", String.valueOf(true));
          response.setHeader("X-Banner-Message", banner.getMessage());
        } else {
                response.setHeader("X-Banner-Status", "false");
        }

        if("OPTIONS".equalsIgnoreCase(request.getMethod())){
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        filterChain.doFilter(servletRequest,servletResponse);
    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}
