package nik.monitor.dao;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import nik.monitor.dao.mappers.IMapper;
import pr.dao.BatisBuilder;
import pr.dao.BatisImpl;

@Component("DataBaseImpl")
public class DataBaseImpl implements IMapper {
	private static final Logger log = LoggerFactory.getLogger(DataBaseImpl.class);
	
	private DataSource dataSource;
	private BatisImpl batis;
	@Value("${pr.security.databaseName}")
	private String dbName;

	@Autowired
	private void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		dataSource = jdbcTemplate.getDataSource();
		log.debug("Init DataBaseImpl");
		
		batis = new BatisBuilder(dataSource)
				.addMappers(IMapper.class).build();
	}
	
	public Object getBatis() {
		return batis;
	}
}