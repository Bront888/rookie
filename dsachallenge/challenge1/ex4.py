def count_even(numbers):
    result = 0

    for num in numbers:
        if num % 2 == 0:
            result += 1
        # if num % 2 == 0:
        #     result.append(num)

    return result