export interface College {
  id: string
  name: string
  city: string
  district: string
  source?: 'static' | 'user'
}

export const KARNATAKA_PUC_COLLEGES: College[] = [
  // ── From List Of College.txt ──
  { id: 'aecs-maaruti', name: 'AECS Maaruti PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'al-ameen', name: 'Al-Ameen PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'base-puc', name: 'BASE PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'bvb-puc', name: 'BVB Pre-University College', city: 'Hubballi', district: 'Dharwad' },
  { id: 'besant-womens', name: "Besant Women's PU College", city: 'Mangaluru', district: 'Dakshina Kannada' },
  { id: 'bel-puc', name: 'Bharath Electronics (BEL) PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'canara-puc', name: 'Canara PU College', city: 'Mangaluru', district: 'Dakshina Kannada' },
  { id: 'carmel-puc', name: 'Carmel PU College', city: 'Mangaluru', district: 'Dakshina Kannada' },
  { id: 'christ-junior', name: 'Christ Junior College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'deeksha-puc', name: 'Deeksha PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'expert-puc', name: 'Expert PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'govt-manvi', name: 'Government PU College (Boys), Manvi', city: 'Raichur', district: 'Raichur' },
  { id: 'govt-sindhanur', name: 'Government PU College, Sindhanur', city: 'Raichur', district: 'Raichur' },
  { id: 'hks-puc', name: 'HKS PU College', city: 'Hassan', district: 'Hassan' },
  { id: 'jss-puc-mysuru', name: 'JSS PU College', city: 'Mysuru', district: 'Mysuru' },
  { id: 'jain-puc-blr', name: 'Jain PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'kle-belagavi', name: "KLE Society's PU College", city: 'Belagavi', district: 'Belagavi' },
  { id: 'kvs-dharwad', name: 'Karnataka Vidya Samsthe PU College', city: 'Dharwad', district: 'Dharwad' },
  { id: 'maharanis-puc', name: "Maharani's PU College for Women", city: 'Mysuru', district: 'Mysuru' },
  { id: 'marimallapas', name: "Marimallappa's PU College", city: 'Mysuru', district: 'Mysuru' },
  { id: 'mes-puc', name: 'M.E.S. PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'mount-carmel-blr', name: 'Mount Carmel PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'narayana-puc', name: 'Narayana PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'national-jayanagar', name: 'National PU College, Jayanagar', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'new-horizon-puc', name: 'New Horizon PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'presidency-puc', name: 'Presidency PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'rns-puc', name: 'RNS PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'rani-channamma', name: 'Rani Channamma PU College', city: 'Belagavi', district: 'Belagavi' },
  { id: 'sdm-ujire', name: 'SDM PU College', city: 'Ujire', district: 'Dakshina Kannada' },
  { id: 'sadvidya-puc', name: 'Sadvidya PU College', city: 'Mysuru', district: 'Mysuru' },
  { id: 'sarvodaya-puc', name: 'Sarvodaya PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'seshadripuram-puc', name: 'Seshadripuram Composite PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'sharada-puc', name: 'Sharada PU College', city: 'Mangaluru', district: 'Dakshina Kannada' },
  { id: 'sri-chaitanya-puc', name: 'Sri Chaitanya PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'sri-kumaran', name: "Sri Kumaran Children's Home PU College", city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'st-aloysius-mlr', name: 'St. Aloysius PU College', city: 'Mangaluru', district: 'Dakshina Kannada' },
  { id: 'st-anns-mys', name: "St. Ann's PU College", city: 'Mysuru', district: 'Mysuru' },
  { id: 'sjpuc-blr', name: "St. Joseph's Pre-University College (SJPUC)", city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'st-philomenas', name: "St. Philomena's PU College", city: 'Mysuru', district: 'Mysuru' },
  { id: 'vidyavardhaka-mys', name: 'Vidyavardhaka PU College', city: 'Mysuru', district: 'Mysuru' },
  { id: 'vidyodaya-udupi', name: 'Vidyodaya PU College', city: 'Udupi', district: 'Udupi' },
  { id: 'vijaya-mahantesh', name: 'Vijaya Mahantesh PU College', city: 'Vijayapura', district: 'Vijayapura' },
  { id: 'vijaya-puc-blr', name: 'Vijaya PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'vishwa-vidya', name: 'Vishwa Vidya Peetha PU College', city: 'Bengaluru', district: 'Bangalore Urban' },
  // ── Detailed entries from txt ──
  { id: 'adarsh-hubli', name: 'Adarsh Pre-University Science College, Vidya Nagar', city: 'Hubballi', district: 'Dharwad' },
  { id: 'advitya-hoskote', name: 'Advitya Pre-University College, Hoskote', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'anweshana-biligere', name: 'Anweshana PU College, Biligere', city: 'Mysuru', district: 'Mysuru' },
  { id: 'basava-girls-kengeri', name: 'Basava Girls Pre-University College, Kengeri', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'bet-bismillahnagar', name: 'BET Composite Pre-University College, Bismillahnagar', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'bgs-nagaruru', name: 'BGS PU College, Nagaruru', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'bharatiya-samskriti', name: 'Bharatiya Samskriti Vidyapith Pre-University College, Chamarajpet', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'bishop-cotton-yelahanka', name: 'Bishop Cotton Pre-University College, Yelahanka New Town', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'bms-women-basavanagudi', name: 'BMS PU College For Women, Basavanagudi', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'charans-cambridge', name: "Charan's Pre-University College, Cambridge Layout", city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'christ-global-hallehalli', name: 'Christ Global Composite Pre-University College, Hallehalli', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'cmr-national-btm', name: 'CMR National PU College, B.T.M. Layout', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'devika-ranebennur', name: 'Devika Pre-University College, Ranebennur', city: 'Haveri', district: 'Haveri' },
  { id: 'diamond-krpuram', name: 'Diamond Pre-University College, K.R. Puram', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'don-bosco-kumbalagodu', name: 'Don Bosco Independent Pre-University College, Kumbalagodu', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'east-point-bidarahalli', name: 'East Point PU College, Bidarahalli', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'east-west-kumbalgodu', name: 'East West Independent PU College, Kumbalgodu', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'elite-chikkamagaluru', name: 'Elite Pre-University College, K.M. Road', city: 'Chikkamagaluru', district: 'Chikkamagaluru' },
  { id: 'excellent-sunnari', name: 'Excellent Pre-University College, Sunnari', city: 'Udupi', district: 'Udupi' },
  { id: 'gcis-malleshpalya', name: 'GCIS PU College, Malleshpalya', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'global-shaheen-tumakuru', name: 'Global Shaheen Pre-University College', city: 'Tumakuru', district: 'Tumakuru' },
  { id: 'gurukul-kalaburagi', name: 'Gurukul Pre-University College, Station Bazar Road', city: 'Kalaburagi', district: 'Kalaburagi' },
  { id: 'indus-valley-krpuram', name: 'Indus Valley Pre-University College, K.R. Puram', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'jame-ul-uloom', name: 'Jame-Ul-Uloom Pre-University College, Bannikuppe', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'jk-vignana-nagar', name: 'J.K. Pre-University College, Vignana Nagar', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'js-mallathahalli', name: 'JS PU College, Mallathahalli', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'jss-bannimantap', name: 'JSS PU College, Bannimantap', city: 'Mysuru', district: 'Mysuru' },
  { id: 'jss-jpnagar', name: 'JSS PU College, J.P. Nagar', city: 'Mysuru', district: 'Mysuru' },
  { id: 'jss-vijayanagar-mys', name: 'JSS PU College, Vijayanagar II Stage', city: 'Mysuru', district: 'Mysuru' },
  { id: 'kvv-vijayanagar-blr', name: 'Karnataka Vidya Vardhaka Pre-University College, Vijayanagar', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'kles-prerana-hubli', name: 'KLES Prerana Pre-University College', city: 'Hubballi', district: 'Dharwad' },
  { id: 'mahesh-nagarabhavi', name: 'Mahesh Pre-University College, Nagarabhavi', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'masvs-gurukula', name: 'MASVS Gurukula PU College, Kuvempunagara', city: 'Mysuru', district: 'Mysuru' },
  { id: 'mmk-sdm-girls', name: 'MMK & SDM Girls PU College, Krishnamurthypuram', city: 'Mysuru', district: 'Mysuru' },
  { id: 'mng-bangarpet', name: 'MNG Pre-University College, Bangarpet', city: 'Kolar', district: 'Kolar' },
  { id: 'mvj-whitefield', name: 'MVJ Pre-University College, Whitefield', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'nutan-vidyalaya-kalaburagi', name: 'Nutan Vidyalaya PU College, Brahmapur', city: 'Kalaburagi', district: 'Kalaburagi' },
  { id: 'om-sai-sunkadakatte', name: 'Om Sai Pre-University College, Sunkadakatte', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'oxford-srinivaspura', name: 'Oxford Composite Pre-University College, Srinivaspura', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'prism-saptapur', name: 'Prism Pre-University Science College, Saptapur', city: 'Dharwad', district: 'Dharwad' },
  { id: 'raman-kamakshipalya', name: 'Raman PU College, Kamakshipalya', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 's-kumar-mahesh-vijayapura', name: "S. Kumar's Mahesh Pre-University College, Baratagi Road", city: 'Vijayapura', district: 'Vijayapura' },
  { id: 'shet-rikhabchand-raichur', name: 'Shet Rikhabchand Parasmal Sukhani Pre-University College', city: 'Raichur', district: 'Raichur' },
  { id: 'sri-aurobindo-hassan', name: 'Sri Aurobindo Mahesh Pre-University College, Kuvempu Nagar', city: 'Hassan', district: 'Hassan' },
  { id: 'sri-chaitanya-marathahalli', name: 'Sri Chaitanya Pre-University College, Marathahalli', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'sri-damodar-kalaburagi', name: 'Sri Damodar Raghoji Memorial Pre-University College, Mehta Layout', city: 'Kalaburagi', district: 'Kalaburagi' },
  { id: 'sri-sai-women-rajajinagar', name: 'Sri Sai PU College For Women, Rajajinagar', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'sri-swamy-narendra-bidar', name: 'Sri Swamy Narendra Pre-University College, Devi Colony', city: 'Bidar', district: 'Bidar' },
  { id: 'sri-viveka-srirampura', name: 'Sri Viveka Vidyalaya PU College, Srirampura 3rd Stage', city: 'Mysuru', district: 'Mysuru' },
  { id: 'st-aloysius-harihar', name: "St. Aloysius Pre-University College, Amaravathi", city: 'Harihar', district: 'Davanagere' },
  { id: 'st-anthonys-kengeri', name: "St. Anthony's PU College, Kengeri", city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'st-josephs-new-tharagupet', name: 'St. Josephs Composite PU College, New Tharagupet', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'stg-chinakurali', name: 'STG Pre-University College, Chinakurali', city: 'Mandya', district: 'Mandya' },
  { id: 'swamy-vivekananda-neralur', name: 'Swamy Vivekananda PU College, Neralur', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'tapasya-krpuram', name: 'Tapasya PU College, K.R. Puram', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'vanita-women-dharwad', name: 'Vanita Women Arts and Commerce Pre-University College, Ram Nagar', city: 'Dharwad', district: 'Dharwad' },
  { id: 'vijaya-jyothi-yelahanka', name: 'Vijaya Jyothi Composite PU College, Yelahanka', city: 'Bengaluru', district: 'Bangalore Urban' },
  { id: 'vivekananda-gudimavu', name: 'Vivekananda Pre-University College, Gudimavu', city: 'Bengaluru', district: 'Bangalore Urban' },
]

export function searchColleges(query: string, extra: College[] = []): College[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const all = [...KARNATAKA_PUC_COLLEGES, ...extra]
  // deduplicate by name (case-insensitive)
  const seen = new Set<string>()
  return all.filter(c => {
    const key = c.name.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return key.includes(q) || c.city.toLowerCase().includes(q) || c.district.toLowerCase().includes(q)
  })
}
