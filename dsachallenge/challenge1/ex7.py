def reverse_list(items):
    result = []
    
    i = len(items) -1
    while i >= 0:
        result.append(items[i])
        i -= 1
    return result