from datetime import datetime

a = datetime.strptime('01/01/25 05:30', "%d/%m/%y %H:%M")
b = datetime.strptime('01/01/25 06:30', "%d/%m/%y %H:%M")

result = b - a
print(result)