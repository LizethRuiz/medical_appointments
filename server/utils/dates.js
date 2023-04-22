import { addDays, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

/** This function returns two UTC dates,
 * that considerate the  beginning of the day and the end of the day from a date or 24 hours range
 * Parameters:
 * - dateUTC
 * - localZone
 * This works the next form:
 * - the parameter dateUTC is become to local zone time (using the function zonedTimeToUtc from date-fns-tz package)
 * - add one day to create a complete day, both dates are returned in UTC format
 * Responses and examples:
 * - The date 2023-02-20 00:00 (dateUTC parameter)  in the zone America/Mazatlan(localZone parameter),
 * the function will return 2023-02-20 07:00(startUTC) - 2023-02-21 07:00 (endUTC) both dates make up the range of 24 hours
 *  - The date 2023-02-20 00:00 (dateUTC parameter)  in the zone Europe/Madrid(localZone parameter),
 * the function will return 2023-02-19 23:00 (startUTC) - 2023-02-20 23:00 (endUTC) both dates make up the range of 24 hours
 */
const getRangeDayUTCfromLZ = async (dateUTC, localZone) => {
  try {
    //Become UTC date to locaZone
    const dayStart = zonedTimeToUtc(dateUTC, localZone);

    //Add 24hours
    const dayFinish = addDays(dayStart, 1);

    //Create UTC format
    const startUTC = dayStart.toISOString();
    const endUTC = dayFinish.toISOString();

    return { startUTC, endUTC };
  } catch (error) {
    return new Error(error);
  }
};

/* Esta funcion retorna un UTC a partir de una UTC que se convierte a una zona local
Dada una fecha en utc esta la pasamos a la hora local específica dada, 
luego creamos a partir de esa hora formatNamedParameters,
una hora nueva considerada a partir de las 12:00 pero esta en UTC 
Ejemplo:
Dada la fecha 2023-02-20T08:00:00.000Z (utc), la convertimos a la hora local Europe/Madrid siendo entonces la fecha
2023-02-20 7:00 am, con esta fecha formateada creamos la hora cero de este dia 2023-02-20 00:00 (utc) y 
con esta llamamos la función que nos retornara los rangos de fechas utc que se considerán un día completo
*/

/** This function returns two UTC  dates (range of the day) from a date
 * that considerate the  beginning of the day and the end of the day from a date or 24 hours range
 * Parameters:
 * - dateUTC
 * - localZone
 * This works the next form:
 * - the parameter dateUTC is become to date object instance with new Date
 * - The date is become in specific time zone (parameter locaZone) and formated
 * - Call the previous function getRangeDayUTCfromLZ to get the dates range
 * Responses and examples:
 * - The date 2023-02-20T08:00:00.000Z (dateUTC parameter)  in the zone Europe/Madrid(localZone parameter),
 * is become to 2023-02-20 7:00 am, with the date formated calling previous function and get the dates ranges
 * the function will return 2023-02-19 23:00 (startUTC) - 2023-02-20 23:00 (endUTC) both dates make up the range of 24 hours
 */
const getRangeDayLZfromUTC = async (dateUTC, localZone) => {
  try {
    const dateObjUtc = new Date(dateUTC);

    // Become utc to local zone:
    const dateLocalZone = utcToZonedTime(dateObjUtc, localZone);

    //Format the date -> yyyy-MM-dd
    const formatDateLocalZone = format(dateLocalZone, 'yyyy-MM-dd');

    //Calling previous function to get range of the day
    let rangesUTC = await getRangeDayUTCfromLZ(formatDateLocalZone, localZone);

    return rangesUTC;
  } catch (error) {
    throw new Error(error);
  }
};

/** This function returns two UTC  dates (range of a month) first day of month and firstDate of next month
 * Parameters:
 * - month
 * - year
 * This works the next form:
 * - Get the UTC date of fisrst day of one month
 * - Get date of first day of the next month
 * Responses and examples:
 * - With the month 5 and year 2023 we gonna get the dates:
 * 2023-05-01T00:00:00.000Z - 2023-06-01T00:00:00.000Z
 */
const getRangeMonthUTC = async (month, year) => {
  try {
    month = parseInt(month);
    year = parseInt(year);

    //Get the UTC date of fisrst day of one month
    const firstDayMonthUTC = new Date(Date.UTC(year, month - 1, 1));

    //Get next month and year
    const nextMonth = month == 12 ? 1 : month + 1;
    const nextYear = month == 12 ? year + 1 : year;

    //Get date of first day of the next month
    const firstDayNextMonthUTC = new Date(Date.UTC(nextYear, nextMonth - 1, 1));

    return {
      firstDayMonthUTC: firstDayMonthUTC.toISOString(),
      firstDayNextMonthUTC: firstDayNextMonthUTC.toISOString(),
    };
  } catch (error) {
    throw new Error(error);
  }
};

/** This function become the range of the month in a specific local zone */
const getDatesMonthInLocalZone = async (month, year, TIME_ZONE) => {
  try {
    //Get the UTC ranges using previous function
    let { firstDayMonthUTC, firstDayNextMonthUTC } = await getRangeMonthUTC(
      month,
      year
    );
    firstDayMonthUTC = firstDayMonthUTC.split('T')[0];
    firstDayNextMonthUTC = firstDayNextMonthUTC.split('T')[0];

    //Convert in specific local zone, format in UTC
    const startUTC = zonedTimeToUtc(firstDayMonthUTC, TIME_ZONE).toISOString();
    const endUTC = zonedTimeToUtc(
      firstDayNextMonthUTC,
      TIME_ZONE
    ).toISOString();

    return { startUTC, endUTC };
  } catch (error) {
    throw new Error(error);
  }
};

/** This functions added minutes to specific date */
const addMinutesToDate = (date, minutes) => {
  try {
    //the minutes parameter is become in milliseconds
    let ms = minutes * 60000;

    //Get the ms of the date parameter and add the new ms
    let resultDate = new Date(date).getTime() + ms;

    return resultDate;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  getRangeMonthUTC,
  getRangeDayUTCfromLZ,
  getRangeDayLZfromUTC,
  getDatesMonthInLocalZone,
  addMinutesToDate,
};
