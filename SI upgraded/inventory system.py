"""Learn2Earn Equipment Lending System.

Stores resource inventory, issues items to fellows, accepts returns,
searches/filters inventory and produces reports.
Python standard library only.

Run the menu:        python learn2earn.py
Run the demo checks: python learn2earn.py --demo
"""

import json
import os
import re
import sys

DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.json")
LOW_STOCK_LIMIT = 3
RESOURCE_ID_PATTERN = re.compile(r"^R[0-9]{3}$")


# --------------------------------------------------------------------------
# Data and small helpers
# --------------------------------------------------------------------------

def starting_data():
    """Return a fresh copy of the starting state."""
    return {
        "resources": [
            {"id": "R001", "name": "Laptop", "category": "Electronics", "total": 10, "available": 10},
            {"id": "R002", "name": "Keyboard", "category": "Accessories", "total": 5, "available": 5},
            {"id": "R003", "name": "Headset", "category": "Accessories", "total": 3, "available": 3},
        ],
        "fellows": {"F001": "Ada", "F002": "John", "F003": "Grace"},
        "borrow_records": [],
    }


def normalize_id(text):
    """Trim spaces and uppercase so ' r001 ' and 'R001' are the same ID."""
    return str(text).strip().upper()


def parse_positive_int(value):
    """Return value as a positive int, or None if it is not one."""
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        number = value
    else:
        text = str(value).strip()
        if not re.fullmatch(r"[0-9]+", text):
            return None
        number = int(text)
    return number if number > 0 else None


def find_resource(state, resource_id):
    wanted = normalize_id(resource_id)
    for resource in state["resources"]:
        if resource["id"] == wanted:
            return resource
    return None


def outstanding_for(state, fellow_id, resource_id):
    """Units this fellow currently has on loan for this resource."""
    return sum(
        rec["quantity"] - rec["returned"]
        for rec in state["borrow_records"]
        if rec["fellow_id"] == fellow_id and rec["resource_id"] == resource_id
    )


def _next_number(ids, prefix):
    numbers = [int(i[1:]) for i in ids if re.fullmatch(prefix + "[0-9]+", i)]
    return max(numbers, default=0) + 1


def next_resource_id(state):
    return "R{:03d}".format(_next_number([r["id"] for r in state["resources"]], "R"))


def next_record_id(state):
    return "B{:03d}".format(_next_number([r["record_id"] for r in state["borrow_records"]], "B"))


def check_new_resource_id(state, resource_id):
    """Return an error message if the ID cannot be used, else None."""
    rid = normalize_id(resource_id)
    if not RESOURCE_ID_PATTERN.match(rid):
        return "Resource ID must be the letter R followed by 3 digits (e.g. R004)."
    if find_resource(state, rid) is not None:
        return "{} already exists. Next available ID: {}.".format(rid, next_resource_id(state))
    return None


# --------------------------------------------------------------------------
# Core operations (validate everything first, then change state)
# Each returns (success: bool, message: str)
# --------------------------------------------------------------------------

def add_resource(state, resource_id, name, category, total):
    error = check_new_resource_id(state, resource_id)
    if error:
        return False, error
    name = str(name).strip()
    category = str(category).strip()
    if not name:
        return False, "Resource name cannot be empty."
    if not category:
        return False, "Category cannot be empty."
    units = parse_positive_int(total)
    if units is None:
        return False, "Total units must be a positive whole number."

    rid = normalize_id(resource_id)
    state["resources"].append(
        {"id": rid, "name": name, "category": category, "total": units, "available": units}
    )
    return True, "Added {} - {} ({}), {} unit(s) available.".format(rid, name, category, units)


def borrow_item(state, fellow_id, resource_id, quantity):
    fid = normalize_id(fellow_id)
    if fid not in state["fellows"]:
        return False, "Fellow {} not found.".format(fid)
    resource = find_resource(state, resource_id)
    if resource is None:
        return False, "Resource {} not found.".format(normalize_id(resource_id))
    units = parse_positive_int(quantity)
    if units is None:
        return False, "Quantity must be a positive whole number."
    if units > resource["available"]:
        return False, "Only {} {} unit(s) available, you asked for {}.".format(
            resource["available"], resource["name"], units
        )

    # All checks passed - now it is safe to change state.
    resource["available"] -= units
    record_id = next_record_id(state)
    state["borrow_records"].append(
        {
            "record_id": record_id,
            "fellow_id": fid,
            "resource_id": resource["id"],
            "quantity": units,
            "returned": 0,
        }
    )
    return True, "{} borrowed {} x {}. {} available: {}. Record {} saved.".format(
        state["fellows"][fid], units, resource["name"], resource["name"], resource["available"], record_id
    )


