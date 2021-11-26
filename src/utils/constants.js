import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const TOAST_TIMEOUT = 2000;
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const BASE_URL = 'https://ptown-api.herokuapp.com'
export const MAP_QUEST = '7A9j5WyZHe8gGEMVuLIs0e3rJ53yGHHG'
export const MAP_QUEST_BASE_URL = 'http://www.mapquestapi.com'

export const POLOMOLOK_BARANGAYS = [
    'Select Barbershop',
    'Poblacion',
    'Cannery Site',
    'Bentung',
    'Crossing Palkan',
    'Glamang',
    'Kinilis',
    'Klinan 6',
    'Koronadal Proper',
    'Lam Caliaf',
    'Landan',
    'Lapu',
    'Lumakil',
    'Maligo',
    'Pagalungan',
    'Palkan',
    'Polo',
    'Rubber',
    'Silway 7',
    'Silway 8',
    'Sulit',
    'Sumbakil',
    'Upper Klinan'
]