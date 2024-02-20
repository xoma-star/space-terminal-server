import {
  BiomeType,
  BlackHoleType, RawResource,
  StarLuminosityClass,
  StarSpectralClass,
  StarType,
  SurfaceType, TimeOfYear
} from './constants';

export interface ApplicationData {
  name: string;
  icon: string;
  availableOnDesktop?: boolean;
}

export interface SystemData<T extends StarType = StarType.STAR> {
  name: string;
  starType: T;
  luminosityClass?: T extends StarType.STAR ? StarLuminosityClass : never;
  spectralClass?: T extends StarType.STAR ? StarSpectralClass : never;
  blackHoleType?: T extends StarType.BLACK_HOLE ? BlackHoleType : never;
  size: number;
  color: string;
  planets: PlanetData[];
}

/**
 * Данные о планете
 */
export interface PlanetData {
  /** название планеты */
  name: string;
  /** ресурсы и их распространенность */
  resources: Partial<Record<RawResource, number>>;
  /** средняя температура на планете */
  temperature: number;
  /** средний уровень радиации (от 1 до 10) */
  radiationLevel: number;
    /** сила тяжести, g (на земле 1 g) */
  gravity: number;
  /** атмосферное давление (% от земного) */
  pressure: number;
  /** средний уровень токсинов (от 0 до 10) */
  toxicityLevel: number;
  /** продолжительность суток (часов) */
  dayLength: number;
  /** кол-во дней в году */
  yearLength: number;
  /** уровень тектонической активности (от 0 до 10) */
  tectonicActivity: number;
  /** магнитное поле (µT) */
  magneticField: number;
  /** радиус планеты (доля от базового размера) */
  size: number;
  /** время года */
  season: TimeOfYear;
  /** орбитальная позиция */
  orbitalPosition: {x: number; y: number};
}