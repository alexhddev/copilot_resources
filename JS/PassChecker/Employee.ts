type Email = `${string}@${string}.${string}`;

type Employee = {
    name: string;
    age: number;
    role: string;
    address: {
        city: string;
        country: string;
    };
    workAddress: {
        city: string;
        country: string;
    };
    salary: number;
    email: Email; // Using the Email template literal type
    phone: string;
    hobbies: string[];
    getName: () => string;
};

const john: Employee = {
    name: 'John',
    age: 30,
    role: 'Software Engineer',
    address: {
        city: 'Bangalore',
        country: 'India'
    },
    workAddress:{
        city: 'New Delhi',
        country: 'India'
    },
    salary: 100000,
    email: 'john@example.com',
    phone: '123-456-7890',
    hobbies: ['Reading', 'Sports'],
    getName: function () {
        return this.name;
    }
};
