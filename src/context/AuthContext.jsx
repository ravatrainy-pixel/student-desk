import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "studentDeskUser";

// Same login credentials for both roles
const LOGIN_EMAIL = "admin@example.com";
const LOGIN_PASSWORD = "123456";

const demoUsers = {
  student: {
    id: 1,
    name: "Demo Student",
    role: "student",
    email: LOGIN_EMAIL,
    enrollmentNo: "STUDENT001",
    phone: "",
    address: "",
    city: "",
    department: "Computer Engineering",
    program: "B.Tech Computer Engineering",
    semester: 7,
    cgpa: 8.02,
    profileImage: "",
  },

  teacher: {
    id: 6,
    name: "Demo Teacher",
    role: "teacher",
    email: LOGIN_EMAIL,
    enrollmentNo: "",
    phone: "",
    address: "",
    city: "",
    department: "Computer Engineering",
    program: "",
    semester: "",
    cgpa: "",
    profileImage: "",
  },
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(
        AUTH_STORAGE_KEY
      );

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error(
        "Error loading logged-in user:",
        error
      );

      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (email, password, role) => {
    // Same credentials for both student and teacher
    if (
      email !== LOGIN_EMAIL ||
      password !== LOGIN_PASSWORD
    ) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Role decides which demo user is logged in
    if (!demoUsers[role]) {
      return {
        success: false,
        message: "Please select a valid role.",
      };
    }

    setCurrentUser(demoUsers[role]);

    return {
      success: true,
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCurrentUser = (updatedFields) => {
    setCurrentUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      return {
        ...previousUser,
        ...updatedFields,
      };
    });
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthProvider;