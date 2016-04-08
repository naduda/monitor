package pr.security.db;

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

import pr.dao.BatisBuilder;
import pr.dao.BatisImpl;
import pr.dao.IBatis;
import pr.security.db.mappers.IMapper;
import pr.security.db.mappers.IMapperCreate;
import pr.security.model.IUser;
import pr.security.model.User;

@Component("SecureDatabaseAPI")
public class SecureDatabaseAPI implements IMapper {
	private static final Logger log = LoggerFactory.getLogger(SecureDatabaseAPI.class);
	
	private DataSource dataSource;
	private BatisImpl batis;
	@Value("${pr.security.block.attempts}")
	private int maxAttempts;
	@Value("${pr.security.cryptPasswordLength}")
	private int cryptPasswordLength;
	@Resource(type = DatabaseBuilder.class)
	private DatabaseBuilder builder;
	private BCryptPasswordEncoder pe;

	@Autowired
	private void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		dataSource = jdbcTemplate.getDataSource();
		pe = new BCryptPasswordEncoder(cryptPasswordLength);
		try {
			createTableUser();
		} catch (Exception e) {
			log.error("Error in DatabaseBuilder.class");
		}
	}
	
	public void createTableUser() {
		batis = new BatisBuilder(dataSource)
				.addMappers(IMapperCreate.class)
				.addMappers(IMapper.class)
				.build();
		if(builder.setBatis(batis).create().wasCreated()) {
			User u = new User("q", "qwe", "q@gmail.com", maxAttempts);
			addUser(u.toMap());
		}
	}
	
	@Override
	public Boolean addUser(Map<String, Object> user) {
		user.put("password", pe.encode(user.get("password").toString()));
		user.put("maxAttempts", maxAttempts);
		return batis.setIBatis(s -> s.getMapper(IMapper.class).addUser(user)).run();
	}
	
	@Override
	public User getUserByLogin(String login) {
		return (User) batis.setIBatis(s -> s.getMapper(IMapper.class).getUserByLogin(login)).get();
	}
	
	@Override
	public User getUserByEmail(String email) {
		return (User) batis.setIBatis(s -> s.getMapper(IMapper.class).getUserByEmail(email)).get();
	}
	
	@Override
	public boolean updateUserAttempts(int idUser, int attempts) {
		IBatis updateUser =  s -> s.getMapper(IMapper.class).updateUserAttempts(idUser, attempts);
		return batis.setIBatis(updateUser).run();
	}
	
	@Override
	public User getUser(int idUser) {
		return (User) batis.setIBatis(s -> s.getMapper(IMapper.class).getUser(idUser)).get();
	}
	
	public boolean updateUser(IUser user) {
		return updateUser(user.getId(), user.getPassword(), user.getEmail(), user.isActive());
	}
	
	public boolean checkPassword(String password, String dbPassword) {
		return pe.matches(password, dbPassword);
	}
	
	public boolean updateUser(Map<String, String> user, IUser originalUser) {
		if(checkPassword(user.get("password"), originalUser.getPassword())) {
			return updateUser(Integer.parseInt(user.get("id")), 
					user.get("password1").length() > 0 ? user.get("password1") : user.get("password"), 
					user.get("email"), user.get("active").equals("true"));
		} else {
			log.warn("Incorrect password");
			return false;
		}
	}
	
	@Override
	public boolean updateUser(int idUser, String password, String email, boolean active) {
		
		return batis.setIBatis(s -> s.getMapper(IMapper.class)
				.updateUser(idUser, pe.encode(password), email, active)).run();
	}

	@Override
	public boolean deleteUserFromDB(int id) {
		return batis.setIBatis(s -> s.getMapper(IMapper.class).deleteUserFromDB(id)).run();
	}

	public int getMaxAttempts() {
		return maxAttempts;
	}

	public BCryptPasswordEncoder getPe() {
		return pe;
	}
}