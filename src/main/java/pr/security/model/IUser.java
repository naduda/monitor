package pr.security.model;

import java.sql.Timestamp;
import java.util.Map;

public interface IUser {
	int getId();
	String getLogin();
	String getPassword();
	void setPassword(String value);
	String getEmail();
	int getAttempts();
	void setAttempts(int value);
	void setMaxAttempts(int value);
	Timestamp getLastmodified();
	boolean isLocked();
	boolean isActive();
	Map<String, Object> toMap();
}