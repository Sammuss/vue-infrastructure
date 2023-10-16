export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
/**
 * 返回日期在当年中的第几天
 * @param {Date} date
 * @returns
 */
export const dayOfYear = (date) => Math.floor(date - new Date(date.getFullYear(), 0, 0) / DAY)
