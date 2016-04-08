package nik.monitor.dao.mappers;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import nik.monitor.model.User;

public interface IMapper {
	@Select("select * from user where login = #{login}")
	User getUserByLogin(@Param("login")String login);
	
	@Update("update user set " +
			"password = #{password}, email = #{email}, name = #{name}, address = #{address}" +
			"where id = #{id}")
	boolean updateUser(@Param("id") int idUser, @Param("password")String password,
			@Param("email")String email, @Param("name")String name, @Param("address")String address);
	
	@Update("update user set active = true where login = #{login}")
	boolean activateUser(@Param("login")String login);
	
	@Update("update user set active = false where login = #{login}")
	boolean deactivateUser(@Param("login")String login);
}