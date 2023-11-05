// constants to change program operation
let LOG_DEBUG = false;
let CLOCK_DRAW_MODE = '24 Hour Fancy (Main)'; // either "12 Hour", "24 Hour" (fancy looking 24hr clock), "24 Hour Fancy (Main)" (even fancier looking 24hr clock), or "24 Hour Fancy (Background)" (even fancier looking 24hr clock)
let CLOCK_DRAW_MOTIF = true; // whether sun / moon motif will show in center of clock
let CLOCK_SECONDS_VISIBLE = true; // whether seconds is visible on the clock
let CLOCK_TIME_VISIBLE = true; // whether to show time below or inside clock
let CLOCK_DATE_VISIBLE = true; // whether to show "Tue, Oct 12 2023" on 12 hr clock and "2023-10-12 TUE" on 24hr
let CLOCK_NUDGE_ONES = false; // whether to nudge positioning of text when there is a 1
let CLOCK_OFFSET_HOURS = 0; // amount of hours clock is ahead of real time
let ADVANCED_MOTIF_CALCULATION = false; // whether to attempt to calculate height of sun above 0 degrees for motif calculation
let SUN_ANGLE_CALCULATION_METHOD = 'Personal (Intuitive)'; // either "Personal (Intuitive)" or "Stackoverflow (Accurate)"
let LATITUDE = 0; // latitude in degrees used to calculate sun position
let LONGITUDE = 0; // longitude in degrees used to calculate sun position

let DAY_OF_WEEK_STRINGS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
let MONTH_OF_YEAR_STRINGS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let DAY_OF_WEEK_STRINGS_CAPS = DAY_OF_WEEK_STRINGS.map(x => x.toUpperCase());
let MONTH_OF_YEAR_STRINGS_CAPS = MONTH_OF_YEAR_STRINGS.map(x => x.toUpperCase());
let MONTH_LENGTHS_NON_LEAP = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let MONTH_LENGTHS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let MONTH_STARTING_DAY_NON_LEAP = [0, ...cumulativeSum(MONTH_LENGTHS_NON_LEAP)];
let MONTH_STARTING_DAY_LEAP = [0, ...cumulativeSum(MONTH_LENGTHS_LEAP)];
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
  [90, 'sun']
];
// keys are regexes, values are width relative to height
let LETTER_WIDTHS = [
  [/^[0-9 ]$/, 0.55],
  [/^[A-Z]$/, 0.75],
  [/^:$/, 0.25],
];
