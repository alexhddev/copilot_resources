import { asyncAdd } from './MathUtils'

const result = await asyncAdd(5, 10);

console.log(`The result of async addition is: ${result}`);