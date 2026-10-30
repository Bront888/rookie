def list_sum(numbers):
    
    if numbers == []:
        return 0

    result = 0

    for num in numbers:
        result += num

    return result