/**
 * @param {string} name 
 */
function generateAwesomeName(name) {
// break the name in 2 by length of chars, return the first part lower case and the second part uppercase
    const middleIndex = Math.ceil(name.length / 2);
    const firstPart = name.slice(0, middleIndex).toLowerCase();
    const secondPart = name.slice(middleIndex).toUpperCase();
    return firstPart + secondPart;
}

// read the name from the command line arguments. It should be the last word in the command line arguments
const name = process.argv[process.argv.length - 1];
const awesomeName = generateAwesomeName(name);
console.log(awesomeName);