package nik.monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

import nik.monitor.rest.SecureResources;
import pr.security.SecurityConfiguration;

@SpringBootApplication
@ComponentScan({"pr.security", "pr.rest", "pr.mail", "nik.monitor"})
@PropertySource({"classpath:security.properties", "classpath:application.properties"})
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(new Class[]{
				Application.class,
				SecureResources.class,
				SecurityConfiguration.class
		}, args);
	}
}