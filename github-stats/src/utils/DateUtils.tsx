export default class DateUtils {

    static getTimeInMillis(time: string) : number {
        if (time.includes("D") || time.includes("d")) {
            return parseInt(time.replace(/\D/g, "")) * 24 * 60 * 60 * 1000;
        } 
         
        return parseInt(time.replace(/\D/g, "")) * 24 * 60 * 1000;
    }

    static isDateInCurrentMonthAndYear(date: Date, currentDate: Date): boolean {
        return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
    }
}