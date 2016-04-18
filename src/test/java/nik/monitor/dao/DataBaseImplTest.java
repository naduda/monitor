package nik.monitor.dao;

import static org.junit.Assert.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import pr.security.LogsTools;

@Component("DataBaseImplTest")
public class DataBaseImplTest {
	private static final Logger log = LoggerFactory.getLogger(DataBaseImplTest.class);
	
	@Autowired
	private DataBaseImpl dao;
	

	public void test() {
		LogsTools lt = new LogsTools(50, '*', "Main database API tests");
		assertTrue(dao.getBatis() != null);
		lt.addRow("Batis is defined");
		
		log.info(lt.getLogs());
	}
}