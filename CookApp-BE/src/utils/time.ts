import * as moment from 'moment-timezone';

import format from '../config/time';

const formatToDateTime = (date: Date, timezone = 'utc') => {
  return moment(date)
    .tz(timezone)
    .format(format.formatDateTime);
};

export default {
  formatToDateTime,
};
