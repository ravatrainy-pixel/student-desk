import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { initialData } from "../data/initialData";
import {
  loadAppData,
  saveAppData,
} from "../utils/storage";

import { getSubjects } from "../services/api";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [data, setData] = useState(() =>
    loadAppData(initialData)
  );

  // ---------------------------------------------------------
  // SAVE DATA TO LOCAL STORAGE
  // ---------------------------------------------------------

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  // ---------------------------------------------------------
  // LOAD SUBJECTS FROM API
  // ---------------------------------------------------------

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const apiSubjects = await getSubjects();

        setData((previousData) => ({
          ...previousData,
          subjects: apiSubjects,
        }));

        console.log(
          "Subjects loaded from API:",
          apiSubjects
        );
      } catch (error) {
        console.error(
          "Unable to load subjects from API:",
          error
        );
      }
    };

    loadSubjects();
  }, []);

  // ---------------------------------------------------------
  // SYNC LOCAL STORAGE BETWEEN TABS
  // ---------------------------------------------------------

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key !== "studentDeskAppData" ||
        !event.newValue
      ) {
        return;
      }

      try {
        const updatedData = JSON.parse(
          event.newValue
        );

        setData(updatedData);
      } catch (error) {
        console.error(
          "Error syncing StudentDesk data:",
          error
        );
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // ---------------------------------------------------------
  // ADD ITEM
  // ---------------------------------------------------------

  const addItem = (section, item) => {
    setData((previousData) => {
      const sectionItems =
        previousData[section] || [];

      const nextId =
        sectionItems.length > 0
          ? Math.max(
              ...sectionItems.map(
                (existingItem) =>
                  Number(existingItem.id) || 0
              )
            ) + 1
          : 1;

      const newItem = {
        ...item,
        id: nextId,
      };

      return {
        ...previousData,
        [section]: [
          ...sectionItems,
          newItem,
        ],
      };
    });
  };

  // ---------------------------------------------------------
  // UPDATE ITEM
  // ---------------------------------------------------------

  const updateItem = (
    section,
    id,
    updatedFields
  ) => {
    setData((previousData) => ({
      ...previousData,

      [section]: (
        previousData[section] || []
      ).map((item) =>
        Number(item.id) === Number(id)
          ? {
              ...item,
              ...updatedFields,
            }
          : item
      ),
    }));
  };

  // ---------------------------------------------------------
  // DELETE ITEM
  // ---------------------------------------------------------

  const deleteItem = (
    section,
    id
  ) => {
    setData((previousData) => ({
      ...previousData,

      [section]: (
        previousData[section] || []
      ).filter(
        (item) =>
          Number(item.id) !== Number(id)
      ),
    }));
  };

  // ---------------------------------------------------------
  // SET SECTION
  // ---------------------------------------------------------

  const setSection = (
    section,
    value
  ) => {
    setData((previousData) => ({
      ...previousData,
      [section]: value,
    }));
  };

  // ---------------------------------------------------------
  // UPDATE USER
  // ---------------------------------------------------------

  const updateUser = (
    userId,
    updatedFields
  ) => {
    setData((previousData) => ({
      ...previousData,

      users: previousData.users.map(
        (user) =>
          Number(user.id) === Number(userId)
            ? {
                ...user,
                ...updatedFields,
              }
            : user
      ),
    }));
  };

  // ---------------------------------------------------------
  // RESET DATA
  // ---------------------------------------------------------

  const resetData = () => {
    setData(initialData);
  };

  // ---------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------

  const value = {
    data,

    subjects: data.subjects,
    schedules: data.schedules,
    attendance: data.attendance,
    assignments: data.assignments,
    submissions: data.submissions,
    results: data.results,
    notices: data.notices,
    tasks: data.tasks,
    users: data.users,

    addItem,
    updateItem,
    deleteItem,
    setSection,
    updateUser,
    resetData,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

// ---------------------------------------------------------
// CUSTOM HOOK
// ---------------------------------------------------------

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => {
  const context =
    useContext(AppDataContext);

  if (!context) {
    throw new Error(
      "useAppData must be used inside AppDataProvider"
    );
  }

  return context;
};

export default AppDataProvider;