package pr.security.db.mappers;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface IMapperCreate {
	@Select("SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_CATALOG = #{dbName} AND TABLE_NAME = #{tableName};")
	int isDBexist(@Param("dbName") String dbName, @Param("tableName") String tableName);
	
	@Select("CREATE TABLE IF NOT EXISTS user(id INT PRIMARY KEY auto_increment, login VARCHAR(50), "
			+ "password VARCHAR(100), email VARCHAR(50), active BOOLEAN, "
			+ "attempts INT, lastmodified TIMESTAMP, maxAttempts INT);")
	Object createUserTable();
}