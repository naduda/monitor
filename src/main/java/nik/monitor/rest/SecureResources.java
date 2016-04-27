package nik.monitor.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import nik.monitor.dao.DataBaseImpl;
import pr.LogsTools;
import pr.security.rest.ASecurityRest;
import pr.security.rest.Common4rest;

@RestController
@RequestMapping("/secureresources")
public class SecureResources extends ASecurityRest {
	private static final Logger log = LoggerFactory.getLogger(SecureResources.class);
	
	@Resource(name="DataBaseImpl") 
	private DataBaseImpl dao;
	@Resource(type = Common4rest.class)
	public Common4rest comm;
	
	@RequestMapping(value="/test", method=RequestMethod.POST)
	public Map<String, Object> test(@RequestBody Map<String, Object> data) {
		Map<String, Object> ret = new HashMap<>();
		LogsTools lt = new LogsTools(50, '*', "Command");
		String cmd = data.get("command").toString();
		if(cmd.startsWith("check")) {
			String fullPath = comm.getJarPath();
			if(fullPath.indexOf("/classes/") > 0) {
				cmd = comm.getFileFromURL(this.getClass(), "./static/plugins/" + cmd).getAbsolutePath();
			} else {
				cmd = fullPath + "plugins/" + cmd;
			}
		}
		
		String[] pars = data.get("params").toString().split("\\s+");
		List<String> command = new ArrayList<>();
		command.add(cmd);
		String params = " ";
		for (String par : pars) {
			command.add(par);
			params += par + " ";
		}
		lt.addRow(cmd + params);
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
					ret.put(ret.size() + "", line);
				}
				
				while ((line  = readerErr.readLine()) != null) {
					log.error("Stdout: " + line);
					ret.put("err-" + ret.size(), line);
				}
//				process.waitFor();
			} catch (Exception e1) {
				log.error("error");
				lt.addRow("error in command");
				log.error(ExceptionUtils.getFullStackTrace(e1));
			}
		} catch (IOException e) {
			log.error(ExceptionUtils.getFullStackTrace(e));
		}
		log.debug(lt.getLogs());
		return ret;
	}
	
	@RequestMapping(value="/plugins", method=RequestMethod.GET)
	public Map<String, Object> getPlugins() {
		Map<String, Object> model = new HashMap<>();
		final String DIR_PLUGINS = "static/plugins";
		File folder = comm.getFileFromURL(this.getClass(), "./" + DIR_PLUGINS);
		File[] listOfFiles = folder.listFiles();
		LogsTools lt = new LogsTools(50, '*', "plugins");
		lt.addRow(folder.getAbsolutePath());
		lt.addRow(listOfFiles == null ? "listOfFiles == null" : "listOfFiles = " + listOfFiles.length);
		if(listOfFiles != null) {
			for (File file : listOfFiles) {
				model.put("" + model.size(), file.getName());
			}
		} else {
			String path = comm.getJarPath() + "plugins";
			lt.addRow(path);
			try {
				listOfFiles = new File(path).listFiles();
				if(listOfFiles != null) {
					for (File file : listOfFiles) {
						model.put("" + model.size(), file.getName());
					}
				}
			} catch (Exception e) {
				log.error("Bad URL");
				lt.addRow("Bad URL");
			}
		}
		log.debug(lt.getLogs());
		return model;
	}
}