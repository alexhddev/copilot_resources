import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryRepository } from '../src/repository/InMemoryRepository'
import { type Employee } from '../src/model/Employee'

describe('InMemoryRepository', () => {
  let repository: InMemoryRepository
  let mockEmployee: Partial<Employee>

  beforeEach(() => {
    // Arrange
    repository = new InMemoryRepository()
    mockEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      hireDate: new Date('2023-01-15'),
      position: 'Developer'
    }
  })

  describe('addEmployee', () => {
    it('should add a new employee and assign an id', async () => {
      // Arrange
      // (setup done in beforeEach)

      // Act
      const result = await repository.addEmployee(mockEmployee)

      // Assert
      expect(result.id).toBe(1)
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
      expect(result.position).toBe('Developer')
    })

    it('should assign sequential ids to multiple employees', async () => {
      // Arrange
      const secondEmployee = {
        firstName: 'Jane',
        lastName: 'Smith',
        hireDate: new Date('2023-02-01'),
        position: 'Manager'
      }

      // Act
      const firstResult = await repository.addEmployee(mockEmployee)
      const secondResult = await repository.addEmployee(secondEmployee)

      // Assert
      expect(firstResult.id).toBe(1)
      expect(secondResult.id).toBe(2)
    })
  })

  describe('getEmployees', () => {
    it('should return empty array when no employees exist', async () => {
      // Arrange
      // (repository is empty by default)

      // Act
      const result = await repository.getEmployees()

      // Assert
      expect(result).toEqual([])
    })

    it('should return all employees when they exist', async () => {
      // Arrange
      await repository.addEmployee(mockEmployee)
      const secondEmployee = {
        firstName: 'Jane',
        lastName: 'Smith',
        hireDate: new Date('2023-02-01'),
        position: 'Manager'
      }
      await repository.addEmployee(secondEmployee)

      // Act
      const result = await repository.getEmployees()

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].firstName).toBe('John')
      expect(result[1].firstName).toBe('Jane')
    })
  })

  describe('getEmployeeById', () => {
    it('should return undefined when employee does not exist', async () => {
      // Arrange
      // (repository is empty)

      // Act
      const result = await repository.getEmployeeById(999)

      // Assert
      expect(result).toBeUndefined()
    })

    it('should return employee when id exists', async () => {
      // Arrange
      const addedEmployee = await repository.addEmployee(mockEmployee)

      // Act
      const result = await repository.getEmployeeById(addedEmployee.id)

      // Assert
      expect(result).toBeDefined()
      expect(result?.firstName).toBe('John')
      expect(result?.id).toBe(addedEmployee.id)
    })
  })

  describe('updateEmployeePosition', () => {
    it('should return undefined when employee does not exist', async () => {
      // Arrange
      // (repository is empty)

      // Act
      const result = await repository.updateEmployeePosition(999, 'Senior Developer')

      // Assert
      expect(result).toBeUndefined()
    })

    it('should update position when employee exists', async () => {
      // Arrange
      const addedEmployee = await repository.addEmployee(mockEmployee)
      const newPosition = 'Senior Developer'

      // Act
      const result = await repository.updateEmployeePosition(addedEmployee.id, newPosition)

      // Assert
      expect(result).toBeDefined()
      expect(result?.position).toBe(newPosition)
      expect(result?.firstName).toBe('John') // other fields unchanged
    })
  })

  describe('deleteEmployee', () => {
    it('should return false when employee does not exist', async () => {
      // Arrange
      // (repository is empty)

      // Act
      const result = await repository.deleteEmployee(999)

      // Assert
      expect(result).toBe(false)
    })

    it('should return true and remove employee when id exists', async () => {
      // Arrange
      const addedEmployee = await repository.addEmployee(mockEmployee)

      // Act
      const result = await repository.deleteEmployee(addedEmployee.id)

      // Assert
      expect(result).toBe(true)
      
      // Verify employee is actually removed
      const employees = await repository.getEmployees()
      expect(employees).toHaveLength(0)
    })
  })

  describe('getEmployeesByPosition', () => {
    it('should return empty array when no employees match position', async () => {
      // Arrange
      await repository.addEmployee(mockEmployee)

      // Act
      const result = await repository.getEmployeesByPosition('Manager')

      // Assert
      expect(result).toEqual([])
    })

    it('should return employees matching the position', async () => {
      // Arrange
      await repository.addEmployee(mockEmployee)
      const managerEmployee = {
        firstName: 'Jane',
        lastName: 'Smith',
        hireDate: new Date('2023-02-01'),
        position: 'Manager'
      }
      await repository.addEmployee(managerEmployee)
      const anotherDeveloper = {
        firstName: 'Bob',
        lastName: 'Johnson',
        hireDate: new Date('2023-03-01'),
        position: 'Developer'
      }
      await repository.addEmployee(anotherDeveloper)

      // Act
      const result = await repository.getEmployeesByPosition('Developer')

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].firstName).toBe('John')
      expect(result[1].firstName).toBe('Bob')
    })
  })
})
