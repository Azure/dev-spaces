package com.ms.sample.mywebapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @RequestMapping(value = "/", produces = "text/plain")
    public String index() {
        return "Hello from mywebapi";
    }
}
