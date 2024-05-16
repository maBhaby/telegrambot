export const createDate = (
  year?: number,
  month?: number,
  day?: number,
  
) => {
  if (year && month && day) {
    const createdDate = new Date(year, month, day)
    return formateDate(createdDate)
  } else {
    const createdDate = new Date()
    return formateDate(createdDate)
  }
}

const formateDate = (date:Date) => `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`
