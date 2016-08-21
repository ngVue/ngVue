export default function lowerFirst (letter) {
  const firstLetter = letter.charAt(0).toLowerCase()
  return firstLetter + letter.slice(1)
}
