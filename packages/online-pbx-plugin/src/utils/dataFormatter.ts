export const dataFormatter = (obj: string) => {
  return JSON.stringify(JSON.parse(obj), null, "\t")
}
