function cleanInput(input){
  console.log(`[NAMEUTIL] Input: ${input}`)
  let cleaned = input.split(' ')
    .join('_')
    .split('!').join('_')
    .split(',').join('.')
    .split('(').join('_')
    .split(')').join('_')
    .toLowerCase();
  return cleaned;
}

module.exports = {
  cleanInput: cleanInput
}
