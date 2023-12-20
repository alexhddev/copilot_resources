class Employee:
    def __init__(self, name, age, salary):
        self.name = name
        self.age = age
        self.salary = salary

employee_list = []

employee_list.append(Employee("John", 23, 50000))
employee_list.append(Employee("Mike", 45, 60000))
employee_list.append(Employee("Lisa", 33, 90000))
employee_list.append(Employee("Elon", 50, 100000))
employee_list.append(Employee("Jeff", 60, 120000))
employee_list.append(Employee("Bill", 70, 150000))

def get_all_employees_names():
    return [employee.name for employee in employee_list]

def get_maximum_salary():
    return max([employee.salary for employee in employee_list])

def get_employees_with_salary_bigger_than(salary):
    return [employee.name for employee in employee_list if employee.salary > salary]

print(get_employees_with_salary_bigger_than(100000))