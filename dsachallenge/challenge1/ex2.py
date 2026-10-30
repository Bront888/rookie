def find_smallest(numbers):
    if numbers == []:
        return None
    
    result = numbers[0]

    for num in numbers:
        if num < result:
            result = num

    return result