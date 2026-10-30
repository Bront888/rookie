def count_occurences(numbers, target):
    if not numbers:
        return None
    count = 0
    for i in range(len(numbers)):
        if numbers[i] == target:
            count += 1

    return count