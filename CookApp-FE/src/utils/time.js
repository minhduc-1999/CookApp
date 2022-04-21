import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment)

export function calendarTime(time) {
  return moment(time).format("DD/MM/YYYY")
}

export function durationFormat(span) {
  return moment.duration(span, 'minutes').format("m [phút]")
}
