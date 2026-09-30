#include <stdio.h>
#include <string.h>
#include <ctype.h>

void calculate() {
    int running = 1; // In C, 1 represents true and 0 represents false
    double finalResult;
    int hasResult;

    while (running) {
        int firstnum, secondnum;
        char op; // We use a single character for the operator
        char end_session[10];

        // 1. Take user inputs safely
        printf("Enter first number: ");
        scanf("%d", &firstnum);

        printf("Enter operator (+, -, *, /): ");
        scanf(" %c", &op); // The space before %c skips any leftover newline characters

        printf("Enter second number: ");
        scanf("%d", &secondnum);

        hasResult = 0; // Reset result tracker for this loop iteration

        // 2. Perform operations (Includes zero-division safety check)
        if (op == '+') {
            finalResult = (double)(firstnum + secondnum);
            hasResult = 1;
        } else if (op == '-') {
            finalResult = (double)(firstnum - secondnum);
            hasResult = 1;
        } else if (op == '*') {
            finalResult = (double)(firstnum * secondnum);
            hasResult = 1;
        } else if (op == '/') {
            if (secondnum == 0) {
                printf("Error: Cannot divide by zero.\n");
            } else {
                finalResult = (double)firstnum / secondnum; // Cast to double for decimal precision
                hasResult = 1;
            }
        } else {
            printf("Invalid operator.\n");
        }

        // 3. Print the result if the calculation succeeded
        if (hasResult) {
            printf("Result: %.2f\n", finalResult); // %.2f prints exactly 2 decimal places
        }

        // 4. Ask to continue
        printf("Do you wish to continue? (yes/no)\n");
        scanf("%s", end_session);

        // Convert the string to lowercase manually
        for(int i = 0; end_session[i]; i++){
            end_session[i] = tolower(end_session[i]);
        }

        // Check if the user wants to exit
        if (strcmp(end_session, "no") == 0 || strcmp(end_session, "n") == 0) {
            running = 0;
            printf("See you next time :)\n");
        }
    }
}

// The official starting point of every C program
int main() {
    calculate();
    return 0;
}
