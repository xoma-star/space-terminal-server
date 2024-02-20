import {PlanetData, SystemData} from '../../types';
import seedrandom from 'seedrandom';
import {generateRandom, generateRandomNormal} from '../pseudoRandom';
import generateName from '../generateName';
import {
  RAW_RESOURCE_RARITY,
  RawResource,
  StarLuminosityClass,
  StarSpectralClass,
  StarType,
  TimeOfYear
} from '../../constants';

const MAX_TEMPERATURE = 560;
const MIN_TEMPERATURE = -240;
const MAX_RADIATION_LEVEL = 10;
const MIN_RADIATION_LEVEL = 0;
const MAX_GRAVITY = 50;
const MIN_GRAVITY = 0.001;
const MAX_PRESSURE = 1000;
const MIN_PRESSURE = 0;
const MAX_MAGNETIC_FIELD = 100;
const MIN_MAGNETIC_FIELD = 0;
const MAX_TOXICITY_LEVEL = 10;
const MIN_TOXICITY_LEVEL = 0;
const MAX_TECTONIC_ACTIVITY = 10;
const MIN_TECTONIC_ACTIVITY = 0;

/**
 * Получить текущий прогресс дня и года
 */
function getCurrentDateProgress(): {day: number, year: number} {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = Number(now) - Number(start);
  const oneHour = 1000 * 60 * 60;
  const oneDay = oneHour * 24;
  const dayProgress = (Number(now) % oneDay) / oneDay;
  return {
    day: dayProgress,
    year: diff / oneDay / 365
  };
}

function generateResources<T extends StarType>(
  random: () => number,
  planetData: Omit<PlanetData, 'resources'>,
  systemData: SystemData<T>
): PlanetData['resources'] {
  const resourcesArray: {resource: RawResource, probability: number}[] = Object.keys(RAW_RESOURCE_RARITY).map((resource) => ({
    resource: resource as RawResource,
    probability: RAW_RESOURCE_RARITY[resource as RawResource]
  }));
  const resources: Partial<Record<RawResource, number>> = {};
  for (const resource of resourcesArray) {
    if (random() < resource.probability) {
      resources[resource.resource] = generateRandom(random, 0, 1);
    }
  }

  switch (systemData.starType) {
    case StarType.STAR:
      switch (systemData.luminosityClass) {
        case StarLuminosityClass.I:
        case StarLuminosityClass.II:
        case StarLuminosityClass.III:
        case StarLuminosityClass.IV:
        case StarLuminosityClass.V:
        case StarLuminosityClass.VI:
        case StarLuminosityClass.VII:
      }
      switch (systemData.spectralClass) {
        case StarSpectralClass.O:
        case StarSpectralClass.B:
        case StarSpectralClass.A:
        case StarSpectralClass.F:
        case StarSpectralClass.G:
        case StarSpectralClass.K:
        case StarSpectralClass.M:
      }
  }
  return resources;
}

