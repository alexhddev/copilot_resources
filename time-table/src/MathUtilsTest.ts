import { asyncAdd } from './MathUtils'   

const result = await asyncAdd(5,10);

console.log(`Result of async addition: ${result}`)