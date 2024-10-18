function numberToStringWithMinimumDecimalPlaces(number, places) {
  let stringSplit = String(number).split('.');
  
  if (stringSplit.length == 1) {
    stringSplit = [stringSplit[0], ''];
  }
  
  return [stringSplit[0], stringSplit[1].padEnd(places, '0')].join('.').replace(/\.$/g, '');
}

function cumulativeSum(array) {
  let result = [];
  
  if (array.length > 0) {
    result.push(array[0]);
    
    for (let i = 1; i < array.length; i++) {
      result.push(result[result.length - 1] + array[i]);
    }
  }
  
  return result;
}

function stringToBool(string) {
  return string == 'true';
}

function endFrameWait(forceRerender) {
  if (_endFrameWait != null) {
    _endFrameWait();
    _endFrameWait = null;
    if (forceRerender) {
      forceRerenderAfterLoopWait = true;
    }
  } else if (forceRerender) {
    renderFrame(true);
  }
}

function callbackInSecond(func) {
  let secondMillis = 1000;
  let leniencyFrac = 0.25; // will await anywhere from 15s to 75s with this value
  
  let now = new Date();
  
  let millisLeftInSecond = secondMillis - now.getMilliseconds();
  
  millisLeftInSecond += secondMillis * (1 - leniencyFrac);
  millisLeftInSecond %= secondMillis;
  millisLeftInSecond += secondMillis * leniencyFrac;
  
  setTimeout(func, millisLeftInSecond);
}

function callbackInMinute(func) {
  let minuteMillis = 60000;
  let leniencyFrac = 0.25; // will await anywhere from 15s to 75s with this value
  
  let now = new Date();
  
  let millisLeftInMinute = minuteMillis - (now.getSeconds() * 1000 + now.getMilliseconds());
  
  millisLeftInMinute += minuteMillis * (1 - leniencyFrac);
  millisLeftInMinute %= minuteMillis;
  millisLeftInMinute += minuteMillis * leniencyFrac;
  
  setTimeout(func, millisLeftInMinute);
}
