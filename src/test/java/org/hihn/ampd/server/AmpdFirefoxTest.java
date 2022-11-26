package org.hihn.ampd.server;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.By;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@TestPropertySource("classpath:application.properties")
public class AmpdFirefoxTest {

	@Value("${webdriver.gecko.driver}")
	private String gecko;

	@Value("${ampd.address}")
	private String ampdAddress;

	@Test
	void ff() {
		System.setProperty("webdriver.gecko.driver", gecko);
		FirefoxOptions options = new FirefoxOptions();
		options.setHeadless(true); // <-- headless set here
		FirefoxDriver driver = new FirefoxDriver(options);
		driver.get(ampdAddress);

		// Clear queue
		driver.findElement(
				By.xpath("//button[contains(@title, 'Remove all items from the queue')]")
		).click();

		// Click disabled button
		driver.findElement(
				By.xpath("//button[contains(@title, 'Remove all items from the queue')]")
		).click();
	}

}
