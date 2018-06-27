package com.ms.sample.mywebapi;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HomeController {

    @RequestMapping("/")
    public String index() {
        return "Hello from Spring Boot!";
    }

    @RequestMapping("/version")
    public String version() {
        return "0.1.0";
    }
}   