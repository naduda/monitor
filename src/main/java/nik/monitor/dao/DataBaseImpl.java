package nik.monitor.dao;

import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import nik.monitor.dao.mappers.IMapper;
import nik.monitor.dao.mappers.IMapperCreate;
import nik.monitor.model.User;
import pr.dao.BatisBuilder;
import pr.dao.BatisImpl;
import pr.dao.IBatis;
import pr.security.db.SecureDatabaseAPI;

@Component("DataBaseImpl")
public class DataBaseImpl implements IMapper {
	private static final Logger log = LoggerFactory.getLogger(DataBaseImpl.class);
	
	private DataSource dataSource;
	private BatisImpl batis;
	@Value("${pr.security.databaseName}")
	private String dbName;
	@Resource(name="SecureDatabaseAPI")
	private SecureDatabaseAPI secDao;
	private BCryptPasswordEncoder pe;

	@Autowired
	private void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		log.info("DataBaseImpl init");
		dataSource = jdbcTemplate.getDataSource();
		pe = secDao.getPe();
		secDao.createTableUser();
		
		batis = new BatisBuilder(dataSource)
				.addMappers(IMapperCreate.class)
				.addMappers(IMapper.class).build();
		
		if(!(boolean)batis.setIBatis(s -> s.getMapper(IMapperCreate.class).isFieldExist("USER", "NAME")).get()) {
			log.debug(batis.setIBatis(s -> s.getMapper(IMapperCreate.class).alertTable()).run() ?
					"Table user updated" : "Can't update table user");
		}
		User user = (User) batis.setIBatis(s -> s.getMapper(IMapper.class).getUserByLogin("q")).get();
		log.info(batis.setIBatis(s-> s.getMapper(IMapper.class)
				.updateUser(user.getId(), user.getPassword(), user.getEmail(), "testName", "testAddress")).run() ?
				"user updated" : "user can't update");
		User user2 = (User) batis.setIBatis(s -> s.getMapper(IMapper.class).getUserByLogin("q")).get();
		log.debug(user2.toString());
	}
	
	public boolean addUser(Map<String, Object> user) {
		return secDao.addUser(user) ? true : false;
	}
	
	@Override
	public User getUserByLogin(String login) {
		return (User) batis.setIBatis(s -> s.getMapper(IMapper.class).getUserByLogin(login)).get();
	}
	
	public boolean deleteUserFromDB(int idUser) {
		return secDao.deleteUserFromDB(idUser);
	}
	
	@Override
	public boolean updateUser(int idUser, String password, String email, String name, String address) {
		IBatis updateUser =  s -> s.getMapper(IMapper.class)
				.updateUser(idUser, pe.encode(password), email, name, address);
		return batis.setIBatis(updateUser).run();
	}

	@Override
	public boolean activateUser(String login) {
		return batis.setIBatis(s -> s.getMapper(IMapper.class).activateUser(login)).run();
	}
	
	@Override
	public boolean deactivateUser(String login) {
		return batis.setIBatis(s -> s.getMapper(IMapper.class).deactivateUser(login)).run();
	}
}