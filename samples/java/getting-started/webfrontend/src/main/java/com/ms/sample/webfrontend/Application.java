// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

package com.ms.sample.webfrontend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @RequestMapping(value = "/greeting", produces = "text/plain")
    public String greeting() {
        return "Hello from webfrontend";
    }
}
