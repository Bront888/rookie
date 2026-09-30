#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

void calculate() {
    bool running = true;
    double finalResult;
    bool hasResult;

    while (running) {
        int firstnum, secondnum;
        char op;
        std::string end_session;

        // 1. Take user inputs safely
        std::cout << "Enter first number: ";
        std::cin >> firstnum;

        std::cout << "Enter operator (+, -, *, /): ";
        std::cin >> op;

        std::cout << "Enter second number: ";
        std::cin >> secondnum;

        hasResult = false; // Reset tracker for this loop iteration

        // 2. Perform operations (Includes zero-division safety check)
        if (op == '+') {
            finalResult = static_cast<double>(firstnum + secondnum);
            hasResult = true;
        } else if (op == '-') {
            finalResult = static_cast<double>(firstnum - secondnum);
            hasResult = true;
        } else if (op == '*') {
            finalResult = static_cast<double>(firstnum * secondnum);
            hasResult = true;
        } else if (op == '/') {
            if (secondnum == 0) {
                std::cout << "Error: Cannot divide by zero.\n";
            } else {
                finalResult = static_cast<double>(firstnum) / secondnum; // Cast for decimal precision
                hasResult = true;
            }
        } else {
            std::cout << "Invalid operator.\n";
        }

        // 3. Print the result if the calculation succeeded
        if (hasResult) {
            std::cout << "Result: " << finalResult << "\n";
        }

        // 4. Ask to continue
        std::cout << "Do you wish to continue? (yes/no)\n";
        std::cin >> end_session;

        // Convert the string to lowercase using standard algorithm tools
        std::transform(end_session.begin(), end_session.end(), end_session.begin(), 
                       [](unsigned char c){ return std::tolower(c); });

        // Check if the user wants to exit
        if (end_session == "no" || end_session == "n") {
            running = false;
            std::cout << "See you next time :)\n";
        }
    }
}

// The official starting point of every C++ program
int main() {
    calculate();
    return 0;
}
