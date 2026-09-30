section .data
    prompt1 db "Enter first number (0-9): ", 0
    len1 equ $ - prompt1
    promptOp db "Enter operator (+, -, *): ", 0
    lenOp equ $ - promptOp
    prompt2 db "Enter second number (0-9): ", 0
    len2 equ $ - prompt2
    resMsg db "Result: ", 0
    lenRes equ $ - resMsg
    newline db 10

section .bss
    num1 resb 2
    num2 resb 2
    op   resb 2
    res  resb 2

section .text
    global _start

_start:
    ; 1. Prompt and read first number
    mov rax, 1          ; sys_write
    mov rdi, 1          ; stdout
    mov rsi, prompt1    ; text address
    mov rdx, len1       ; text length
    syscall

    mov rax, 0          ; sys_read
    mov rdi, 0          ; stdin
    mov rsi, num1       ; buffer memory
    mov rdx, 2          ; 2 bytes (char + newline)
    syscall

    ; 2. Prompt and read operator
    mov rax, 1
    mov rdi, 1
    mov rsi, promptOp
    mov rdx, lenOp
    syscall

    mov rax, 0
    mov rdi, 0
    mov rsi, op
    mov rdx, 2
    syscall

    ; 3. Prompt and read second number
    mov rax, 1
    mov rdi, 1
    mov rsi, prompt2
    mov rdx, len2
    syscall

    mov rax, 0
    mov rdi, 0
    mov rsi, num2
    mov rdx, 2
    syscall

    ; 4. Convert ASCII characters to actual integers ('5' becomes 5)
    mov al, [num1]
    sub al, '0'         ; Subtract 48 (ASCII code for '0')
    mov bl, [num2]
    sub bl, '0'

    ; 5. Check operator and perform math
    mov cl, [op]
    cmp cl, '+'
    je .add
    cmp cl, '-'
    je .sub
    cmp cl, '*'
    je .mul
    jmp .exit           ; If invalid operator, skip to exit

.add:
    add al, bl
    jmp .output

.sub:
    sub al, bl
    jmp .output

.mul:
    mul bl              ; Multiplies AL by BL, stores result in AL
    jmp .output

.output:
    ; 6. Convert integer back to ASCII character to print it
    add al, '0'
    mov [res], al

    ; Print "Result: "
    mov rax, 1
    mov rdi, 1
    mov rsi, resMsg
    mov rdx, lenRes
    syscall

    ; Print the raw calculated character
    mov rax, 1
    mov rdi, 1
    mov rsi, res
    mov rdx, 1
    syscall

    ; Print a newline character
    mov rax, 1
    mov rdi, 1
    mov rsi, newline
    mov rdx, 1
    syscall

.exit:
    ; 7. Safe exit system call (sys_exit)
    mov rax, 60         ; sys_exit
    xor rdi, rdi        ; return code 0
    syscall
