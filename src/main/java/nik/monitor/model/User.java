package nik.monitor.model;

import java.util.Map;

public class User extends pr.security.model.User {
	private String name;
	private String address;
	
	public User() {}
	
	public User(String login, String password, String email,
			String name, String address) {
		super(login, password, email, -1);
		this.name = name;
		this.address = address;
	}
	
	@Override
	public Map<String, Object> toMap() {
		Map<String, Object> ret = super.toMap();
		ret.put("name", name);
		ret.put("address", address);
		return ret;
	}

	@Override
	public String toString() {
		return super.toString() + ", name = " + name + ", address = " + address;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}