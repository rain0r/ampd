package org.hihn.ampd.server;

import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;

public class AmpdUtils {

    public static String getLocalIp() {
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
