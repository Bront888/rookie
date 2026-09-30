use std::io::{self, Write};

fn calculate() -> Option<f64> {
    let mut running = true;
    let mut final_result: Option<f64> = None;

    while running {
        // 1. Take user inputs safely
        print!("Enter first number: ");
        io::stdout().flush().unwrap(); // Force text to display immediately
        let mut first_input = String::new();
        io::stdin().read_line(&mut first_input).unwrap();
        let firstnum: i32 = match first_input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Invalid number format.");
                continue;
            }
        };

        print!("Enter operator (+, -, *, /): ");
        io::stdout().flush().unwrap();
        let mut operator_input = String::new();
        io::stdin().read_line(&mut operator_input).unwrap();
        let operator = operator_input.trim();

        print!("Enter second number: ");
        io::stdout().flush().unwrap();
        let mut second_input = String::new();
        io::stdin().read_line(&mut second_input).unwrap();
        let secondnum: i32 = match second_input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Invalid number format.");
                continue;
            }
        };

        let mut current_result: Option<f64> = None;

        // 2. Perform operations (Includes zero-division safety check)
        match operator {
            "+" => current_result = Some((firstnum + secondnum) as f64),
            "-" => current_result = Some((firstnum - secondnum) as f64),
            "*" => current_result = Some((firstnum * secondnum) as f64),
            "/" => {
                if secondnum == 0 {
                    println!("Error: Cannot divide by zero.");
                } else {
                    current_result = Some(firstnum as f64 / secondnum as f64);
                }
            }
            _ => println!("Invalid operator."),
        }

        // 3. Print the result if the calculation succeeded
        if let Some(res) = current_result {
            println!("Result: {}", res);
            final_result = Some(res); // Store the last valid calculation
        }

        // 4. Ask to continue
        print!("Do you wish to continue? (yes/no)\n");
        io::stdout().flush().unwrap();
        let mut end_session = String::new();
        io::stdin().read_line(&mut end_session).unwrap();
        let answer = end_session.trim().to_lowercase();

        if answer == "no" || answer == "n" {
            running = false;
            println!("See you next time :)");
        }
    }

    final_result
}

fn main() {
    calculate();
}
