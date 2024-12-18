// constants to change program operation

// tweakable and saved to persistent storage
let CLOCK_DRAW_MODE = '24 Hour Fancy (Main)'; // either "12 Hour", "24 Hour" (fancy looking 24hr clock), "24 Hour Fancy (Main)" (even fancier looking 24hr clock), or "24 Hour Fancy (Background)" (even fancier looking 24hr clock)
let CLOCK_DRAW_MOTIF = true; // whether sun / moon motif will show in center of clock
let CLOCK_SECONDS_VISIBLE = true; // whether seconds is visible on the clock
let CLOCK_TIME_VISIBLE = true; // whether to show time below or inside clock
let CLOCK_DATE_VISIBLE = true; // whether to show "Tue, Oct 12 2023" on 12 hr clock and "2023-10-12 TUE" on 24hr
let CLOCK_DRAW_BORDER = true; // whether to show the border of the clock
let CLOCK_NUDGE_ONES = false; // whether to nudge positioning of text when there is a 1
let CLOCK_OFFSET_HOURS = 0; // amount of hours clock is ahead of real time
let LOCAL_TIMEZONE = true; // if local timezone is displayed, else display a utc offset timezone
let TIMEZONE_OFFSET_HOURS = 0; // utc timezone offset in hours that is displayed
let ADVANCED_MOTIF_CALCULATION = false; // whether to attempt to calculate height of sun above 0 degrees for motif calculation
let SUN_ANGLE_CALCULATION_METHOD = 'Stackoverflow (Accurate)'; // either "Personal (Intuitive)" or "Stackoverflow (Accurate)"
let LATITUDE = 0; // latitude in degrees used to calculate sun position
let LONGITUDE = 0; // longitude in degrees used to calculate sun position
let DBLCLICK_TOGGLES_FULLSCREEN = false; // double click to fullscreen
let FRAMERATE = 'Every Frame, Re-Render Every Second'; // either "Every Frame", "Every Frame, Re-Render Every Second", "Re-Render Every Second", "Re-Render Every Minute", "Halted"

// more alterable constants
let HIDE_SETTINGS_BUTTON = false;
let SETTINGS_PERSISTENT_STORAGE = true;

// alterable constants
let LOG_DEBUG = false;
let SIMPLE_MOTIF_MINUTE_CHART = [
  // number is maximum minute of day where that motif is shown
  [ 5 * 60 + 59, 'moon'],
  [ 6 * 60 + 29, 'sunrise'],
  [17 * 60 + 29, 'sun'],
  [17 * 60 + 59, 'sunrise'],
  [23 * 60 + 59, 'moon'],
];
let ADVANCED_MOTIF_HEIGHT_CHART = [
  // number is maximum height in degrees where that motif is shown
  [-5, 'moon'],
  [7.5, 'sunrise'],
  [90, 'sun'],
];
let TIMED_CALLBACK_LENIENCY_FRAC_SEC = 0.25; // e.x. for a 1s wait, will wait anywhere from 1s x 0.25 = 0.25s to 1s x (1 + 0.25) = 1.25s
let TIMED_CALLBACK_LENIENCY_FRAC_MIN = 0.25; // e.x. for a 60s wait, will wait anywhere from 60s x 0.25 = 15s to 60s x (1 + 0.25) = 75s

// base constants
let DAY_OF_WEEK_STRINGS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
let MONTH_OF_YEAR_STRINGS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let DAY_OF_WEEK_STRINGS_CAPS = DAY_OF_WEEK_STRINGS.map(x => x.toUpperCase());
let MONTH_OF_YEAR_STRINGS_CAPS = MONTH_OF_YEAR_STRINGS.map(x => x.toUpperCase());
let MONTH_LENGTHS_NON_LEAP = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let MONTH_LENGTHS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let MONTH_STARTING_DAY_NON_LEAP = [0, ...cumulativeSum(MONTH_LENGTHS_NON_LEAP)];
let MONTH_STARTING_DAY_LEAP = [0, ...cumulativeSum(MONTH_LENGTHS_LEAP)];
// keys are regexes, values are width relative to height
let LETTER_WIDTHS = [
  [/^[0-9 ]$/, 0.55],
  [/^[A-Z]$/, 0.75],
  [/^:$/, 0.25],
];
let SECOND_MILLIS = 1000;
let MINUTE_MILLIS = 60000;