def return_item(state, fellow_id, resource_id, quantity):
    fid = normalize_id(fellow_id)
    if fid not in state["fellows"]:
        return False, "Fellow {} not found.".format(fid)
    resource = find_resource(state, resource_id)
    if resource is None:
        return False, "Resource {} not found.".format(normalize_id(resource_id))
    units = parse_positive_int(quantity)
    if units is None:
        return False, "Quantity must be a positive whole number."
    on_loan = outstanding_for(state, fid, resource["id"])
    if units > on_loan:
        return False, "{} only has {} {} unit(s) on loan.".format(
            state["fellows"][fid], on_loan, resource["name"]
        )

    # Apply the return to the oldest open records first.
    remaining = units
    for rec in state["borrow_records"]:
        if remaining == 0:
            break
        if rec["fellow_id"] == fid and rec["resource_id"] == resource["id"]:
            open_units = rec["quantity"] - rec["returned"]
            if open_units > 0:
                taken = min(open_units, remaining)
                rec["returned"] += taken
                remaining -= taken
    resource["available"] += units
    still_held = on_loan - units
    return True, "{} returned {} x {}. {} available: {} ({} still holds {}).".format(
        state["fellows"][fid], units, resource["name"], resource["name"],
        resource["available"], state["fellows"][fid], still_held
    )


def search_resources(state, term):
    """Case-insensitive name search (partial matches allowed)."""
    needle = str(term).strip().lower()
    if not needle:
        return []
    return [r for r in state["resources"] if needle in r["name"].lower()]


def filter_by_category(state, category):
    wanted = str(category).strip().lower()
    return [r for r in state["resources"] if r["category"].lower() == wanted]


def categories(state):
    seen = []
    for r in state["resources"]:
        if r["category"] not in seen:
            seen.append(r["category"])
    return seen


def build_report(state):
    resources = state["resources"]
    total_units = sum(r["total"] for r in resources)
    available_units = sum(r["available"] for r in resources)
    borrowed_units = total_units - available_units
    low_stock = [r for r in resources if r["available"] < LOW_STOCK_LIMIT]

    borrowed_by_resource = [(r, r["total"] - r["available"]) for r in resources]
    top = max((count for _, count in borrowed_by_resource), default=0)
    leaders = [r for r, count in borrowed_by_resource if count == top] if top > 0 else []

    return {
        "total_units": total_units,
        "available_units": available_units,
        "borrowed_units": borrowed_units,
        "low_stock": low_stock,
        "top_borrowed": leaders,
        "top_borrowed_count": top,
    }


# --------------------------------------------------------------------------
# Saving and loading (JSON bonus)
# --------------------------------------------------------------------------

def is_valid_state(data):
    """Check a loaded file is well-formed and consistent."""
    try:
        if not isinstance(data, dict) or not isinstance(data["fellows"], dict):
            return False
        ids = set()
        for r in data["resources"]:
            if not all(k in r for k in ("id", "name", "category", "total", "available")):
                return False
            if not (isinstance(r["total"], int) and isinstance(r["available"], int)):
                return False
            if not 0 <= r["available"] <= r["total"] or r["id"] in ids:
                return False
            ids.add(r["id"])
        open_by_resource = {}
        for rec in data["borrow_records"]:
            if not all(k in rec for k in ("record_id", "fellow_id", "resource_id", "quantity", "returned")):
                return False
            if not (isinstance(rec["quantity"], int) and isinstance(rec["returned"], int)):
                return False
            if rec["resource_id"] not in ids or not 0 <= rec["returned"] <= rec["quantity"]:
                return False
            open_by_resource[rec["resource_id"]] = (
                open_by_resource.get(rec["resource_id"], 0) + rec["quantity"] - rec["returned"]
            )
        for r in data["resources"]:
            if r["total"] - r["available"] != open_by_resource.get(r["id"], 0):
                return False
        return True
    except (KeyError, TypeError):
        return False


