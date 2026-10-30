def find_number(numbers, target):
    for i in range(len(numbers)):
        if numbers[i] == target:
            return i
        

    return -1