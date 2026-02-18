import fs from 'fs';

// Load translation files
const en = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'));
const es = JSON.parse(fs.readFileSync('src/i18n/locales/es.json', 'utf8'));

function findMissingKeys(obj1, obj2, path = '') {
  const missing = [];
  
  for (const key in obj1) {
    const currentPath = path ? path + '.' + key : key;
    
    if (!(key in obj2)) {
      missing.push(currentPath);
    } else if (typeof obj1[key] === 'object' && obj1[key] !== null && !Array.isArray(obj1[key])) {
      missing.push(...findMissingKeys(obj1[key], obj2[key], currentPath));
    }
  }
  
  return missing;
}

// Find missing keys in Spanish
const missingInEs = findMissingKeys(en, es);

console.log('Claves faltantes en es.json:');
if (missingInEs.length === 0) {
  console.log('✅ No hay claves faltantes en es.json');
} else {
  missingInEs.forEach(key => console.log('- ' + key));
  console.log(`\nTotal de claves faltantes: ${missingInEs.length}`);
}

// Find missing keys in English
const missingInEn = findMissingKeys(es, en);

console.log('\nClaves faltantes en en.json:');
if (missingInEn.length === 0) {
  console.log('✅ No hay claves faltantes en en.json');
} else {
  missingInEn.forEach(key => console.log('- ' + key));
  console.log(`\nTotal de claves faltantes: ${missingInEn.length}`);
} 