export function generateRandomID() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  let randomId = ""

  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length)
    randomId += letters[randomIndex]
  }

  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * 10)
    randomId += randomNumber
  }

  return randomId
}
