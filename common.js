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
  let now = new Date();
  
  let millisLeftInSecond = SECOND_MILLIS - now.getMilliseconds();
  
  millisLeftInSecond += SECOND_MILLIS * (1 - TIMED_CALLBACK_LENIENCY_FRAC_SEC);
  millisLeftInSecond %= SECOND_MILLIS;
  millisLeftInSecond += SECOND_MILLIS * TIMED_CALLBACK_LENIENCY_FRAC_SEC;
  
  setTimeout(func, millisLeftInSecond);
}

function callbackInMinute(func) {
  let now = new Date();
  
  let millisLeftInMinute = MINUTE_MILLIS - (now.getSeconds() * 1000 + now.getMilliseconds());
  
  millisLeftInMinute += MINUTE_MILLIS * (1 - TIMED_CALLBACK_LENIENCY_FRAC_MIN);
  millisLeftInMinute %= MINUTE_MILLIS;
  millisLeftInMinute += MINUTE_MILLIS * TIMED_CALLBACK_LENIENCY_FRAC_MIN;
  
  setTimeout(func, millisLeftInMinute);
}
