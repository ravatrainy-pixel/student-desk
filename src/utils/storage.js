const STORAGE_KEY = "studentDeskAppData";

export const loadAppData = (initialData) => {
  try {
    const savedData =
      localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error(
      "Error loading StudentDesk data:",
      error
    );
  }

  return initialData;
};

export const saveAppData = (data) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(
      "Error saving StudentDesk data:",
      error
    );
  }
};

export const clearAppData = () => {
  localStorage.removeItem(STORAGE_KEY);
};