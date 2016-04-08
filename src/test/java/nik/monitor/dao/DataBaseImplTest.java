package nik.monitor.dao;

import static org.junit.Assert.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nik.monitor.model.User;
import pr.security.LogsTools;

@Component("DataBaseImplTest")
public class DataBaseImplTest {
	private static final Logger log = LoggerFactory.getLogger(DataBaseImplTest.class);
	
	@Autowired
	private DataBaseImpl dao;
	

	public void test() {
		if (dao == null) return;
		final String LOGIN = "TestUserFromMain";
		final String ADDRESS = "Test address";
		LogsTools lt = new LogsTools(50, '*', "Main databese API tests");

		User newUser = new User(LOGIN, "123", "q@qwe.com", "name", ADDRESS);
		boolean result = dao.addUser(newUser.toMap());
		assertTrue(result);
		lt.addRow("Insert user " + LOGIN);
		
		User user = dao.getUserByLogin(LOGIN);
		assertTrue(ADDRESS.equals(user.getAddress()));
		lt.addRow("Get user by login");
////		assertTrue(dao.deactivateUser(dbImpl.getUserByLogin(LOGIN).getId()));
////		result = dbImpl.addUser("TestUser", "123", "+380951389592", "123@yandex.ru", 1, "064248", "70320", 1, "");
////		assertEquals(result, "0");
////		result = dbImpl.addUser("TestUser", "123", "+380951389592", "123@yandex.ru", 1, "064248", "70320", 1, "");
////		assertEquals(result, "123@yandex.ru");
////		
////		boolean boolResult = dbImpl.updateUser( iduser, "123", "+380951389592", "dima@yandex.ru", 1, "testName", "testMiddleName", "testSurname");
////		assertTrue(boolResult);
////		
////		UserWeb user = dbImpl.getUser(iduser);
////		assertEquals("dima@yandex.ru", user.getEmail());
//		
		assertTrue(dao.deleteUserFromDB(dao.getUserByLogin(LOGIN).getId()));
		lt.addRow("Remove user " + LOGIN);
		
		log.info(lt.getLogs());
	}
}