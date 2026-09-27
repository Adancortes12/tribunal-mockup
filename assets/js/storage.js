// =====================================================
// STORAGE
// Manejo de LocalStorage
// =====================================================

export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getData(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);

    if (!data) {
      return fallback;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo storage:", key, error);

    return fallback;
  }
}

export function removeData(key) {
  localStorage.removeItem(key);
}

export function clearStorage() {
  localStorage.clear();
}
