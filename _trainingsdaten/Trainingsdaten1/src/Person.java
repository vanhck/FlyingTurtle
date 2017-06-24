import java.io.Serializable;
import java.util.Date;
import java.util.Iterator;
import java.util.ArrayList;

public class Person implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	double lon; 
	double lat;
	ArrayList<Date> demands = new ArrayList<Date>();
	
	public Person(double lon, double lat) {
		super();
		this.lon = lon;
		this.lat = lat;
	}

	public void addDate(Date date) {
		
		demands.add(date);
	}
	
	public String toString() {
		String dateStr = "";
		for (Iterator iterator = demands.iterator(); iterator.hasNext();) {
			Date date = (Date) iterator.next();
			dateStr += date.getTime() + ",";
			//dateStr += date.toString() + ",";
		}
		return lon + "," + lat + "," + dateStr;
	}
}
