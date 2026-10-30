def find_largest(numbers):
    if numbers == []:
        return "None"
        pass
    result = numbers[0]

    for num in numbers:
        if num > result:
            result = num

    return result