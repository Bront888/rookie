import java.util.scanner

public class Calculator {

    public static Double calculate () {
        Scanner scanner = new Scanner(system.in);
        boolean running = true;
        Double fialresult = null;

        while (running) {
            // Safely take in User inputs
            System.out.print("Enter first number:")
            int firstnum = scanner.nextInt();

            System.out.print("Enter operator (+, -, *, /)")
            String operator = scanner.next();

            System.out.print("Ente second number:")
            int secondnum = scanner.nextInt();

            finalresult = null // reset for this loop iteration

            //perform operations including zero-divide safety check
            if (operator.equals("+")) {
                finalresult = (double) (firstnum + secondnum)   
            } else if (operator.equals("-")) {
                finalresult = (double) (firstnum - secondnum)
            } else if (operator.equals("*")) {
                finalresult = (double) (firstnum * secondnum)
            } else if (operator.equals("/")) {
                if (operator == 0) {
                    System.out.println("Error: cannot divide by 0");
                } else {
                    finalresult = (double) firstnum / secondnum
                }
            } else {
                System.out.println("Error: Invalid operator.");
            }
            //print result if calculation succeeded
            if (finalresult != null) {
                System.out.println("Result =" + finalresult);
            }
            //ask to continue
            System.out.print("Do you wish to continue? (yes/no)\n");
            String endsession = scanner.next().trim().toLowerCase();

            if (endsession.equals("no")) || (endsession.equals("n")) {
                running = false
                System.out.println("See you next time :)");
            }
        }
        return finalresult;
    }

    public static void main(String[] args) {
        calculate();
    }

}