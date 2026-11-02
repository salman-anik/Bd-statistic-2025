// All figures are taken from BANBEIS "Bangladesh Education Statistics 2025" (June 2026).
export const years = [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]
export const students = [13069002,13794862,14565291,15602992,16733304,17734426,18358990,18609249,19473535,19711063,19967101,20234646,20227816,20383060,19673591,18731112]
export const teachers = [450039,472483,479719,495263,512519,536905,545537,555375,559432,597913,606128,627193,656855,646039,667099,691226]
export const femaleTeacherPct = [19.53,19.88,20.46,20.22,21.5,21.79,22.1,22.28,22.48,23.76,26.33,26.65,27.77,28.22,29.1,29.87]

export const levels = [
  { name: 'Secondary School', inst: 19211, teachers: 269131, fem: 31.43, students: 7439039, girls: 54.85 },
  { name: 'Madrasah (Dakhil–Kamil)', inst: 9296, teachers: 138675, fem: 22.39, students: 2840097, girls: 52.22 },
  { name: 'College', inst: 3380, teachers: 110151, fem: 28.29, students: 4184465, girls: 51.67 },
  { name: 'Technical-Vocational', inst: 2748, teachers: 32864, fem: 27.05, students: 650028, girls: 26.09 },
  { name: 'School & College', inst: 1556, teachers: 59786, fem: 35.92, students: 1531434, girls: 53.53 },
  { name: 'Professional', inst: 871, teachers: 17514, fem: 45.61, students: 132313, girls: 64.59 },
  { name: 'Teacher Education', inst: 192, teachers: 2852, fem: 29.63, students: 31549, girls: 39.93 },
  { name: 'University', inst: 174, teachers: 34831, fem: 30.48, students: 1113982, girls: 39.34 },
  { name: 'English Medium', inst: 143, teachers: 7697, fem: 71.66, students: 29673, girls: 46.55 },
]

export const primaryYears = [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]
export const GER = [107.7,101.5,104.4,108.6,108.4,109.2,112.1,111.7,114.23,109.6,104.85,105.72,110.48,104.53,106.37]
export const NER = [94.8,94.9,96.7,97.3,97.7,97.94,97.96,97.97,97.85,97.74,97.81,97.42,97.56,97.76,94.55]

export const girlsYears = [2017,2018,2019,2020,2021,2022,2023,2024,2025]
export const girlsByLevel = [
  { name: 'Junior Secondary (6–8)', color: '#6366f1', values: [54.98,55.14,54.91,55.41,55.12,54.98,55.18,54.68,54.53] },
  { name: 'Secondary (9–10)', color: '#0ea5e9', values: [51.82,51.65,51.68,53.57,53.28,53.01,51.88,52.03,52.44] },
  { name: 'Higher Secondary (11–12)', color: '#10b981', values: [47.24,46.97,46.96,48.85,48.42,48.44,48.75,50.04,51.25] },
  { name: 'Tertiary (Degree)', color: '#f59e0b', values: [42.0,41.39,43.23,43.8,45.06,45.7,45.93,46.14,46.77] },
]

export const budgetYears = ['15-16','16-17','17-18','18-19','19-20','20-21','21-22','22-23','23-24','24-25','25-26']
export const budgetShare = [11.78,15.43,14.25,13.52,15.03,12.77,12.4,13.0,12.72,11.76,12.52]
export const primaryShare = [4.91,7.79,6.44,5.62,5.72,4.63,4.76,4.81,4.99,4.72,4.48]
export const postPrimaryShare = [6.87,7.64,7.81,7.9,9.31,8.14,7.64,8.19,7.73,7.04,8.04]

export const hscYears = [2015,2016,2017,2018,2019,2020,2021,2022,2025]
export const hscPass = [65.84,72.47,66.84,64.55,71.85,100,95.57,84.31,57.12]

export const facilities = {
  'Secondary schools': [['Safe drinking water',98.35],['Girls’ toilet',95.23],['Computer facility',89.28],['Internet',83.7]],
  'Colleges': [['Electricity',99.72],['Internet',92.0],['Multimedia',78.99],['Solar panel',28.61]],
  'Madrasahs': [['Co-curricular activities',74.47],['Computer for teaching',51.06],['Science laboratory',26.67],['Ramp for special needs',7.68]],
  'English medium': [['Electricity',100],['CCTV',93.71],['Multimedia projector',83.22],['Computer lab',74.83]],
}

export const disasterAreas = [['Flood',1557],['Water logging',947],['Surge',487],['Cyclone',469],['Drought / Barind',344],['River erosion',313],['Tide ebbs',218],['Earthquake',190],['Salinity',119],['Landslide',37],['Other',950]]
export const unrecovered = [['Furniture',21.18],['Building',19.56],['Doors / windows',18.91],['Connecting road',16.02],['Sanitation',11.08],['Water supply',8.1],['Roof',5.16]]

export const kpis = [
  { label: 'Post-primary institutions', value: 45891, note: '37,571 with EIIN + 3,850 attached' },
  { label: 'Students (post-primary)', value: 18731112, note: '50.93% girls' },
  { label: 'Teachers', value: 691226, note: '29.87% female' },
  { label: 'Universities', value: 174, note: '56 public · 118 private' },
]
