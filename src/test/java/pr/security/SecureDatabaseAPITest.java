package pr.security;

import static org.junit.Assert.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import pr.security.db.SecureDatabaseAPI;
import pr.security.model.IUser;
import pr.security.model.User;

@Component("SecureDatabaseAPITest")
public class SecureDatabaseAPITest {
	private static final Logger log = LoggerFactory.getLogger(SecureDatabaseAPITest.class);
	
	@Value("${pr.security.block.attempts}")
	private int maxAttempts;
	@Value("${pr.security.userName}")
	private String userName;
	@Value("${pr.security.userEmail}")
	private String userEmail;
	
	@Autowired
	private SecureDatabaseAPI dao;
	
	public void test() {
		final String LOGIN = "TestUser";
		final String EMAIL = "q@nik.net.ua";
		final String NEW_EMAIL = "newEmail@gmail.com";
		final String NEW_PASSWORD = "new password";
		LogsTools lt = new LogsTools(50, '*', "Security API tests");

		dao.removeTableUser();
		IUser user = new User(LOGIN, "123", EMAIL, maxAttempts);
		Boolean result = dao.addUser(null, user.toMap());
		assertTrue(result);
		lt.addRow("Insert user " + LOGIN + ". And create table user (if not exist).");
		
		IUser testUser = dao.getUserByLogin(null, LOGIN);
		assertTrue(testUser.getEmail().equals(EMAIL));
		lt.addRow("Get user by login");
		
		testUser.setEmail(NEW_EMAIL);
		testUser.setPassword(NEW_PASSWORD);
		testUser.setActive(false);
		assertTrue(dao.updateUser(null, testUser.toMap()));
		lt.addRow("Update user");
		testUser = dao.getUserByEmail(null, NEW_EMAIL);
		assertTrue(!testUser.isActive());
		assertTrue(NEW_EMAIL.equals(testUser.getEmail()));
		lt.addRow("Get user by email");
		assertTrue(dao.checkPassword(NEW_PASSWORD, testUser.getPassword()));
		lt.addRow("Check update user password");
		
		Map<String, Object> mapUser = dao.getUserByLogin(null, LOGIN).toMap();
		assertTrue(dao.deleteUserFromDB(null, testUser.getId()));
		lt.addRow("Remove user " + LOGIN);
		
		List<Map<String, Object>> customFields = new ArrayList<>();
		customFields.add(createField("name", "testName"));
		customFields.add(createField("age", 33));
		customFields.add(createField("height", 1.87));
		customFields.add(createField("ishappy", true));
		customFields.add(createField("createdtime", Timestamp.valueOf(LocalDateTime.now())));
		mapUser.put("customFields", customFields);
		
		assertTrue(dao.addUser(null, mapUser));
		lt.addRow("Create custom user with string, int, double, boolean, timestamp fields");
		assertTrue(dao.deleteUserFromDB(null, testUser.getId()));
		lt.addRow("Remove custom user " + LOGIN);
		
		customFields.add(createField("id", 18));
		customFields.add(createField("login", 19));
		customFields.add(createField("active", true));
		customFields.add(createField("lastmodified", Timestamp.valueOf(LocalDateTime.now())));
		customFields.add(createField("name", "testName1"));
		customFields.add(createField("name", "testName2"));
		customFields.add(createField("name", "testName3"));
		customFields.add(createField("age", 30));
		customFields.add(createField("height", 1.88));
		customFields.add(createField("ishappy", true));
		customFields.add(createField("createdtime", Timestamp.valueOf(LocalDateTime.now())));
		mapUser.put("customFields", customFields);
		
		assertTrue(dao.addUser(null, mapUser));
		lt.addRow("Create custom user with dublicate fields");
		assertTrue(dao.deleteUserFromDB(null, testUser.getId()));
		lt.addRow("Remove custom user " + LOGIN + " with dublicate fields");
		
		assertTrue(createAdminUser());
		lt.addRow(String.format("Created custom user admin login: %s, password: %s, email: %s "
				+ "(from security.properties file)", 
				userName, "qwe", userEmail));
		log.info(lt.getLogs());
	}
	
	private Map<String, Object> createField(String key, Object value) {
		Map<String, Object> m = new HashMap<>();
		m.put("name", key);
		m.put("type", value.getClass().getSimpleName());
		m.put("value", value);
		return m;
	}
	
	private boolean createAdminUser() {
		IUser user = new User(userName, "qwe", userEmail, maxAttempts);
		Map<String, Object> mapUser = user.toMap();
		List<Map<String, Object>> customFields = new ArrayList<>();
		customFields.add(createField("name", "Pavlo"));
		customFields.add(createField("age", 33));
		customFields.add(createField("height", 1.87));
		customFields.add(createField("ishappy", true));
		customFields.add(createField("createdtime", Timestamp.valueOf(LocalDateTime.now())));
		mapUser.put("customFields", customFields);
		return dao.addUser(null, mapUser);
	}
}