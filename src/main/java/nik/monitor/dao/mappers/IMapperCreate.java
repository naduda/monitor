package nik.monitor.dao.mappers;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface IMapperCreate {
	@Select("SELECT count(*) > 0 FROM INFORMATION_SCHEMA.COLUMNS "
			+ "WHERE TABLE_NAME = #{tableName} AND COLUMN_NAME = #{columnName};")
	boolean isFieldExist(@Param("tableName") String tableName, @Param("columnName") String columnName);
	
	@Select("ALTER TABLE USER ADD (name VARCHAR(50), address VARCHAR(100));")
	Object alertTable();
}