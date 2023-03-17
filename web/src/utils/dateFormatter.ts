import moment from "moment"

// Default time format stored in database
const STANDARD_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"

export const formatCurrentTime = (formatter: string = STANDARD_TIME_FORMAT) =>
  moment().format(formatter)

export const formatTime = (time: string, formatter: string = STANDARD_TIME_FORMAT) =>
  moment(time).format(formatter)
