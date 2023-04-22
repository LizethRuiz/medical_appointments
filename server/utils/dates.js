import { addDays, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

/* Esta funcion retorna dos fechas UTC que son las horas donde comienza y termina el día, o bien las horas UTC de 24 horas 
para esto, dada una fecha, la pasamos a la hora local de la zona específica y 
luego le sumamos 1 dia (para que se tome en cuenta como día completo), 
ambas fechas (rangos de donde inicia y termina un día) son retornadas en UTC por la función
Ejemplo -> Dada la fecha 2023-02-20 00:00 en la zona Mazatlan se convierte a 2023-02-20 07:00 en cambio
en la zona Madrid esta sería 2023-02-19 23:00
*/
const getRangeDayUTCfromLZ = async (dateUTC, localZone) => {
  try {
    //Se convierte la fecha UTC a la zona local
    const dayStart = zonedTimeToUtc(dateUTC, localZone);

    //Se suman 24hrs a las 00:00 hrs
    const dayFinish = addDays(dayStart, 1);

    //Se formatean las fechas a UTC
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

const getRangeDayLZfromUTC = async (dateUTC, localZone) => {
  try {
    const fechaUtc = new Date(dateUTC);

    // Convertimos la hora UTC a la hora en la zona horaria especificada:
    const dateLocalZone = utcToZonedTime(fechaUtc, localZone);

    //Formateamos la fecha yyyy-MM-dd
    const formatDateLocalZone = format(dateLocalZone, 'yyyy-MM-dd');

    //Creamos un nueva fecha a partir de la formateada, con la fecha local (00:00 o 24 hrs)
    //let toUTC = `${formatDateLocalZone} 00:00:00`;

    //Llamamos la funcion que nos retorna rangos de un dia completo en UTC
    let rangesUTC = await getRangeDayUTCfromLZ(formatDateLocalZone, localZone);
    return rangesUTC;
  } catch (error) {
    throw new Error(error);
  }
};

const getRangeMonthUTC = async (month, year) => {
  try {
    month = parseInt(month);
    year = parseInt(year);

    // Obtener la fecha UTC del primer día del mes
    const firstDayMonthUTC = new Date(Date.UTC(year, month - 1, 1));

    // Obtener la fecha UTC del primer día del siguiente mes
    const nextMonth = month == 12 ? 1 : month + 1;
    const nextYear = month == 12 ? year + 1 : year;

    const firstDayNextMonthUTC = new Date(Date.UTC(nextYear, nextMonth - 1, 1));

    return {
      firstDayMonthUTC: firstDayMonthUTC.toISOString(),
      firstDayNextMonthUTC: firstDayNextMonthUTC.toISOString(),
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getDatesMonthInLocalZone = async (month, year, TIME_ZONE) => {
  try {
    let { firstDayMonthUTC, firstDayNextMonthUTC } = await getRangeMonthUTC(
      month,
      year
    );
    firstDayMonthUTC = firstDayMonthUTC.split('T')[0];
    firstDayNextMonthUTC = firstDayNextMonthUTC.split('T')[0];

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

const addMinutesToDate = (date, minutes) => {
  try {
    let ms = minutes * 60000;

    let resultDate = new Date(date).getTime() + ms;
    //body.endDate = new Date(endDate);

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
