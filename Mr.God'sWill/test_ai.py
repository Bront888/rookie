
from ai_helper import get_ai_solution

issue = (
    "My Python program raises FileNotFoundError when "
    "trying to open a JSON file."
)

try:
    solution = get_ai_solution(issue)
    print("\n--- AI Suggested Solution ---\n")
    print(solution)

except Exception as error:
    print(f"AI request failed: {error}")
