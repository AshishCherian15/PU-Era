export interface Subject {
  id: string
  code: string
  name: string
  name_en?: string
  name_kn?: string
  name_hi?: string
  class_level: 'PUC1' | 'PUC2' | 'NCERT11' | 'NCERT12'
  stream: 'Commerce' | 'Science' | 'Arts' | 'General'
  board: 'Karnataka' | 'NCERT' | 'CBSE' | 'ICSE'
  has_lab: boolean
}

export const SUBJECTS: Subject[] = [
  // PUC1 Commerce
  { id: 'puc1-acc', code: 'ACC', name: 'Accountancy', name_kn: 'ಲೆಕ್ಕಪತ್ರ ಶಾಸ್ತ್ರ', name_hi: 'लेखांकन', class_level: 'PUC1', stream: 'Commerce', board: 'Karnataka', has_lab: false },
  { id: 'puc1-bst', code: 'BST', name: 'Business Studies', name_kn: 'ವ್ಯಾಪಾರ ಅಧ್ಯಯನಗಳು', name_hi: 'व्यवसाय अध्ययन', class_level: 'PUC1', stream: 'Commerce', board: 'Karnataka', has_lab: false },
  { id: 'puc1-eco', code: 'ECO', name: 'Economics', name_kn: 'ಅರ್ಥಶಾಸ್ತ್ರ', name_hi: 'अर्थशास्त्र', class_level: 'PUC1', stream: 'Commerce', board: 'Karnataka', has_lab: false },
  { id: 'puc1-eng', code: 'ENG', name: 'English', name_kn: 'ಇಂಗ್ಲಿಷ್', name_hi: 'अंग्रेज़ी', class_level: 'PUC1', stream: 'Commerce', board: 'Karnataka', has_lab: false },
  { id: 'puc1-knd', code: 'KND', name: 'Kannada', name_kn: 'ಕನ್ನಡ', name_hi: 'कन्नड़', class_level: 'PUC1', stream: 'Commerce', board: 'Karnataka', has_lab: false },
  { id: 'puc1-hin', code: 'HIN', name: 'Hindi', name_kn: 'ಹಿಂದಿ', name_hi: 'हिंदी', class_level: 'PUC1', stream: 'Commerce', board: 'Karnataka', has_lab: false },

  // PUC1 Science
  { id: 'puc1-phy', code: 'PHY', name: 'Physics', name_kn: 'ಭೌತಶಾಸ್ತ್ರ', name_hi: 'भौतिकी', class_level: 'PUC1', stream: 'Science', board: 'Karnataka', has_lab: true },
  { id: 'puc1-che', code: 'CHE', name: 'Chemistry', name_kn: 'ರಸಾಯನಶಾಸ್ತ್ರ', name_hi: 'रसायन विज्ञान', class_level: 'PUC1', stream: 'Science', board: 'Karnataka', has_lab: true },
  { id: 'puc1-mat', code: 'MAT', name: 'Mathematics', name_kn: 'ಗಣಿತ', name_hi: 'गणित', class_level: 'PUC1', stream: 'Science', board: 'Karnataka', has_lab: false },
  { id: 'puc1-bio', code: 'BIO', name: 'Biology', name_kn: 'ಜೀವಶಾಸ್ತ್ರ', name_hi: 'जीव विज्ञान', class_level: 'PUC1', stream: 'Science', board: 'Karnataka', has_lab: true },
  { id: 'puc1-cs', code: 'CS', name: 'Computer Science', name_kn: 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ', name_hi: 'कंप्यूटर विज्ञान', class_level: 'PUC1', stream: 'Science', board: 'Karnataka', has_lab: true },
  { id: 'puc1-sta', code: 'STA', name: 'Statistics', name_kn: 'ಅಂಕಿಅಂಕಿಗಳು', name_hi: 'सांख्यिकी', class_level: 'PUC1', stream: 'Science', board: 'Karnataka', has_lab: false },
  { id: 'puc1-elx', code: 'ELX', name: 'Electronics', name_kn: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್', name_hi: 'इलेक्ट्रॉनिक्स', class_level: 'PUC1', stream: 'Science', board: 'Karnataka', has_lab: true },

  // PUC1 Arts
  { id: 'puc1-his', code: 'HIS', name: 'History', name_kn: 'ಇತಿಹಾಸ', name_hi: 'इतिहास', class_level: 'PUC1', stream: 'Arts', board: 'Karnataka', has_lab: false },
  { id: 'puc1-pol', code: 'POL', name: 'Political Science', name_kn: 'ರಾಜಕೀಯ ಶಾಸ್ತ್ರ', name_hi: 'राजनीति विज्ञान', class_level: 'PUC1', stream: 'Arts', board: 'Karnataka', has_lab: false },
  { id: 'puc1-soc', code: 'SOC', name: 'Sociology', name_kn: 'ಸಮಾಜಶಾಸ್ತ್ರ', name_hi: 'समाजशास्त्र', class_level: 'PUC1', stream: 'Arts', board: 'Karnataka', has_lab: false },
  { id: 'puc1-geo', code: 'GEO', name: 'Geography', name_kn: 'ಭೂಗೋಳ', name_hi: 'भूगोल', class_level: 'PUC1', stream: 'Arts', board: 'Karnataka', has_lab: false },
  { id: 'puc1-psyc', code: 'PSYC', name: 'Psychology', name_kn: 'ಮಾನಸಿಕ ಶಾಸ್ತ್ರ', name_hi: 'मनोविज्ञान', class_level: 'PUC1', stream: 'Arts', board: 'Karnataka', has_lab: false },

  // PUC2 Commerce
  { id: 'puc2-acc', code: 'ACC', name: 'Accountancy', name_kn: 'ಲೆಕ್ಕಪತ್ರ ಶಾಸ್ತ್ರ', name_hi: 'लेखांकन', class_level: 'PUC2', stream: 'Commerce', board: 'Karnataka', has_lab: false },
  { id: 'puc2-bst', code: 'BST', name: 'Business Studies', name_kn: 'ವ್ಯಾಪಾರ ಅಧ್ಯಯನಗಳು', name_hi: 'व्यवसाय अध्ययन', class_level: 'PUC2', stream: 'Commerce', board: 'Karnataka', has_lab: false },
  { id: 'puc2-eco', code: 'ECO', name: 'Economics', name_kn: 'ಅರ್ಥಶಾಸ್ತ್ರ', name_hi: 'अर्थशास्त्र', class_level: 'PUC2', stream: 'Commerce', board: 'Karnataka', has_lab: false },

  // PUC2 Science
  { id: 'puc2-phy', code: 'PHY', name: 'Physics', name_kn: 'ಭೌತಶಾಸ್ತ್ರ', name_hi: 'भौतिकी', class_level: 'PUC2', stream: 'Science', board: 'Karnataka', has_lab: true },
  { id: 'puc2-che', code: 'CHE', name: 'Chemistry', name_kn: 'ರಸಾಯನಶಾಸ್ತ್ರ', name_hi: 'रसायन विज्ञान', class_level: 'PUC2', stream: 'Science', board: 'Karnataka', has_lab: true },
  { id: 'puc2-mat', code: 'MAT', name: 'Mathematics', name_kn: 'ಗಣಿತ', name_hi: 'गणित', class_level: 'PUC2', stream: 'Science', board: 'Karnataka', has_lab: false },
  { id: 'puc2-bio', code: 'BIO', name: 'Biology', name_kn: 'ಜೀವಶಾಸ್ತ್ರ', name_hi: 'जीव विज्ञान', class_level: 'PUC2', stream: 'Science', board: 'Karnataka', has_lab: true },
  { id: 'puc2-cs', code: 'CS', name: 'Computer Science', name_kn: 'ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ', name_hi: 'कंप्यूटर विज्ञान', class_level: 'PUC2', stream: 'Science', board: 'Karnataka', has_lab: true },

  // NCERT 11
  { id: 'nc11-phy', code: 'PHY', name: 'Physics', name_kn: 'ಭೌತಶಾಸ್ತ್ರ', name_hi: 'भौतिकी', class_level: 'NCERT11', stream: 'Science', board: 'NCERT', has_lab: true },
  { id: 'nc11-che', code: 'CHE', name: 'Chemistry', name_kn: 'ರಸಾಯನಶಾಸ್ತ್ರ', name_hi: 'रसायन विज्ञान', class_level: 'NCERT11', stream: 'Science', board: 'NCERT', has_lab: true },
  { id: 'nc11-mat', code: 'MAT', name: 'Mathematics', name_kn: 'ಗಣಿತ', name_hi: 'गणित', class_level: 'NCERT11', stream: 'Science', board: 'NCERT', has_lab: false },
  { id: 'nc11-bio', code: 'BIO', name: 'Biology', name_kn: 'ಜೀವಶಾಸ್ತ್ರ', name_hi: 'जीव विज्ञान', class_level: 'NCERT11', stream: 'Science', board: 'NCERT', has_lab: true },
  { id: 'nc11-acc', code: 'ACC', name: 'Accountancy', name_kn: 'ಲೆಕ್ಕಪತ್ರ ಶಾಸ್ತ್ರ', name_hi: 'लेखांकन', class_level: 'NCERT11', stream: 'Commerce', board: 'NCERT', has_lab: false },
  { id: 'nc11-eco', code: 'ECO', name: 'Economics', name_kn: 'ಅರ್ಥಶಾಸ್ತ್ರ', name_hi: 'अर्थशास्त्र', class_level: 'NCERT11', stream: 'Commerce', board: 'NCERT', has_lab: false },
  { id: 'nc11-bst', code: 'BST', name: 'Business Studies', name_kn: 'ವ್ಯಾಪಾರ ಅಧ್ಯಯನಗಳು', name_hi: 'व्यवसाय अध्ययन', class_level: 'NCERT11', stream: 'Commerce', board: 'NCERT', has_lab: false },
  { id: 'nc11-his', code: 'HIS', name: 'History', name_kn: 'ಇತಿಹಾಸ', name_hi: 'इतिहास', class_level: 'NCERT11', stream: 'Arts', board: 'NCERT', has_lab: false },
  { id: 'nc11-pol', code: 'POL', name: 'Political Science', name_kn: 'ರಾಜಕೀಯ ಶಾಸ್ತ್ರ', name_hi: 'राजनीति विज्ञान', class_level: 'NCERT11', stream: 'Arts', board: 'NCERT', has_lab: false },
  { id: 'nc11-soc', code: 'SOC', name: 'Sociology', name_kn: 'ಸಮಾಜಶಾಸ್ತ್ರ', name_hi: 'समाजशास्त्र', class_level: 'NCERT11', stream: 'Arts', board: 'NCERT', has_lab: false },

  // NCERT 12
  { id: 'nc12-phy', code: 'PHY', name: 'Physics', name_kn: 'ಭೌತಶಾಸ್ತ್ರ', name_hi: 'भौतिकी', class_level: 'NCERT12', stream: 'Science', board: 'NCERT', has_lab: true },
  { id: 'nc12-che', code: 'CHE', name: 'Chemistry', name_kn: 'ರಸಾಯನಶಾಸ್ತ್ರ', name_hi: 'रसायन विज्ञान', class_level: 'NCERT12', stream: 'Science', board: 'NCERT', has_lab: true },
  { id: 'nc12-mat', code: 'MAT', name: 'Mathematics', name_kn: 'ಗಣಿತ', name_hi: 'गणित', class_level: 'NCERT12', stream: 'Science', board: 'NCERT', has_lab: false },
  { id: 'nc12-bio', code: 'BIO', name: 'Biology', name_kn: 'ಜೀವಶಾಸ್ತ್ರ', name_hi: 'जीव विज्ञान', class_level: 'NCERT12', stream: 'Science', board: 'NCERT', has_lab: true },
  { id: 'nc12-acc', code: 'ACC', name: 'Accountancy', name_kn: 'ಲೆಕ್ಕಪತ್ರ ಶಾಸ್ತ್ರ', name_hi: 'लेखांकन', class_level: 'NCERT12', stream: 'Commerce', board: 'NCERT', has_lab: false },
  { id: 'nc12-eco', code: 'ECO', name: 'Economics', name_kn: 'ಅರ್ಥಶಾಸ್ತ್ರ', name_hi: 'अर्थशास्त्र', class_level: 'NCERT12', stream: 'Commerce', board: 'NCERT', has_lab: false },
  { id: 'nc12-bst', code: 'BST', name: 'Business Studies', name_kn: 'ವ್ಯಾಪಾರ ಅಧ್ಯಯನಗಳು', name_hi: 'व्यवसाय अध्ययन', class_level: 'NCERT12', stream: 'Commerce', board: 'NCERT', has_lab: false },
  { id: 'nc12-his', code: 'HIS', name: 'History', name_kn: 'ಇತಿಹಾಸ', name_hi: 'इतिहास', class_level: 'NCERT12', stream: 'Arts', board: 'NCERT', has_lab: false },
  { id: 'nc12-pol', code: 'POL', name: 'Political Science', name_kn: 'ರಾಜಕೀಯ ಶಾಸ್ತ್ರ', name_hi: 'राजनीति विज्ञान', class_level: 'NCERT12', stream: 'Arts', board: 'NCERT', has_lab: false },
]

export function getSubjectsByClass(classLevel: Subject['class_level']): Subject[] {
  return SUBJECTS.filter(s => s.class_level === classLevel)
}

export function getSubjectsByStream(stream: Subject['stream']): Subject[] {
  return SUBJECTS.filter(s => s.stream === stream)
}

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find(s => s.id === id)
}
