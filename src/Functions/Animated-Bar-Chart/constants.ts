import { startOfWeek } from 'date-fns';

// Calculating date of the monday from three weeks ago
export const BACKGROUND_COLOR = '#3E3649';
const subjects = ['Chemistry', 'Physics', 'Maths', 'Biology', 'Social', 'Drawing', 'Commerce']

const demoData =
 [ 
    {
        "Subject": "Chemistry",
        "Current_Duration": "1h",
        "Dataframe": [
            {
                "Date": "12/02/2025",
                "Percentage": "100%",
                "Duration": "1h"
            },
            {
                "Date": "13/02/2025",
                "Percentage": "50%",
                "Duration": "1h"
            }
        ]
    },
    {
        "Subject": "Maths",
        "Current_Duration": "2h",
        "Dataframe": [
            {
                "Date": "12/02/2025",
                "Percentage": "100%",
                "Duration": "1h"
            },
            {
                "Date": "13/02/2025",
                "Percentage": "50%",
                "Duration": "2h"
            }
        ]
    },
    {
        "Subject": "Biology",
        "Current_Duration": "1h 30min",
        "Dataframe": [
            {
                "Date": "12/02/2025",
                "Percentage": "100%",
                "Duration": "1h 30min"
            },
            {
                "Date": "13/02/2025",
                "Percentage": "50%",
                "Duration": "1h"
            }
        ]
    },
    {
        "Subject": "History",
        "Current_Duration": "0h 30min",
        "Dataframe": [
            {
                "Date": "12/02/2025",
                "Percentage": "100%",
                "Duration": "1h 30min"
            },
            {
                "Date": "13/02/2025",
                "Percentage": "50%",
                "Duration": "0h 30min"
            }
        ]
    },
    {
        "Subject": "Economics",
        "Current_Duration": "1h 15min",
        "Dataframe": [
            {
                "Date": "12/02/2025",
                "Percentage": "100%",
                "Duration": "1h 15min"
            },
            {
                "Date": "13/02/2025",
                "Percentage": "50%",
                "Duration": "1h 15min"
            }
        ]
    },
    {
        "Subject": "Civics",
        "Current_Duration": "1h",
        "Dataframe": [
            {
                "Date": "12/02/2025",
                "Percentage": "100%",
                "Duration": "1h"
            },
            {
                "Date": "13/02/2025",
                "Percentage": "0%",
                "Duration": "1h"
            },
            {
                "Date": "16/02/2025",
                "Percentage": "75%",
                "Duration": "1h"
            }
        ]
    },
    {
        "Subject": "Geography",
        "Current_Duration": "10min",
        "Dataframe": [
            {
                "Date": "12/02/2025",
                "Percentage": "50%",
                "Duration": "10min"
            },
            {
                "Date": "13/02/2025",
                "Percentage": "25%",
                "Duration": "10min"
            },
            {
                "Date": "19/02/2025",
                "Percentage": "100%",
                "Duration": "1hr"
            }
        ]
    }

 ]

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
