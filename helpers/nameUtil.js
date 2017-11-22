function cleanInput(input){
  let cleaned = pagename.split(' ')
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
