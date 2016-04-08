package pr.security.db.mappers;

import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.Update;

import pr.security.model.User;

public interface IMapper {
	@SelectProvider(type=SecurityProvider.class, method="addUser")
	Boolean addUser(@Param("user") Map<String, Object> user);
	
	@Update("update user set password = #{password}, email = #{email}, active = #{active} where id = #{id};")
	boolean updateUser(@Param("id") int idUser, @Param("password")String password,
			@Param("email")String email, @Param("active") boolean active);
	
	@Delete("delete from user where id = #{id}")
	boolean deleteUserFromDB(@Param("id")int id);
	
	@Select("select * from user where login = #{login}")
	User getUserByLogin(@Param("login")String login);
	
	@Select("select * from user where email = #{email}")
	User getUserByEmail(@Param("email")String email);
	
	@Select("select * from user where id = #{id}")
	User getUser(@Param("id")int idUser);
	
	@Update("update user set " +
			"attempts = #{attempts}, lastModified = now() " +
			"where id = #{id}")
	boolean updateUserAttempts(@Param("id") int idUser, @Param("attempts") int attempts);
}