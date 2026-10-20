
from ticket_operation import (
    load_tickets,
    create_ticket,
    view_tickets,
    add_note,
    get_ticket_solution,
)


def main():
    tickets = load_tickets()

    while True:
        print("\n--- Ticket System ---")
        print("1. Create Ticket")
        print("2. View All Tickets")
        print("3. Add Note")
        print("4. Get AI Solution")
        print("5. Exit")

        choice = input("Choose 1-5: ").strip()

        if choice == "1":
            create_ticket(tickets)

        elif choice == "2":
            view_tickets(tickets)

        elif choice == "3":
            add_note(tickets)

        elif choice == "4":
            get_ticket_solution(tickets)

        elif choice == "5":
            print("Goodbye!")
            break

        else:
            print("Invalid choice. Choose 1-5.")


if __name__ == "__main__":
    main()
