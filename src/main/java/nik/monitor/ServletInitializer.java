package nik.monitor;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

import nik.monitor.rest.SecureResources;
import pr.mail.SmtpMailSender;
import pr.rest.Common4rest;
import pr.rest.Resources;
import pr.rest.SafeResources;
import pr.security.SecurityConfiguration;

public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(new Class[] {
				Application.class,
				Common4rest.class,
				Resources.class,
				SafeResources.class,
				SmtpMailSender.class,
				SecureResources.class,
				SecurityConfiguration.class
		});
	}

}