def save_data(state):
    """Write state to disk. Returns True on success."""
    temp_path = DATA_FILE + ".tmp"
    try:
        with open(temp_path, "w", encoding="utf-8") as handle:
            json.dump(state, handle, indent=2)
        os.replace(temp_path, DATA_FILE)
        return True
    except OSError as error:
        print("Warning: could not save data ({}).".format(error))
        return False


def load_data():
    """Load saved state, or fall back to the starting data."""
    if not os.path.exists(DATA_FILE):
        return starting_data()
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, ValueError):
        print("Warning: saved data could not be read. Starting with default data.")
        return starting_data()
    if not is_valid_state(data):
        print("Warning: saved data is inconsistent. Starting with default data.")
        return starting_data()
    return data


# --------------------------------------------------------------------------
# Display helpers
# --------------------------------------------------------------------------

def print_table(resources):
    if not resources:
        print("No resources to show.")
        return
    name_w = max([len("Name")] + [len(r["name"]) for r in resources])
    cat_w = max([len("Category")] + [len(r["category"]) for r in resources])
    header = "{:<6}  {:<{nw}}  {:<{cw}}  {:>5}  {:>9}".format(
        "ID", "Name", "Category", "Total", "Available", nw=name_w, cw=cat_w
    )
    print(header)
    print("-" * len(header))
    for r in resources:
        print("{:<6}  {:<{nw}}  {:<{cw}}  {:>5}  {:>9}".format(
            r["id"], r["name"], r["category"], r["total"], r["available"], nw=name_w, cw=cat_w
        ))


def print_report(state):
    report = build_report(state)
    print("========== INVENTORY REPORT ==========")
    print("Total units:        {}".format(report["total_units"]))
    print("Available units:    {}".format(report["available_units"]))
    print("Borrowed units:     {}".format(report["borrowed_units"]))
    print()
    print("Low stock (< {} available):".format(LOW_STOCK_LIMIT))
    if report["low_stock"]:
        for r in report["low_stock"]:
            print("  - {} ({}): {} available".format(r["name"], r["id"], r["available"]))
    else:
        print("  None")
    print()
    print("Most borrowed resource(s):")
    if report["top_borrowed"]:
        for r in report["top_borrowed"]:
            print("  - {}: {} unit(s) currently on loan".format(r["name"], report["top_borrowed_count"]))
    else:
        print("  No units currently borrowed.")
    print("======================================")


def show_result(success, message):
    print(("OK: " if success else "Rejected: ") + message)
    if not success:
        print("(No changes made.)")


# --------------------------------------------------------------------------
# Menu handlers (they only collect input and call the core functions)
# --------------------------------------------------------------------------

def ask(prompt):
    return input(prompt).strip()


def menu_add(state):
    print("--- ADD RESOURCE --- (leave the ID blank to cancel)")
    while True:
        rid = ask("Resource ID (suggested {}): ".format(next_resource_id(state)))
        if not rid:
            print("Cancelled.")
            return
        error = check_new_resource_id(state, rid)
        if error is None:
            break
        print("Rejected: " + error)
    name = ask("Name: ")
    category = ask("Category: ")
    total = ask("Total units: ")
    success, message = add_resource(state, rid, name, category, total)
    show_result(success, message)
    if success:
        save_data(state)


def menu_list(state):
    print("--- ALL RESOURCES ---")
    print_table(state["resources"])


def menu_borrow(state):
    print("--- BORROW ---")
    fellow = ask("Fellow ID: ")
    resource = ask("Resource ID: ")
    quantity = ask("Quantity: ")
    success, message = borrow_item(state, fellow, resource, quantity)
    show_result(success, message)
    if success:
        save_data(state)


def menu_return(state):
    print("--- RETURN ---")
    fellow = ask("Fellow ID: ")
    resource = ask("Resource ID: ")
    quantity = ask("Quantity: ")
    success, message = return_item(state, fellow, resource, quantity)
    show_result(success, message)
    if success:
        save_data(state)


