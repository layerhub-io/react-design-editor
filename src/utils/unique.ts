import { customAlphabet } from "nanoid"

const nanoid = customAlphabet("_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10)

export const uniqueId = () => {
  return nanoid()
}

export const uniqueFilename = (name: string) => {
  const nameArray = name.split(".")
  const extension = nameArray[nameArray.length - 1]
  const uniqueName = [uniqueId(), extension].join(".")
  return uniqueName
}
