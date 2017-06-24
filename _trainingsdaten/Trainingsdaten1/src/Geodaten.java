import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;

public class Geodaten implements Serializable {
	double lon; 
	double lat;
	//ArrayList<Date> demands = new ArrayList<Date>();
	
	public Geodaten (double lon, double lat) {
		super();
		this.lon = lon;
		this.lat = lat;
	}
	public String toString (){
		
		return "[" + lon + "," + lat +  "]";
	}
}
