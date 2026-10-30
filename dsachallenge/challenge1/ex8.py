def has_duplicates(numbers):
    seen = set()
    for num in numbers:
        if num in seen:
            return True
        seen.add(num)
    return False