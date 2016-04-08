package pr.security.db;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import pr.dao.BatisImpl;
import pr.dao.IBatis;
import pr.security.db.mappers.IMapperCreate;

@Component
public class DatabaseBuilder {
	private static final Logger log = LoggerFactory.getLogger(DatabaseBuilder.class);
	private BatisImpl batis;
	@Value("${pr.security.databaseName}")
	private String dbName;
	private boolean wasCreated;
	
	public DatabaseBuilder setBatis(BatisImpl batis) {
		this.batis = batis;
		return this;
	}
	
	public DatabaseBuilder create() {
		IBatis isExist = s -> s.getMapper(IMapperCreate.class).isDBexist(dbName.toUpperCase(), "USER");
		boolean isTableUserExist = (int)batis.setIBatis(isExist).get() > 0;
		if(!isTableUserExist) {
			IBatis createTableUser = s -> s.getMapper(IMapperCreate.class).createUserTable();
						
			if(batis.setIBatis(createTableUser).run()) {
				log.info("***************   create table user".toUpperCase());
			}
			this.wasCreated = true;
		} else {
			log.info("***************   table user exist   ***************".toUpperCase());
			this.wasCreated = false;
		}
		return this;
	}
	
	public boolean wasCreated() {
		return this.wasCreated;
	}
}