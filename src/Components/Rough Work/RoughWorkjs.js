function elaborateDuration(duration) {
    if (duration.includes('min') && !duration.includes('h')) {
        const addingHour = 0
        const addingMinute = Number(duration.split(' ')[0])
        console.log("addingHour: ", addingHour)
        console.log("addingMinute: ", addingMinute)
        return [addingHour, addingMinute]
    }
    else if (duration.includes('h') && !duration.includes('min')) {
        const addingHour = Number(duration.split('h')[0])
        const addingMinute = 0
        console.log("addingHour: ", addingHour)
        console.log("addingMinute: ", addingMinute)
        return [addingHour, addingMinute]
    }
    else {
        const addingHour = Number(duration.split('h')[0])
        const addingMinute = Number(duration.slice(3, 5))
        console.log("addingHour: ", addingHour)
        console.log("addingMinute: ", addingMinute)
        return [addingHour, addingMinute]
    }
  }

function AdjustedEndTime (StartTime) {
    const StartHour = Number(StartTime.split(":")[0])
    const StartMin = Number(StartTime.split(":")[1])
    const [addHour, addMinute] = elaborateDuration('1h 15 min');
    let EndHour = StartHour + addHour
    let EndMin = StartMin + addMinute
    if (EndMin >= 60) {
        EndHour += 1;
        EndMin -= 60;
    }
    console.log(`${EndHour}:${EndMin}`)
    return `${EndHour}:${EndMin}`
}

AdjustedEndTime('5:59')