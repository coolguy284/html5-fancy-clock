// constants to change program operation
let LOG_DEBUG = false;
let CLOCK_DRAW_MODE = '12 Hour'; // either "12 Hour" or "24 Hour" (fancy looking 24hr clock)
let CLOCK_DRAW_MOTIF = true; // whether sun / moon motif will show in center of clock
let CLOCK_SECONDS_VISIBLE = true; // whether seconds is visible on the clock
let CLOCK_TIME_VISIBLE = true; // whether to show time below or inside clock
let CLOCK_DATE_VISIBLE = true; // whether to show "Tue, Oct 12 2023" on 12 hr clock and "2023-10-12 TUE" on 24hr
let CLOCK_NUDGE_ONES = false; // whether to nudge positioning of text when there is a 1

let DAY_OF_WEEK_STRINGS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
let MONTH_OF_YEAR_STRINGS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let DAY_OF_WEEK_STRINGS_CAPS = DAY_OF_WEEK_STRINGS.map(x => x.toUpperCase());
