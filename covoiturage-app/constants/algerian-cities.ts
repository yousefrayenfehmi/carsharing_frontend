/**
 * Liste des villes algériennes populaires avec leurs coordonnées
 * Utile pour l'autocomplétion et la suggestion
 */

export interface AlgerianCity {
  name: string;
  arabicName: string;
  latitude: number;
  longitude: number;
  wilaya: string;
}

export const ALGERIAN_CITIES: AlgerianCity[] = [
  // Grandes villes
  {
    name: 'Alger',
    arabicName: 'الجزائر',
    latitude: 36.7538,
    longitude: 3.0588,
    wilaya: 'Alger',
  },
  {
    name: 'Oran',
    arabicName: 'وهران',
    latitude: 35.6969,
    longitude: -0.6331,
    wilaya: 'Oran',
  },
  {
    name: 'Constantine',
    arabicName: 'قسنطينة',
    latitude: 36.3650,
    longitude: 6.6147,
    wilaya: 'Constantine',
  },
  {
    name: 'Annaba',
    arabicName: 'عنابة',
    latitude: 36.9000,
    longitude: 7.7667,
    wilaya: 'Annaba',
  },
  {
    name: 'Blida',
    arabicName: 'البليدة',
    latitude: 36.4804,
    longitude: 2.8277,
    wilaya: 'Blida',
  },
  {
    name: 'Batna',
    arabicName: 'باتنة',
    latitude: 35.5559,
    longitude: 6.1743,
    wilaya: 'Batna',
  },
  {
    name: 'Djelfa',
    arabicName: 'الجلفة',
    latitude: 34.6704,
    longitude: 3.2631,
    wilaya: 'Djelfa',
  },
  {
    name: 'Sétif',
    arabicName: 'سطيف',
    latitude: 36.1905,
    longitude: 5.4122,
    wilaya: 'Sétif',
  },
  {
    name: 'Sidi Bel Abbès',
    arabicName: 'سيدي بلعباس',
    latitude: 35.1939,
    longitude: -0.6310,
    wilaya: 'Sidi Bel Abbès',
  },
  {
    name: 'Biskra',
    arabicName: 'بسكرة',
    latitude: 34.8503,
    longitude: 5.7244,
    wilaya: 'Biskra',
  },
  {
    name: 'Tébessa',
    arabicName: 'تبسة',
    latitude: 35.4042,
    longitude: 8.1242,
    wilaya: 'Tébessa',
  },
  {
    name: 'Tiaret',
    arabicName: 'تيارت',
    latitude: 35.3711,
    longitude: 1.3228,
    wilaya: 'Tiaret',
  },
  {
    name: 'Béjaïa',
    arabicName: 'بجاية',
    latitude: 36.7525,
    longitude: 5.0556,
    wilaya: 'Béjaïa',
  },
  {
    name: 'Tlemcen',
    arabicName: 'تلمسان',
    latitude: 34.8783,
    longitude: -1.3150,
    wilaya: 'Tlemcen',
  },
  {
    name: 'Béchar',
    arabicName: 'بشار',
    latitude: 31.6167,
    longitude: -2.2167,
    wilaya: 'Béchar',
  },
  {
    name: 'Tizi Ouzou',
    arabicName: 'تيزي وزو',
    latitude: 36.7117,
    longitude: 4.0481,
    wilaya: 'Tizi Ouzou',
  },
  {
    name: 'Skikda',
    arabicName: 'سكيكدة',
    latitude: 36.8761,
    longitude: 6.9094,
    wilaya: 'Skikda',
  },
  {
    name: 'Médéa',
    arabicName: 'المدية',
    latitude: 36.2637,
    longitude: 2.7537,
    wilaya: 'Médéa',
  },
  {
    name: 'Mostaganem',
    arabicName: 'مستغانم',
    latitude: 35.9315,
    longitude: 0.0892,
    wilaya: 'Mostaganem',
  },
  {
    name: "M'Sila",
    arabicName: 'المسيلة',
    latitude: 35.7056,
    longitude: 4.5416,
    wilaya: "M'Sila",
  },
  {
    name: 'Ouargla',
    arabicName: 'ورقلة',
    latitude: 31.9496,
    longitude: 5.3255,
    wilaya: 'Ouargla',
  },
  {
    name: 'Chlef',
    arabicName: 'الشلف',
    latitude: 36.1647,
    longitude: 1.3347,
    wilaya: 'Chlef',
  },
  {
    name: 'Bordj Bou Arreridj',
    arabicName: 'برج بوعريريج',
    latitude: 36.0686,
    longitude: 4.7671,
    wilaya: 'Bordj Bou Arreridj',
  },
  {
    name: 'El Oued',
    arabicName: 'الوادي',
    latitude: 33.3572,
    longitude: 6.8636,
    wilaya: 'El Oued',
  },
  {
    name: 'Bouira',
    arabicName: 'البويرة',
    latitude: 36.3689,
    longitude: 3.9014,
    wilaya: 'Bouira',
  },
  {
    name: 'Ghardaïa',
    arabicName: 'غرداية',
    latitude: 32.4917,
    longitude: 3.6736,
    wilaya: 'Ghardaïa',
  },
  {
    name: 'Jijel',
    arabicName: 'جيجل',
    latitude: 36.8202,
    longitude: 5.7665,
    wilaya: 'Jijel',
  },
  {
    name: 'Relizane',
    arabicName: 'غليزان',
    latitude: 35.7374,
    longitude: 0.5558,
    wilaya: 'Relizane',
  },
  {
    name: 'Saïda',
    arabicName: 'سعيدة',
    latitude: 34.8417,
    longitude: 0.1503,
    wilaya: 'Saïda',
  },
  {
    name: 'Khenchela',
    arabicName: 'خنشلة',
    latitude: 35.4361,
    longitude: 7.1433,
    wilaya: 'Khenchela',
  },
  {
    name: 'Guelma',
    arabicName: 'قالمة',
    latitude: 36.4625,
    longitude: 7.4331,
    wilaya: 'Guelma',
  },
  {
    name: 'Laghouat',
    arabicName: 'الأغواط',
    latitude: 33.8067,
    longitude: 2.8631,
    wilaya: 'Laghouat',
  },
  {
    name: 'Mascara',
    arabicName: 'معسكر',
    latitude: 35.3963,
    longitude: 0.1403,
    wilaya: 'Mascara',
  },
  {
    name: 'Oum El Bouaghi',
    arabicName: 'أم البواقي',
    latitude: 35.8753,
    longitude: 7.1136,
    wilaya: 'Oum El Bouaghi',
  },
  {
    name: 'Souk Ahras',
    arabicName: 'سوق أهراس',
    latitude: 36.2863,
    longitude: 7.9511,
    wilaya: 'Souk Ahras',
  },
  {
    name: 'Tipaza',
    arabicName: 'تيبازة',
    latitude: 36.5892,
    longitude: 2.4475,
    wilaya: 'Tipaza',
  },
  {
    name: 'Aïn Defla',
    arabicName: 'عين الدفلى',
    latitude: 36.2647,
    longitude: 1.9681,
    wilaya: 'Aïn Defla',
  },
  {
    name: 'Aïn Témouchent',
    arabicName: 'عين تموشنت',
    latitude: 35.2992,
    longitude: -1.1397,
    wilaya: 'Aïn Témouchent',
  },
  {
    name: 'Boumerdès',
    arabicName: 'بومرداس',
    latitude: 36.7667,
    longitude: 3.4833,
    wilaya: 'Boumerdès',
  },
  {
    name: 'El Tarf',
    arabicName: 'الطارف',
    latitude: 36.7672,
    longitude: 8.3139,
    wilaya: 'El Tarf',
  },
  {
    name: 'Illizi',
    arabicName: 'إليزي',
    latitude: 26.5072,
    longitude: 8.4833,
    wilaya: 'Illizi',
  },
  {
    name: 'Mila',
    arabicName: 'ميلة',
    latitude: 36.4503,
    longitude: 6.2642,
    wilaya: 'Mila',
  },
  {
    name: 'Naâma',
    arabicName: 'النعامة',
    latitude: 33.2667,
    longitude: -0.3167,
    wilaya: 'Naâma',
  },
  {
    name: 'Tamanrasset',
    arabicName: 'تمنراست',
    latitude: 22.7850,
    longitude: 5.5228,
    wilaya: 'Tamanrasset',
  },
  {
    name: 'Tindouf',
    arabicName: 'تندوف',
    latitude: 27.6711,
    longitude: -8.1475,
    wilaya: 'Tindouf',
  },
  {
    name: 'Tissemsilt',
    arabicName: 'تيسمسيلت',
    latitude: 35.6072,
    longitude: 1.8106,
    wilaya: 'Tissemsilt',
  },
  {
    name: 'El Bayadh',
    arabicName: 'البيض',
    latitude: 33.6814,
    longitude: 1.0197,
    wilaya: 'El Bayadh',
  },
  {
    name: 'Adrar',
    arabicName: 'أدرار',
    latitude: 27.8742,
    longitude: -0.2039,
    wilaya: 'Adrar',
  },
];

/**
 * Rechercher des villes par nom (support français et arabe)
 */
export const searchAlgerianCity = (query: string): AlgerianCity[] => {
  if (!query || query.length < 2) return ALGERIAN_CITIES;

  const lowerQuery = query.toLowerCase();
  return ALGERIAN_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.arabicName.includes(query) ||
      city.wilaya.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Obtenir une ville par son nom exact
 */
export const getCityByName = (name: string): AlgerianCity | undefined => {
  return ALGERIAN_CITIES.find(
    (city) => city.name.toLowerCase() === name.toLowerCase()
  );
};

/**
 * Obtenir les coordonnées d'une ville
 */
export const getCityCoordinates = (
  cityName: string
): { latitude: number; longitude: number } | null => {
  const city = getCityByName(cityName);
  return city ? { latitude: city.latitude, longitude: city.longitude } : null;
};

