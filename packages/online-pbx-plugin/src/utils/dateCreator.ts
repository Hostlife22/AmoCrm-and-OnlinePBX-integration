export const dateCreator = () => {
  const date = new Date()
  const parseDate = JSON.stringify(date).replace(/[A-Z]/g, " ")
  return parseDate.slice(1, -1)
}
