export const getTimeInMillis = (time: string): number => {
    if (time.includes("D") || time.includes("d")) {
        return parseInt(time.replace(/\D/g, "")) * 24 * 60 * 60 * 1000;
    }

    return parseInt(time.replace(/\D/g, "")) * 24 * 60 * 1000;
}

export const isDateInPreviousMonth = (date: Date, month: number, year: number): boolean => {

    return date.getMonth() === month && date.getFullYear() === year;
}