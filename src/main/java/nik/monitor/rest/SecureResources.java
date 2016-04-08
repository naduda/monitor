package nik.monitor.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import nik.monitor.dao.DataBaseImpl;
import pr.rest.Common4rest;
import pr.security.db.SecureDatabaseAPI;
import pr.security.model.IUser;

@RestController
@RequestMapping("/secureresources")
public class SecureResources {
	private static final Logger log = LoggerFactory.getLogger(SecureResources.class);
	@Resource(name="DataBaseImpl") 
	private DataBaseImpl dao;
	@Resource(name="SecureDatabaseAPI")
	private SecureDatabaseAPI secDao;

	private IUser getCurrentUser() {
		String userName = SecurityContextHolder.getContext().getAuthentication().getName();
		return (IUser) secDao.getUserByLogin(userName);
	}
	
	@RequestMapping(value="/profileInfo/{login}", method=RequestMethod.GET)
	public Map<String, Object> profileInfo(@PathVariable String login) throws SQLException {
		return profileInfoRez(login);
	}
	
	@RequestMapping(value="/test", method=RequestMethod.POST)
	public Map<String, Object> test(@RequestBody Map<String, Object> data) {
		Map<String, Object> ret = new HashMap<>();
		log.info(data.toString());
		String cmd = data.get("command").toString();
		if(cmd.startsWith("check")) {
			String fullPath = Common4rest.getFileFromURL(this.getClass(), "./static/plugins/" + cmd).getAbsolutePath();
			cmd = fullPath;
			log.info(fullPath);
		} else if (cmd.startsWith("static")) {
			String fullPath = Common4rest.getFileFromURL(this.getClass(), "").getAbsolutePath();
			fullPath = fullPath
					.substring(0, fullPath.lastIndexOf("/") < 0 ? fullPath.lastIndexOf("\\") : fullPath.lastIndexOf("/"));
			cmd = cmd.substring(cmd.lastIndexOf("/") < 0 ? cmd.lastIndexOf("\\") : cmd.lastIndexOf("/"));
			cmd = fullPath + "/plugins" + cmd;
			log.info(fullPath);
		}
		String[] pars = data.get("params").toString().split("\\s+");
		List<String> command = new ArrayList<>();
		command.add(cmd);
		for (String par : pars) {
			command.add(par);
		}
		try {
			ProcessBuilder builder = new ProcessBuilder(command);
			builder.redirectErrorStream(true);
			Process process = builder.start();
			
			try(InputStream stderr = process.getErrorStream();
				InputStream stdout = process.getInputStream();
				BufferedReader reader = new BufferedReader(new InputStreamReader(stdout, "CP866"));
				BufferedReader readerErr = new BufferedReader(new InputStreamReader(stderr));) {
				String line = "";
				while ((line  = reader.readLine()) != null) {
					log.info(line);
					ret.put(ret.size() + "", line);
				}
				
				while ((line  = readerErr.readLine()) != null) {
					log.error("Stdout: " + line);
					ret.put("err-" + ret.size(), line);
				}
//				process.waitFor();
			} catch (Exception e1) {
				log.error("error");
				log.error(ExceptionUtils.getFullStackTrace(e1));
			}
		} catch (IOException e) {
			log.error(ExceptionUtils.getFullStackTrace(e));
		}
		return ret;
	}
	
	@RequestMapping(value="/plugins", method=RequestMethod.GET)
	public Map<String, Object> getPlugins() {
		Map<String, Object> model = new HashMap<>();
		final String DIR_PLUGINS = "static/plugins";
		File folder = Common4rest.getFileFromURL(this.getClass(), "./" + DIR_PLUGINS);
		File[] listOfFiles = folder.listFiles();
		if(listOfFiles != null) {
			for (File file : listOfFiles) {
				model.put("" + model.size(), file.getName());
			}
		} else {
			String path = folder.getAbsolutePath();
			try {
				Common4rest.getListOfFilesInJar(new URL("file:/" + path.substring(0, path.indexOf("!"))), DIR_PLUGINS)
				.forEach(s -> model.put("" + model.size(), s));
			} catch (MalformedURLException e) {
				log.error("Bad URL");
			}
		}
		return model;
	}
	
	@RequestMapping(value="/profileInfo", method=RequestMethod.GET)
	public Map<String, Object> profileInfo() throws SQLException {
		return profileInfoRez(null);
	}
	
	private Map<String, Object> profileInfoRez(String login) throws SQLException {
		Map<String, Object> model = new HashMap<>();
		IUser u = login == null ? getCurrentUser() : (IUser) secDao.getUserByLogin(login);
		model.put("email", u.getEmail());
		model.put("login", u.getLogin());
		log.info("@RequestMapping /profileInfo ");
		return model;
	}
	
	@RequestMapping(value="/updateProfile", method=RequestMethod.POST)
	public Map<String, Object> updateProfile(@RequestBody Map<String, Object> user) {
		Map<String, Object> model = new HashMap<String, Object>();
		try {
			BCryptPasswordEncoder pe = new BCryptPasswordEncoder(12);
			IUser u = user.get("login") == null ? getCurrentUser() : (IUser) secDao.getUserByLogin(user.get("login").toString());
			if(pe.matches(user.get("password").toString(), u.getPassword())) {
//				String langId = user.get("langId").toString();
//				int idLang = 3;
//				switch (langId.toLowerCase()) {
//					case "en": idLang = 1; break;
//					case "ru": idLang = 2; break;
//					case "uk": idLang = 3; break;
//				}
//				log.info(user.get("middlename").toString());
				dao.updateUser(u.getId(), 
						user.get("password1") == null ? u.getPassword() : pe.encode(user.get("password1").toString()),
						user.get("email").toString(),user.get("name").toString(), user.get("address").toString());
				model.put("result", "success");
				return model;
			} else {
				model.put("result", "keyWrongPassword");
				return model;
			}
		} catch (Exception e) {
			model.put("result", "INTERNAL_SERVER_ERROR");
			return model;
		}
		
	}
	
//	@RequestMapping(value="/removeProfile", method=RequestMethod.POST)
//	public  Map<String, Object> removeProfile(@RequestBody Map<String, Object> user) {
//		Map<String, Object> model = new HashMap<String, Object>();
//		try {
//			BCryptPasswordEncoder pe = new BCryptPasswordEncoder(12);
//			IUser u = user.get("login") == null ? getCurrentUser() : (IUser) secDao.getUserByLogin(user.get("login").toString());
//			if(pe.matches(user.get("password").toString(), u.getPassword())) {
//				if(dao.deleteUser(u.getId())) {
//					model.put("result", "success");
//					return model;
//				} else {
//					model.put("result", "keyTryAgain");
//					return model;
//				}
//			} else {
//				model.put("result", "keyWrongPassword");
//				return model;
//			}
//		} catch (Exception e) {
//			model.put("result", "INTERNAL_SERVER_ERROR");
//			return model;
//		}
//	}
}