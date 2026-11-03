teams = [
    {"id": "TM001", "name": "Red Comets"},
    {"id": "TM002", "name": "Blue Wolves"},
    {"id": "TM003", "name": "Green Giants"}
]

for team in teams:
    if team["id"] == "TM002":
        result = team["name"]
print(result)


def calculate_total(prices):
    result = sum(prices)
    return result

print(calculate_total([1500, 2500, 3000]))

def calculate_discount(price, percentage):
    return price - (price * percentage / 100)

print(calculate_discount(1000, 10))
print(calculate_discount(1000, 10))

prices = [100, 200, 300]

def process_prices(items):
    items.append(400)
    return sum(items)

result = process_prices(prices)

print(result)
print(prices)

teams = ["A", "B", "C", "D"]

for i in range(len(teams)):
    for j in range(i + 1, len(teams)):
        print(teams[i], teams[j])

teams = [
    {"name": "Red", "points": 9, "gd": 4, "gf": 8},
    {"name": "Blue", "points": 9, "gd": 6, "gf": 10},
    {"name": "Green", "points": 9, "gd": 6, "gf": 12}
]
print(sorted(teams, key=lambda t: t["points"]))
print("\n")
print(sorted(teams, key=lambda t: t["points"], reverse=True))

numbers = [5, 2, 9, 1, 7]

print(sorted(numbers))
print(sorted(numbers, reverse=True))

print(sorted(
        teams,
        key=lambda p: (
            -p["points"],
            -p["gd"],
            -p["gf"],
            p["name"].casefold()
        )
    )
)
# running = True
# while running:
# try:
#     score = int(input("Enter match score: "))
#     print(score)
# except ValueError:
#     print("Please enter valid integer.")

def validate_score(score):
    try:
        if type(score) is not int:
            return False
        score = int(score)
        print(type(score))
        if score >= 0:
            return True
        return False
    except ValueError:
        return False

print(validate_score(2.5))

try:
    score = int("hello")
except ValueError:
    print("Invalid score")
except TypeError:
    print("Wrong data type")

try:
    result = int("25")
except ValueError:
    print("Invalid")
else:
    print("Accepted")
finally:
    print("Validation finished")

import json

scores = {}
data = json.dumps(scores)

print(type(data))

def calculate_average(scores):
    return sum(scores) / len(scores)

print(calculate_average([10, 20, 30]))
# print(calculate_average([]))
print(True + 5)
print(False + 6)
