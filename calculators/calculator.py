def calculate():
    running = True

    while running:
        firstnum = int(input())
        operator = input("")
        secondnum = int(input())
        final = None



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

        if final is not None:
            print(f"Result: {final}")

        end_session = input("Do you wish to continue? (yes/no)\n")
        if end_session in ["no", "n", "No"]:
            running = False
            print("See you next time :)")
    return final

calculate()