package org.hihn.ampd.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;


@SpringBootApplication
public class ServerApplication {

    @Autowired
    Environment environment;

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);

    }

    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() {
        String address = environment.getProperty("local.server.address");
        String port = environment.getProperty("local.server.port");
        System.out.println("ampd is running on: "address + ":" + port);
    }
}
