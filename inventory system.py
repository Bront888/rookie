resource_Id = None
resource_name = None
resource_quantity = None

StorageList = [{"id": resource_Id, "name":resource_name, "quantity": 10},]
running = True
while running:
    print("=" * 50)
    print("          LEARN2EARN INVENTORY SYSTEM")
    print("=" * 50)

    active_choice = True
    while active_choice:
        print("1. Add Resource")
        print("2. List Resources")
        print("3. Borrow Resources")
        print("4. Return Resources")
        print("5. Search By Name")
        print("6. Generate Reports")
        print("7. Exit")
        print("-" * 50)


        choice = input("Enter your choice (1-7): ")
        choice_made = True
        while choice_made:
            if choice == "1":
                print("--- ADD NEW RESOURCE ---")
                resource_Id = input("Enter resource ID: ")
                resource_name = input("Enter resource name: ")
                resource_quantity = int(input("Enter Total Units: "))
                StorageList.append({"id": resource_Id, "name": resource_name, "quantity": int(resource_quantity)})
                print(f"Added {resource_Id} - {resource_name}, {resource_quantity} to the inventory.")
                continue_choice = input("Do you want to continue? (y/n): ")
                if continue_choice.lower() == "n":
                    choice_made = False



            elif choice == "2":
                print("--- LIST OF RESOURCES ---")
                if not StorageList:
                    print("No resources found.")
                else:
                    for resource in StorageList:
                        print(f"ID: {resource['id']}, Name: {resource['name']}, Quantity: {resource['quantity']}")
                continue_choice = input("Do you want to continue? (y/n): ")
                if continue_choice.lower() == "n":
                    choice_made = False



            elif choice == "3":
                print("--- BORROW RESOURCE ---")
                borrow_id = input("Enter resource ID to borrow: ")
                found = False
                for resource in StorageList:
                    if resource["id"] == borrow_id:
                        found = True
                        if resource["quantity"] > 0:
                            resource["quantity"] -= 1
                            print(f"Borrowed {resource['name']}. Remaining quantity: {resource['quantity']}")
                        else:
                            print(f"{resource['name']} is out of stock.")
                        break
                if not found:
                    print("Resource not found.")
                continue_choice = input("Do you want to continue? (y/n): ")
                if continue_choice.lower() == "n":
                    choice_made = False


                
            elif choice == "4":
                print("--- RETURN RESOURCE ---")
                return_id = input("Enter resource ID to return: ")
                found = False
                for resource in StorageList:
                    if resource["id"] == return_id:
                        found = True
                        resource["quantity"] += 1
                        print(f"Returned {resource['name']}. New quantity: {resource['quantity']}")
                        break
                if not found:
                    print("Resource not found.")
                continue_choice = input("Do you want to continue? (y/n): ")
                if continue_choice.lower() == "n":
                    choice_made = False



            elif choice == "5":
                print("--- SEARCH RESOURCE BY NAME ---")
                search_name = input("Enter resource name to search: ")
                found = False
                for resource in StorageList:
                    if resource["name"].lower() == search_name.lower():
                        found = True
                        print(f"ID: {resource['id']}, Name: {resource['name']}, Quantity: {resource['quantity']}")
                        break
                if not found:
                    print("Resource not found.")
                continue_choice = input("Do you want to continue? (y/n): ")
                if continue_choice.lower() == "n":
                    choice_made = False



            elif choice == "6":
                print("--- GENERATE REPORTS ---")
                total_resources = len(StorageList)
                total_quantity = sum(resource["quantity"] for resource in StorageList)
                print(f"Total Resources: {total_resources}")
                print(f"Total Quantity of All Resources: {total_quantity}")
                continue_choice = input("Do you want to continue? (y/n): ")
                if continue_choice.lower() == "n":
                    choice_made = False



            elif choice == "7":
                print("Exiting the program. Goodbye!")
                running = False
                choice_made = False
                active_choice = False



            else:
                print("Invalid choice. Please enter a number between 1 and 7.")
                choice_made = False
