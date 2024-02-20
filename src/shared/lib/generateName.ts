const SYLLABLES = ['ra', 'ta', 'ni', 'ha', 'ku', 'mi', 'fu', 'zi', 'la', 'te', 'si', 'va', 'pe', 'do', 'gi', 'ke', 'lu', 'po', 'ri', 'so', 'qu', 'le', 've', 'co', 'ma', 'pa', 'ne', 'di', 'tu', 'mo', 'cha', 'be', 'na', 'me', 'sa', 'ka', 'lo', 'de', 'fi', 'ze'];
const END_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const MAX_SYLLABLES = 8;
const MIN_SYLLABLES = 3;
const MAX_NUMBER = 20;

/**
 * Функция для конвертации арабского числа в римское.
 */
function arabicToRoman(num: number): string {
  const romanNumerals = [
    ['L', 50], ['XL', 40], ['X', 10], ['IX', 9],
    ['V', 5], ['IV', 4], ['I', 1]] as readonly [string, number][];
  let roman = '';
  for (const [key, value] of romanNumerals) {
    while (num >= value) {
      roman += key;
      num -= value;
    }
  }
  return roman;
}

// Функция для случайной генерации части названия из слогов.
function getRandomFromArray<T>(array: T[], random: () => number): T {
  const index = Math.floor(random() * array.length);
  return array[index];
}

// Функция для генерации имени звездной системы.
export default function generateName(random: () => number, maxSyllables?: number): string {
  const partsCount = Math.min(
    Math.floor(random() * MAX_SYLLABLES - MIN_SYLLABLES) + MIN_SYLLABLES,
    maxSyllables ?? MAX_SYLLABLES
  );

  const firstPart = getRandomFromArray(SYLLABLES, random);
  const nameParts = [firstPart[0].toUpperCase() + firstPart.slice(1)];
  for (let i = 0; i < partsCount - 1; i++) {
    nameParts.push(getRandomFromArray(SYLLABLES, random));
  }

  // Добавляем римское число, отделенное дефисом.
  const romanNumber = arabicToRoman(Math.floor(random() * MAX_NUMBER) + 1);
  return `${nameParts.join('')}-${romanNumber}${getRandomFromArray(END_LETTERS, random)}`;
}