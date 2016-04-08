package pr.security.db.mappers;

import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SecurityProvider {
	private static final Logger log = LoggerFactory.getLogger(SecurityProvider.class);

	@SuppressWarnings("unchecked")
	public String addUser(Map<String, Object> params) {
		Map<String, Object> user = (Map<String, Object>) params.get("user");
		String query = "INSERT INTO USER (#{fields}) VALUES (";
		
		String keys = "";
		Iterator<String> iterator = user.keySet().iterator();
		while(iterator.hasNext()) {
			String field = iterator.next();
			keys += field + ", ";
			Object value = user.get(field);
			switch (value.getClass().getSimpleName()) {
			case "String":
				query += "'" + value + "', ";
				break;
			case "Integer":
			case "Boolean":
				query += value + ", ";
				break;
			case "Timestamp":
				query += "'" + value + "', ";
				break;
			default:
				log.error("Unknown class " + value.getClass().getSimpleName());
				break;
			}
		}
		keys = keys.substring(0, keys.length() - 2);
		query = query.substring(0, query.length() - 2);
		query += ");";
		query = query.replace("#{fields}", keys);
		log.info(query);
		return query;
	}
}