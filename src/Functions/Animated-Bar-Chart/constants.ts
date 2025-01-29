import { startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks, addMonths, subMonths } from 'date-fns';

// Calculating date of the monday from three weeks ago
export const BACKGROUND_COLOR = '#3E3649';
const subjects = ['Chemistry', 'Physics', 'Maths', 'Biology', 'Social', 'Drawing', 'Commerce']
const start = startOfWeek(new Date, { weekStartsOn: 1 });
const end = endOfWeek(new Date, { weekStartsOn: 1 });
const between = eachDayOfInterval({start, end})
const add = addWeeks(start, 1)
const subtract = subWeeks(start, 1)
// const between = eachDayOfInterval({start: startOfWeek, endOfWeek})
// #e68eff
export const demoData =
 [ 
    {   
        "uniqueID": "7g3ca85f6h",
        "Subject": "Chemistry",
        "Current_Duration": "1h",
        "Dataframe": [
            {
                "Date": "27/01/2025",
                "Percentage": "100%",
                "Duration": "1h",
                "Work-Done-For": "60min"
            },
            {
                "Date": "28/01/2025",
                "Percentage": "50%",
                "Duration": "1h",
                "Work-Done-For": "30min"
            }
        ]
    },
    {
        "uniqueID": "b30v6s9f1j",
        "Subject": "Maths",
        "Current_Duration": "2h",
        "Dataframe": [
            {
                "Date": "27/01/2025",
                "Percentage": "100%",
                "Duration": "1h",
                "Work-Done-For": "60min"
            },
            {
                "Date": "28/01/2025",
                "Percentage": "50%",
                "Duration": "2h",
                "Work-Done-For": "60min"
            }
        ]
    },
    {
        "uniqueID": "nn77d4x0g5",
        "Subject": "Biology",
        "Current_Duration": "1h 30min",
        "Dataframe": [
            {
                "Date": "27/01/2025",
                "Percentage": "100%",
                "Duration": "1h 30min",
                "Work-Done-For": "90min"
            },
            {
                "Date": "29/01/2025",
                "Percentage": "50%",
                "Duration": "1h",
                "Work-Done-For": "30min"
            }
        ]
    },
    {
        "uniqueID": "k3x04f17f5",
        "Subject": "History",
        "Current_Duration": "0h 30min",
        "Dataframe": [
            {
                "Date": "28/01/2025",
                "Percentage": "100%",
                "Duration": "1h 30min",
                "Work-Done-For": "90min"
            },
            {
                "Date": "29/01/2025",
                "Percentage": "50%",
                "Duration": "0h 30min",
                "Work-Done-For": "15min"
            }
        ]
    },
    {
        "uniqueID": "j22s886d51",
        "Subject": "Economics",
        "Current_Duration": "1h 15min",
        "Dataframe": [
            {
                "Date": "27/01/2025",
                "Percentage": "100%",
                "Duration": "1h 15min",
                "Work-Done-For": "75min"
            },
            {
                "Date": "28/01/2025",
                "Percentage": "50%",
                "Duration": "1h 15min",
                "Work-Done-For": "37min"
            }
        ]
    },
    {
        "uniqueID": "871v6d45nn",
        "Subject": "Civics",
        "Current_Duration": "1h",
        "Dataframe": [
            {
                "Date": "27/01/2025",
                "Percentage": "100%",
                "Duration": "1h",
                "Work-Done-For": "60min"
            },
            {
                "Date": "28/01/2025",
                "Percentage": "0%",
                "Duration": "1h",
                "Work-Done-For": "0min"
            },
            {
                "Date": "29/01/2025",
                "Percentage": "75%",
                "Duration": "1h",
                "Work-Done-For": "45min"
            }
        ]
    },
    {
        "uniqueID": "982bx673f5",
        "Subject": "Geography",
        "Current_Duration": "10min",
        "Dataframe": [
            {
                "Date": "27/01/2025",
                "Percentage": "50%",
                "Duration": "10min",
                "Work-Done-For": "5min"
            },
            {
                "Date": "28/01/2025",
                "Percentage": "25%",
                "Duration": "10min",
                "Work-Done-For": "3min"
            },
            {
                "Date": "29/01/2025",
                "Percentage": "100%",
                "Duration": "1hr",
                "Work-Done-For": "60min"
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
