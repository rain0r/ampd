package org.hihn.ampd.server;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class FirefoxTest {

	@Test
	void addition() {
		assertEquals(2, 1 + 1);
	}

	@Test
	void ff() {
		System.setProperty("webdriver.gecko.driver", "/usr/local/bin/geckodriver");
		FirefoxOptions options = new FirefoxOptions();
		options.setHeadless(true); // <-- headless set here
		FirefoxDriver driver = new FirefoxDriver(options);
		driver.get("https://hihn.org");
		String title = driver.getTitle();

		System.out.println(title);
	}

}
