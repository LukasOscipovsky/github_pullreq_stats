export const getTimeInMillis = (time: string): number => {
    if (time.includes("D") || time.includes("d")) {
        return parseInt(time.replace(/\D/g, "")) * 24 * 60 * 60 * 1000;
    }

    return parseInt(time.replace(/\D/g, "")) * 24 * 60 * 1000;
}

export const isDateInPreviousMonth = (date: Date): boolean => {
    let currentDate: Date = new Date();
    let month: number = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
    let year: number = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

    return date.getMonth() === month && date.getFullYear() === year;
}