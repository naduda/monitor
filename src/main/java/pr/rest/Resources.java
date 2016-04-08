package pr.rest;

import java.io.File;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.mail.MessagingException;

import org.apache.commons.lang.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mobile.device.Device;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import pr.mail.SmtpMailSender;
import pr.security.db.SecureDatabaseAPI;
import pr.security.model.IUser;

@RestController
@RequestMapping("/resources")
public class Resources {
	private static final Logger log = LoggerFactory.getLogger(Resources.class);
	
	@Resource(name="SecureDatabaseAPI")
	private SecureDatabaseAPI dao;
	@Autowired
	private SmtpMailSender smtpMailSender;
	@Value("${pr.security.block.attempts}")
	private int maxAttempts;
	@Value("${pr.security.block.timeout}")
	private int timeout;
	
	@RequestMapping(value="/user", method=RequestMethod.GET)
	public Principal user(Principal user) {
		if(user != null) {
			IUser u = (IUser) dao.getUserByLogin(user.getName());
			dao.updateUserAttempts(u.getId(), 0);
		}
		return user;
	}
	
	@RequestMapping(value="/addUser", method=RequestMethod.POST)
	public  Map<String, Object> addUser(@RequestBody Map<String, String> user) {
		Map<String, Object> model = new HashMap<String, Object>();
//		User newUser = new User(user.get("login"), user.get("password"), user.get("email"), "", "");
		Map<String, Object> newUser = new HashMap<>();
		newUser.put("login", user.get("login"));
		newUser.put("email", user.get("email"));
		newUser.put("password", user.get("password"));
		try {
			model.put("result", dao.addUser(newUser) ? "ok" : "bad");
		} catch (Exception e) {
			model.put("result", "bad");
		}
		return model;
	}

	@RequestMapping(value="/isUserLock/{login}", method=RequestMethod.GET)
	public Map<String, Object> isBlocked(@PathVariable String login) {
		Map<String, Object> model = new HashMap<String, Object>();
		try {
			IUser u = (IUser) dao.getUserByLogin(login);
			u.setMaxAttempts(maxAttempts);

			model.put("result", u.isLocked());
			model.put("message", "keyUserLock");
			long diff = Timestamp.valueOf(LocalDateTime.now()).getTime() - u.getLastmodified().getTime();
			model.put("wait", (int)(timeout - diff / 1000));
		} catch (Exception e) {
			model.put("result", false);
		}
		return model;
	}
	
	@RequestMapping("/detect-device")
	public Map<String, Object> detectDevice(Device device) {
		Map<String, Object> model = new HashMap<String, Object>();
		String deviceType = "unknown";
		if (device.isNormal()) {
			deviceType = "normal";
		} else if (device.isMobile()) {
			deviceType = "mobile";
		} else if (device.isTablet()) {
			deviceType = "tablet";
		}
		model.put("deviceType", deviceType);
		return model;
	}
	
	@RequestMapping(value="/recover", method=RequestMethod.POST)
	public  Map<String, Object> recover(@RequestBody Map<String, String> input) {
		Map<String, Object> model = new HashMap<String, Object>();
		String email = input.get("email");
		String login = input.get("login");
		IUser user = null;
		String password = input.get("password");
		
		if(email != null && email.length() > 0) {
			user = (IUser) dao.getUserByEmail(email);
		} else {
			user = dao.getUserByLogin(login);
		}
		
		if(user != null) {
			login = user.getLogin();
			password = RandomStringUtils.random(8, true, true);
			user.setPassword(password);
			dao.updateUser(user);
		} else {
			log.info("User " + input + " not exist.");
			model.put("result", "keyTryAgain");
			return model;
		}

		String emailBody = "<strong>Authentication</strong><hr>" +
				"Your " + "login is <strong>\"" + login + "\"</strong><br> Your password is <strong>\"" + password + "\"" +
				"<br><br><hr><font size=\"0.8em\"><strong>Regards, Pavlo Naduda<br></strong>" +
				"phone: 050 66 22 55 6<br>" +
				"e-mail: naduda.pr@gmail.com (pr@ukreni.com.ua)</font>";

		try {
			smtpMailSender.send(user.getEmail(), "Authentication", emailBody);
			model.put("result", "ok");
		} catch (MessagingException e) {
			model.put("result", "keyTryAgain");
		}
		
		return model;
	}
	
	@RequestMapping(value="/langs", method=RequestMethod.GET)
	public List<?> langs() {
		List<String> model = new ArrayList<>();
		try {
			File folder = Common4rest.getFileFromURL(getClass(), "./static/lang");
			File[] listOfFiles = folder.listFiles();
			for (File file : listOfFiles) {
				model.add(file.getName());
			}
		} catch (Exception e) {
			log.info("@RequestMapping /langs Error M " + Common4rest.getFileFromURL(getClass(), "./static/lang"));
		}
		log.info("Exist " + model.size() + " language-files");
		return model;
	}
}