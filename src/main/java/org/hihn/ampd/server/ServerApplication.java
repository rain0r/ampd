package org.hihn.ampd.server;

import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
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
    System.out.println("If this is your first start, visit "
        + "http://" + getLocalIp() + ":" + port + "/settings?backend=" + getLocalIp() + ":"
        + port + " and save the backend address.");
    System.out.println("==================================================");
  }

  private String getLocalIp() {
    try (final DatagramSocket datagramSocket = new DatagramSocket()) {
      datagramSocket.connect(InetAddress.getByName("google.com"), 10002);
      String ip = datagramSocket.getLocalAddress().getHostAddress();
      if (ip.equals("0.0.0.0")) {
        // We're on a Mac, try something different
        Socket socket = new Socket();
        socket.connect(new InetSocketAddress("google.com", 80));
        ip = socket.getLocalAddress().toString().replace("/", "");
      }
      return ip;
    } catch (Exception e) {
      return "localhost";
    }
  }
}
