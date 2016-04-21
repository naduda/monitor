package pr;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogsTools {
	private static final Logger loger = LoggerFactory.getLogger(LogsTools.class);
	
	private int length;
	private StringBuilder log;
	private char defaultChar;
	private int number;
	
//	public static void main(String[] args) {
//		LogsTools lt = new LogsTools(50, '*', "Test title");
////		lt.addRow("SecureDatabaseAPITest is SUCCESS");
////		lt.addRow("Create custom user with string, int, double, boolean, timestamp fields is SUCCESS");
//		lt.addRow("SecureDatabaseAPITest is SUCCESS Create custom user with string, int, double, boolean, timestamp fields is SUCCESS");
//		loger.info(lt.getLogs());
//		
//		lt = new LogsTools(70, '·', "Test title");
//		lt.addRow("SecureDatabaseAPITest is SUCCESS");
//		lt.addRow("Method addUser is SUCCESS");
//		loger.info(lt.getLogs());
//	}
	
	public LogsTools(int length, char defaultChar, String title) {
		this.length = length;
		this.defaultChar = defaultChar;
		this.log = new StringBuilder();
		log.append("\n\n\n");
		addRowChars(defaultChar);
		addTitle(title);
		addEmptyRow();
		loger.debug("Init");
	}
	
	private void addTitle(String s) {
		String v = defaultChar + "";
		for(int i = 0; i < (int)(length - s.length() - 2) / 2; i++){
			v += " ";
		}
		v += s.toUpperCase();
		while(v.length() < length - 1) v += " ";
		v += defaultChar + "\n";
		log.append(v);
		v = "";
		while(v.length() < length) v += defaultChar;
		v += "\n";
		log.append(v);
	}
	
	private void addRowChars(char ch) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < length; i++) {
			builder.append(ch);
		}
		builder.append("\n");
		this.log.append(builder.toString());
	}
	
	private void addEmptyRow() {
		StringBuilder s = new StringBuilder();
		s.append(defaultChar);
		String value = "";
		while(value.length() < length - 2) {
			value += " ";
		}
		value += defaultChar + "\n";
		s.append(value);
		log.append(s.toString());
	}
	
	public void addRow(String value, boolean isNewRowNumber) {
		StringBuilder s = new StringBuilder();
		s.append(defaultChar);
		if (isNewRowNumber) {
			number++;
			s.append((number < 10 ? "  " : " ") + number + ". ");
		} else {
			s.append("     ");
		}
		String endString = value;
		
		value = value.length() < length - 9 ? value : value.substring(0, length - 9);
		while(value.length() < length - 7) {
			value += " ";
		}
		s.append(value);
		s.append(defaultChar + "\n");
		this.log.append(s.toString());
		
		if (endString.length() > length - 9) {
			endString = endString.substring(length - 9);
			addRow(endString, false);
		}
	}
	
	public void addRow(String value) {
		addRow(value, true);
	}
	
	public String getLogs() {
		addEmptyRow();
		addRowChars(defaultChar);
		log.append("\n");
		return log.toString();
	}
}