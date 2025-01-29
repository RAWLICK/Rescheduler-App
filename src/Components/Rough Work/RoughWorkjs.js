// function StringDateToDateConvert(stringDate) {
//     let [day, month, year] = stringDate.split('/')
//     const createdDate = new Date(Date.UTC(year, month - 1, day))
//     console.log(typeof(year))
// }
// StringDateToDateConvert("12/07/2025")

// function SlicingMins (duration) {
//     const number = duration.split('min')[0]
//     console.log(number)
// }

a = [50, 70, 90, 100, 20]
const max = Math.max(...a)
console.log(max)