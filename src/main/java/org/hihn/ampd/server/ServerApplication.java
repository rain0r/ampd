package org.hihn.ampd.server;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.event.EventListener;

@PropertySource(value = "classpath:application.properties")
@SpringBootApplication
public class ServerApplication {

    @Value("${server.address}")
    private String address;

    @Value("${server.port}")
    private int port;

    public static void main(final String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    /**
     * Show the user a welcome message.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() {
        System.out.println("\n==================================================");
        System.out.println("ampd is running on: " + address + ":" + port);
        System.out.println("Visit: http://" + AmpdUtils.getLocalIp() + ":" + port);
        System.out.println("If this is your first start, visit "
                + "http://" + AmpdUtils.getLocalIp() + ":" + port + "/settings?backend=" + AmpdUtils.getLocalIp() + ":"
                + port + " and save the backend address.");
        System.out.println("==================================================");
    }

}
