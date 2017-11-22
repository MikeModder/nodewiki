function cleanInput(input){
  let cleaned = input.split(' ')
    .join('_')
    .toLowerCase()
    .split('!')
    .join('_')
    .split(',')
    .join('.');
  return cleaned;
}

module.exports = {
  cleanInput: cleanInput
}
