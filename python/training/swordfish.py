while True:
    print('Who are you?')
    name = input()
    if name != 'Joe':
        continue
    print('Hello Joe, what is your password ?')
    password = input()
    if password == 'swordfish':
        break
print('Authorized.')