package pr.security;

import static org.junit.Assert.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import pr.security.db.SecureDatabaseAPI;
import pr.security.model.IUser;
import pr.security.model.User;

@Component("SecureDatabaseAPITest")
public class SecureDatabaseAPITest {
	private static final Logger log = LoggerFactory.getLogger(SecureDatabaseAPITest.class);
	
	@Autowired
	private SecureDatabaseAPI dao;
	
	public void test() {
		final String LOGIN = "TestUser";
		LogsTools lt = new LogsTools(50, '*', "Security API tests");

		User user = new User(LOGIN, "123", "q@qwe.com", 5);

		Boolean result = dao.addUser(user.toMap());
		assertTrue(result);
		lt.addRow("Insert user " + LOGIN);
		
		IUser testUser = dao.getUserByLogin(LOGIN);
		lt.addRow("Get user by login");
		
		assertTrue(dao.updateUser(testUser.getId(), "newPassword", "newEmail", false));
		lt.addRow("Update user");
		testUser = dao.getUserByEmail("newEmail");
		lt.addRow("Get user by email");
		assertTrue(dao.checkPassword("newPassword", testUser.getPassword()));
		assertTrue(!testUser.isActive());
				
		testUser = dao.getUserByLogin(LOGIN);
		assertTrue(dao.deleteUserFromDB(testUser.getId()));
		lt.addRow("Remove user " + LOGIN);
		
//		dao.addUser2(user);

		log.info(lt.getLogs());
	}
}