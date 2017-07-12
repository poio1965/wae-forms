import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';

export class CustomDateFormatter extends CalendarDateFormatter {

  // you can override any of the methods defined in the parent class

	public weekDayShort({date, locale}: DateFormatterParams): string {
		const result = new Intl.DateTimeFormat(locale, {weekday: 'short'}).format(date);
		return result.replace('.', '').toUpperCase();
	}
}
