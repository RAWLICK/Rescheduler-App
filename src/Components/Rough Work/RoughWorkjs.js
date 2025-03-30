import { startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks, addMonths, subMonths, getMonth } from 'date-fns';
const currentDate = new Date();

const currentMonth = getMonth(currentDate)
console.log("Current Month: ", currentMonth)
