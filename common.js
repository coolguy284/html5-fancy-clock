function numberToStringWithMinimumDecimalPlaces(number, places) {
  let stringSplit = String(number).split('.');
  
  if (stringSplit.length == 1) {
    stringSplit = [stringSplit[0], ''];
  }
  
  return [stringSplit[0], stringSplit[1].padEnd(places, '0')].join('.').replace(/\.$/g, '');
}
