
import json
from pathlib import Path

from ai_helper import get_ai_solution

FILE_NAME = Path("store.json")


def load_tickets():
    if not FILE_NAME.exists():
        return []

    try:
        with FILE_NAME.open("r", encoding="utf-8") as file:
            tickets = json.load(file)

        if not isinstance(tickets, list):
            print("Could not load tickets: expected a JSON list.")
            return []

        return tickets

    except (json.JSONDecodeError, OSError) as error:
        print(f"Could not load tickets: {error}")
        return []


def save_tickets(tickets):
    with FILE_NAME.open("w", encoding="utf-8") as file:
        json.dump(tickets, file, indent=4)


def create_ticket(tickets):
    name = input("What's your name? ").strip()
    issue = input("What's the issue? ").strip()
    detail = input("Any other details? ").strip()

    if not name or not issue:
        print("Name and issue cannot be empty.")
        return

    tickets.append({
        "name": name,
        "issue": issue,
        "detail": detail,
        "solution": None,
        "notes": []
    })

    try:
        save_tickets(tickets)
        print("Ticket saved successfully!")
    except OSError as error:
        tickets.pop()
        print(f"Could not save ticket: {error}")


def view_tickets(tickets):
    if not tickets:
        print("No tickets found.")
        return

    for number, ticket in enumerate(tickets, start=1):
        print(f"\nTicket #{number}")
        print(f"Name: {ticket.get('name', 'Unknown')}")
        print(f"Issue: {ticket.get('issue', 'No issue description')}")
        print(f"Details: {ticket.get('detail', '')}")
        print(
            f"AI Solution: "
            f"{ticket.get('solution') or 'Not generated yet'}"
        )

        notes = ticket.get("notes", [])
        if notes:
            print("Notes:")
            for note in notes:
                print(f"- {note}")


def add_note(tickets):
    if not tickets:
        print("No tickets available.")
        return

    view_tickets(tickets)

    try:
        number = int(input("\nTicket number: "))

        if not 1 <= number <= len(tickets):
            print("Invalid ticket number.")
            return

        ticket = tickets[number - 1]
        note = input("Enter your note: ").strip()

        if not note:
            print("Note cannot be empty.")
            return

        ticket.setdefault("notes", []).append(note)

        try:
            save_tickets(tickets)
            print("Note saved successfully!")
        except OSError as error:
            ticket["notes"].pop()
            print(f"Could not save note: {error}")

    except ValueError:
        print("Please enter a valid ticket number.")


def get_ticket_solution(tickets):
    if not tickets:
        print("No tickets available.")
        return

    view_tickets(tickets)

    try:
        number = int(input("\nEnter the ticket number to troubleshoot: "))

        if not 1 <= number <= len(tickets):
            print("Invalid ticket number.")
            return

    except ValueError:
        print("Please enter a valid ticket number.")
        return

    ticket = tickets[number - 1]

    issue = ticket.get("issue", "").strip()
    detail = ticket.get("detail", "").strip()

    if not issue:
        print("This ticket has no issue description.")
        return

    prompt = f"Issue: {issue}"

    if detail:
        prompt += f"\nAdditional details: {detail}"

    print("\nAsking the AI to analyze your ticket...")
    print("Please wait.\n")

    try:
        solution = get_ai_solution(prompt)

    except (RuntimeError, ValueError) as error:
        print(f"Could not generate a solution: {error}")
        return

    print("--- AI Suggested Solution ---\n")
    print(solution)

    previous_solution = ticket.get("solution")

    ticket["solution"] = solution

    try:
        save_tickets(tickets)
        print("\nAI solution saved to the ticket!")

    except OSError as error:
        ticket["solution"] = previous_solution
        print(f"\nThe solution was generated but could not be saved: {error}")