interface OrbitalForm {
  a: number;
  b: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Получить координаты точки на орбите
 * @param orbitalForm параметры уравнения эллипса
 * @param yearProgress прогресс года (от 0 до 100)
 */
function getPointCoordinates(
  orbitalForm: OrbitalForm,
  yearProgress: number
): {x: number, y: number} {
  const theta = 2 * Math.PI * yearProgress / 100;

  return {
    x: orbitalForm.a * Math.cos(theta) + orbitalForm.offsetX,
    y: orbitalForm.b * Math.sin(theta) + orbitalForm.offsetY
  };
}

function getCurrentSeason(orbitalForm: OrbitalForm, currentDateProgress: number): TimeOfYear {
  // Вычисляем общую длину орбиты планеты
  const orbitLength = Math.PI * (3*(orbitalForm.a + orbitalForm.b) - Math.sqrt((3*orbitalForm.a + orbitalForm.b) * (orbitalForm.a + 3*orbitalForm.b)));

  // Вычисляем длину каждого сезона
  const longSeasonLength = orbitLength / 2 * orbitalForm.a / (orbitalForm.a + orbitalForm.b);
  const shortSeasonLength = orbitLength / 2 * orbitalForm.b / (orbitalForm.a + orbitalForm.b);

  // Вычисляем текущую позицию на орбите
  const currentPosition = currentDateProgress * orbitLength;

  // Определяем текущий сезон
  if (currentPosition < shortSeasonLength) {
    return TimeOfYear.SPRING;
  } else if (currentPosition < shortSeasonLength + longSeasonLength) {
    return TimeOfYear.SUMMER;
  } else if (currentPosition < 2 * shortSeasonLength + longSeasonLength) {
    return TimeOfYear.AUTUMN;
  } else {
    return TimeOfYear.WINTER;
  }
}

function generateBiome(data: Pick<PlanetData,
  'radiationLevel'
  | 'temperature'
  | 'pressure'
  | 'gravity'
  | 'magneticField'
  | 'toxicityLevel'
  | 'tectonicActivity'
>) {

}

/**
 * Генерация данных о планете
 * @param seed - сид для генерации
 * @param systemData - данные о звездной системе
 * @param countFromStar - порядковый номер планеты в системе
 */
export default function generatePlanet<T extends StarType>(seed: string, systemData: SystemData<T>, countFromStar: number): PlanetData {
  const random = seedrandom(seed);
  const name = generateName(random, 3);
  const temperature = generateRandomNormal(MIN_TEMPERATURE, MAX_TEMPERATURE, -30, 0.5, random);
  const radiationLevel = generateRandomNormal(0, 10, 5, 0.5, random);
  const gravity = generateRandomNormal(0.001, 50, 10, 1, random);
  const pressure = generateRandomNormal(0, 1000, 30, 0.2, random);
  const magneticField = generateRandomNormal(0, 100, 10, 0.4, random);
  const toxicityLevel = generateRandomNormal(0, 10, 5, 0.5, random);
  const tectonicActivity = generateRandomNormal(0, 10, 5, 0.5, random);

  const dayLength = Number(generateRandom(random, 10, 60).toFixed(2));
  const yearLength = Number(generateRandom(random, 100, 1000).toFixed(2));

  // параметры уравнения эллипса
  // (x - offsetX)^2 / a^2 + (y - offsetY)^2 / b^2 = 1
  const orbitalForm: OrbitalForm = {
    a: generateRandomNormal(0.5, 2, 1, 0.9, random),
    b: generateRandomNormal(0.5, 2, 1, 0.9, random),
    offsetX: generateRandomNormal(0, 0.3, 0, 0.5, random),
    offsetY: generateRandomNormal(0, 0.3, 0, 0.5, random),
  };

  // здесь можно посылвать только прогресс и пройденный угол
  // координаты строить на клиенте
  const currentDateProgress = getCurrentDateProgress();

  const currentSeason = getCurrentSeason(orbitalForm, currentDateProgress.year);

  const currentPosition = getPointCoordinates({
    a: orbitalForm.a * 100 * (countFromStar + 1),
    b: orbitalForm.b * 100 * (countFromStar + 1) ,
    offsetX: orbitalForm.offsetX * 100 * (countFromStar + 1),
    offsetY: orbitalForm.offsetY * 100 * (countFromStar + 1)
  }, currentDateProgress.year * 100);

  const planetData: Omit<PlanetData, 'resources'> = {
    name,
    temperature,
    radiationLevel,
    gravity,
    pressure,
    magneticField,
    dayLength,
    tectonicActivity,
    yearLength,
    toxicityLevel,
    season: currentSeason,
    orbitalPosition: currentPosition,
    size: generateRandom(random, 0.3, 3)
  };

  const resources = generateResources(random, planetData, systemData);

  console.log(resources)

  return {
    ...planetData,
    resources
  };
}