package org.hihn.ampd.server;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;


@SpringBootApplication
public class ServerApplication {
  @Value("${server.address}")
  private String address;

  @Value("${server.port}")
  private int port;

  public static void main(String[] args) {
    SpringApplication.run(ServerApplication.class, args);

  }

  @EventListener(ApplicationReadyEvent.class)
  public void doSomethingAfterStartup() {
    System.out.println("ampd is running on: " + address + ":" + port);
  }
}
