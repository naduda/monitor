package pr.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogsTools {
	private static final Logger loger = LoggerFactory.getLogger(LogsTools.class);
	
	private int length;
	private StringBuilder log;
	private char defaultChar;
	private int number;
	
	public static void main(String[] args) {
		LogsTools lt = new LogsTools(50, '*', "Test title");
		lt.addRow("SecureDatabaseAPITest is SUCCESS");
		lt.addRow("Method addUser is SUCCESS");
		loger.info(lt.getLogs());
		
		lt = new LogsTools(70, '·', "Test title");
		lt.addRow("SecureDatabaseAPITest is SUCCESS");
		lt.addRow("Method addUser is SUCCESS");
		loger.info(lt.getLogs());
	}
	
	public LogsTools(int length, char defaultChar, String title) {
		this.length = length;
		this.defaultChar = defaultChar;
		this.log = new StringBuilder();
		log.append("\n\n\n");
		addRowChars(defaultChar);
		addTitle(title);
		addEmptyRow();
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
	
	public void addRow(String value) {
		number++;
		StringBuilder s = new StringBuilder();
		s.append(defaultChar);
		s.append((number < 10 ? "  " : " ") + number + ". ");
		value = value.length() < length - 7 ? value : value.substring(0, length);
		while(value.length() < length - 7) {
			value += " ";
		}
		s.append(value);
		s.append(defaultChar + "\n");
		this.log.append(s.toString());
	}
	
	public String getLogs() {
		addEmptyRow();
		addRowChars(defaultChar);
		log.append("\n");
		return log.toString();
	}
}