const dmyFormatConverter = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

const ymdFormatConverter = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

targetDate = "04/05/2025"
dateArray = ["01/01/2025", "02/01/2025", "03/01/2025", "04/01/2025", "09/02/2025"]

function PastMostRecentDate(targetDate, dateArray) {
    let remainingDate = []
    for (let index = 0; index < dateArray.length; index++) {
        const element = new Date(ymdFormatConverter(dateArray[index]));
        if (element < new Date(ymdFormatConverter(targetDate))) {
            remainingDate.push(element)
        }
    }
    const latestDate = new Date(Math.max(Number(...remainingDate)));
    const day = latestDate.getDate()
    const month = latestDate.getMonth()
    const fullYear = latestDate.getFullYear()
    const convertedLatestDate = `${day.toString().padStart(2, '0')}/${(month+1).toString().padStart(2, '0')}/${fullYear}`
    console.log(convertedLatestDate)
}

PastMostRecentDate(targetDate, dateArray);