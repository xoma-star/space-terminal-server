import seedrandom from 'seedrandom';

/**
 * взвешенный случайный выбор
 * @param probs - объект, где ключ - значение, а значение - вероятность
 * @param random функция, генерирующая случайное число
 */
export function weightRandom<T extends string>(probs: Record<T, number>, random: () => number): T {
  const randomValue = random();
  const weights = (Object.keys(probs) as T[])
    .map((key) => ({key, weight: probs[key]}))
    .sort((a, b) => b.weight - a.weight);
  let sum = 0;
  for (const weight of weights) {
    sum += weight.weight;
    if (randomValue <= sum) {
      return weight.key;
    }
  }

  return weights[weights.length - 1].key;
}

/**
 * Генератор случайного числа с нормальным распределением
 * @param min минимальное значение
 * @param max максимальное значение
 * @param target число, к которому будет стремиться результат
 * @param spread степень разброса значений от target (от 0 до 1. в нуле все значения совпадают с target, в 1 - равномерное распределение от min до max
 * @param random функция, генерирующая случайное число
 */
export function generateRandomNormal(min: number, max: number, target: number, spread: number, random: () => number): number {
  let u1, u2, z0, res;
  do {
    u1 = random();
    u2 = random();
    z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    res = target + z0 * (max - min) * spread;
  } while (z0 < -3 || z0 > 3 || res < min || res > max);

  return Number(res.toFixed(2));
}

/**
 * Генератор случайного числа в диапазоне
 * @param min минимальное значение
 * @param max максимальное значение
 * @param random функция, генерирующая случайное число
 */
export function generateRandomInt(min: number, max: number, random: () => number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function generateRandom(random: () => number, min: number = 0, max: number = 1): number {
  return random() * (max - min) + min;
}