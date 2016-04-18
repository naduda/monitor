import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import nik.monitor.Application;
import nik.monitor.dao.DataBaseImplTest;
import pr.security.SecureDatabaseAPITest;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
public class ApplicationTests {
	@Resource(name="DataBaseImplTest")
	private DataBaseImplTest dbTest;
	@Resource(name="SecureDatabaseAPITest")
	private SecureDatabaseAPITest security;

	@Test
	public void testDataBaseAPI() {
		security.test();
		dbTest.test();
	}
}