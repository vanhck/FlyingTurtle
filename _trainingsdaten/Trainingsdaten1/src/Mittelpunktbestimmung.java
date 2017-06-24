import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Mittelpunktbestimmung {
	
	public static void main (String [] args){
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		
		try {
			for (int i = 0; i < 20; i++) {
		}

			String line = (br.readLine());
			String[] geo = line.split(", ");
			double lon = Double.parseDouble(geo[0]);
			double lat = Double.parseDouble(geo[1]);
			
		
	}
	catch (Exception exc){
		System.err.println("IOException");
	}
		
		Double [] lat = new Double [10];
		Double [] lon = new Double [10];
		
		
		
	}

}
