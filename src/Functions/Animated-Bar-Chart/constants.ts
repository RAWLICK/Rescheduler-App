import { startOfWeek } from 'date-fns';

// Calculating date of the monday from three weeks ago
export const BACKGROUND_COLOR = '#3E3649';
const subjects = ['Chemistry', 'Physics', 'Maths', 'Biology', 'Social', 'Drawing', 'Commerce']

// const mondayFromThreeWeeksAgo = startOfWeek(
//     new Date().getTime() - 86400000 * 21,
//     { weekStartsOn: 1 }
// );

export const data = new Array(7).fill(null).map(( _, weekIndex) => {
    // return new Array(7).fill(null).map(( __, dayIndex) => {

    //     // Calculate for each day in the grid
    //     const day = new Date(mondayFromThreeWeeksAgo.getTime() + (86400000 * weekIndex + dayIndex));
        
    //     const value = Math.random()

    //     return {
    //         day: day,
    //         value: value
    //     };
    // });
    return subjects.map(( eachSubject, subjectIndex) => {
        
        const value = Math.random()
        return {
            name: eachSubject,
            value: value
        };
    });
});
