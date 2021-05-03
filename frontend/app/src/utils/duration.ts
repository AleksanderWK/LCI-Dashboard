/**
 * Calculates duration from a start time to a end time or the current time
 * @param {number} startTime - Start time in milliseconds since the UNIX epoch
 * @param {number?} endTime - End time in milliseconds since the UNIX epoch
 * @param {number?} returnType - Format of return value, either "1:20:31" (returnType = 1)
 * or "1h 20m 31s" (no returnType)
 * @returns {string} A string representation of the duration
 */
export const duration = (startTime: number, endTime?: number, returnType?: number): string => {
    let distance = endTime ? endTime - startTime : new Date().getTime() - startTime;

    const hours = Math.floor(distance / 3600000);
    distance -= hours * 3600000;

    const minutes = Math.floor(distance / 60000);
    distance -= minutes * 60000;

    const seconds = Math.floor(distance / 1000);

    if (returnType == 1) {
        return `${hours}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
    } else {
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }
};
