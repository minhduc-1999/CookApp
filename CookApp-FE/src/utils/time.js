import moment from "moment";
import "moment/locale/vi"

export function calendarTime(time) {
  return moment(time).locale('vi').calendar()
}
