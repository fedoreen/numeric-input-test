import { reactive } from 'vue'

export interface Person {
  id: number
  name: string
  ageInHours: number,
  imagePath: string
}

export interface AppState {
  people: Person[]
  minimumAgeInMonths: number
}

export const DEFAULT_IMAGE_PATH = '/cat.png';
const DEFAULT_NAME = 'Samuel';

export const store = reactive<AppState>({
  people: [
    { id: 1, name: DEFAULT_NAME, ageInHours: 262800, imagePath: DEFAULT_IMAGE_PATH },
    { id: 2, name: DEFAULT_NAME, ageInHours: 350400, imagePath: DEFAULT_IMAGE_PATH },
    { id: 3, name: DEFAULT_NAME, ageInHours: 219000, imagePath: DEFAULT_IMAGE_PATH },
  ],
  minimumAgeInMonths: 0,
})
