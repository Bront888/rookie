def calculate():
    running = True

    while running:
        #safely collect user inputs
        firstnum = int(input())
        operator = input("")
        secondnum = int(input())
        final = None


        #perform operations including zero-divide safety check
        if operator == "+":
            final = firstnum + secondnum
        elif operator == "-":
            final = firstnum - secondnum
        elif operator == "*":
            final = firstnum * secondnum
        elif operator == "/":
            if secondnum == 0 :
                print("can't be divided by 0")
            else:
                firstnum / secondnum
        else:
            print("invalid operator")

        #print result if calculation succeeded
        if final is not None:
            print(f"Result: {final}")

        #ask to continue
        end_session = input("Do you wish to continue? (yes/no)\n").strip().lower()
        if end_session in ["no", "n"]:
            running = False
            print("See you next time :)")
    #return the very last calculation
    return final

calculate()