def menu_search(state):
    print("--- SEARCH BY NAME ---")
    term = ask("Search name: ")
    results = search_resources(state, term)
    if results:
        print('Results for "{}":'.format(term))
        print_table(results)
    else:
        print('No resources found matching "{}".'.format(term))


def menu_filter(state):
    print("--- FILTER BY CATEGORY ---")
    known = categories(state)
    if known:
        print("Categories: " + ", ".join(known))
    category = ask("Category: ")
    results = filter_by_category(state, category)
    if results:
        print_table(results)
    else:
        print('No resources found in category "{}".'.format(category))


def menu_report(state):
    print_report(state)


MENU_ACTIONS = {
    "1": menu_add,
    "2": menu_list,
    "3": menu_borrow,
    "4": menu_return,
    "5": menu_search,
    "6": menu_filter,
    "7": menu_report,
}


def print_menu():
    print()
    print("=" * 41)
    print("   LEARN2EARN EQUIPMENT LENDING SYSTEM")
    print("=" * 41)
    print(" 1. Add resource")
    print(" 2. List resources")
    print(" 3. Borrow resource")
    print(" 4. Return resource")
    print(" 5. Search by name")
    print(" 6. Filter by category")
    print(" 7. Reports")
    print(" 8. Exit")
    print("-" * 41)


def main():
    state = load_data()
    try:
        while True:
            print_menu()
            choice = ask("Choose an option (1-8): ")
            if choice == "8":
                break
            action = MENU_ACTIONS.get(choice)
            if action is None:
                print("Please enter a number from 1 to 8.")
                continue
            print()
            action(state)
    except (EOFError, KeyboardInterrupt):
        print()
    if save_data(state):
        print("Goodbye! (Data saved to {})".format(os.path.basename(DATA_FILE)))
    else:
        print("Goodbye!")


# --------------------------------------------------------------------------
# Required demonstration (python learn2earn.py --demo)
# Uses fresh starting data and never touches data.json.
# --------------------------------------------------------------------------

def run_demo():
    state = starting_data()
    results = []

    def check(label, condition):
        results.append(condition)
        print("   [{}] {}".format("PASS" if condition else "FAIL", label))

    def laptop():
        return find_resource(state, "R001")["available"]

    def keyboard():
        return find_resource(state, "R002")["available"]

    print("1. F001 borrows 2 laptops")
    show_result(*borrow_item(state, "F001", "R001", 2))
    check("laptop available = 8", laptop() == 8)

    print("2. F002 borrows 3 keyboards")
    show_result(*borrow_item(state, "F002", "R002", 3))
    check("keyboard available = 2", keyboard() == 2)

    print("3. F001 returns 1 laptop")
    show_result(*return_item(state, "F001", "R001", 1))
    check("laptop available = 9", laptop() == 9)

    print("4. F003 requests 4 headsets")
    before = json.dumps(state, sort_keys=True)
    success, message = borrow_item(state, "F003", "R003", 4)
    show_result(success, message)
    check("rejected and state unchanged", not success and json.dumps(state, sort_keys=True) == before)

    print("5. F002 tries to return 4 keyboards")
    before = json.dumps(state, sort_keys=True)
    success, message = return_item(state, "F002", "R002", 4)
    show_result(success, message)
    check("rejected and state unchanged", not success and json.dumps(state, sort_keys=True) == before)

    print('6. Search for "LAPtop"')
    found = search_resources(state, "LAPtop")
    print_table(found)
    check("finds Laptop ignoring case", [r["name"] for r in found] == ["Laptop"])

    print("7. Generate the report")
    print_report(state)
    report = build_report(state)
    check("total 18, available 14, borrowed 4",
          (report["total_units"], report["available_units"], report["borrowed_units"]) == (18, 14, 4))
    check("Keyboard is the only low-stock item (2)",
          [(r["name"], r["available"]) for r in report["low_stock"]] == [("Keyboard", 2)])
    check("Keyboard is most borrowed (3)",
          [r["name"] for r in report["top_borrowed"]] == ["Keyboard"] and report["top_borrowed_count"] == 3)

    print()
    print("Demo result: {} of {} checks passed.".format(sum(results), len(results)))


if __name__ == "__main__":
    if "--demo" in sys.argv[1:]:
        run_demo()
    else:
        main()