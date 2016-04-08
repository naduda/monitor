package pr.rest;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import pr.security.db.SecureDatabaseAPI;
import pr.security.model.IUser;

@RestController
@RequestMapping("/saferesources")
public class SafeResources {
	private static final Logger log = LoggerFactory.getLogger(SafeResources.class);
	@Resource(name="SecureDatabaseAPI")
	private SecureDatabaseAPI dao;
	@Resource(type = Common4rest.class)
	private Common4rest comm;

	private IUser getCurrentUser() {
		String userName = SecurityContextHolder.getContext().getAuthentication().getName();
		return (IUser) dao.getUserByLogin(userName);
	}
	
	@RequestMapping(value="/profile", method=RequestMethod.GET)
	public Object profileInfo() {
		IUser u = getCurrentUser();
		u.setPassword("");
		return u;
	}
	

	@RequestMapping(value="/delUser", method=RequestMethod.POST)
	public Map<String, Object> delUser(@RequestBody Map<String, String> user) {
		Map<String, Object> ret = new HashMap<>();
		IUser u = getCurrentUser();
		try {
			if(u.getLogin().equals(user.get("login"))){
				ret.put("result", dao.deleteUserFromDB(u.getId()) ? "ok" : "bad");
			}
		} catch (Exception e) {
			log.error(e.getMessage());
			ret.put("result", "bad");
		}
		return ret;
	}
	
	@RequestMapping(value="/updateProfile", method=RequestMethod.POST)
	public Object updateProfile(@RequestBody Map<String, String> user) {
		try {
			comm.resultMessage(dao.updateUser(user, getCurrentUser()) ? "ok" : "bad");
		} catch (Exception e) {
			log.error(e.getMessage());
			comm.resultMessage("bad");
		}
		return comm.resultMessage("ok");
	}
}