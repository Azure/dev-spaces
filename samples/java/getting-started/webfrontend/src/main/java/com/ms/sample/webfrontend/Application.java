package com.ms.sample.webfrontend;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class Application {
    /**
     * a flag control whether or not to call backup service "mywebapi".
     */
    private static boolean CALL_SEPARATE_SERVICE = true;

    /**
     * Say hello or call backend service "mywebapi".
     *
     * @param timestamp the "_" parameter in request parameter to avoid angualur.js to use cached results.
     * @param azdsRoute the "azds-route-as" header from request which is to keep the network affinity
     * @return
     */
    @RequestMapping(value = "/greeting", produces = "text/html")
    public String greeting(@RequestParam(name = "_", required = false, defaultValue = "0") String timestamp,
           @RequestHeader(value = "azds-route-as", required = false) String azdsRoute) {
        if (CALL_SEPARATE_SERVICE) {
            Map<String, String> requestHeaders = new HashMap<>();
            /* propagate the dev space routing header */
            requestHeaders.put("azds-route-as", azdsRoute);
            return getTextFromAzdsService("http://mywebapi", requestHeaders);
        }
        return "Hello from webfrontend at " + new Date(Long.parseLong(timestamp));

    }

    /**
     * The main method of the program.
     *
     * @param args the parameters.
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    private static String getTextFromAzdsService(String urlString, Map<String, String> requestHeaders) {
        StringBuilder sb = new StringBuilder();
        HttpURLConnection urlConnection = null;
        BufferedReader reader = null;
        try {
            URL url = new URL(urlString);

            urlConnection = (HttpURLConnection) url.openConnection();
            if (requestHeaders != null) {
                for (Map.Entry<String, String> keyvalue : requestHeaders.entrySet()) {
                    urlConnection.setRequestProperty(keyvalue.getKey(), keyvalue.getValue());
                }
            }

            urlConnection.connect();

            if (urlConnection != null) {
                urlConnection.setReadTimeout(60 * 1000);
            }
            if (urlConnection != null && urlConnection.getInputStream() != null) {
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream(),
                        Charset.defaultCharset()));
                if (bufferedReader != null) {
                    int cp;
                    while ((cp = bufferedReader.read()) != -1) {
                        sb.append((char) cp);
                    }
                    bufferedReader.close();
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Exception while calling URL:" + urlString, e);
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    // ignore
                }
            }
        }

        return sb.toString();
    }
}
