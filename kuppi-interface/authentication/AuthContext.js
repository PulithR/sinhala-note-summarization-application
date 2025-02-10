// import React, { createContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       if (token) {
//         const userData = await validateToken(token);
//         setUser(userData);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error while checking auth status:", error);
//       setLoading(false);
//     }

//     const login = async (credentials) => {
//       const login = async (credentials) => {
//         try {
//           const response = await loginAPIWithCredentials; //place holder to add login API
//           await AsyncStorage.setItem("userToken", response.token);
//           setUser(response.user);
//         } catch (error) {
//           console.error("Login error:", error.message);
//         }
//       };
//     }

//     const logout = async () => {
//       await AsyncStorage.removeItem("userToken");
//       setUser(null);
//     };

//     return (
//       <AuthContext.Provider value={{ user, login, logout, loading }}>
//         {children}
//       </AuthContext.Provider>
//     );
//   }
// }



// sign-up API implementation
import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth Context for sharing user state across the app
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = "http://192.168.43.131:5000";

  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // Sign-up function
  const signUp = async (credentials) => {
    try {
      // setLoading(true);
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      // alert("Sign-up response:", data);

      if (data && data.token) {
        await AsyncStorage.setItem("userToken", data.token);
        setToken(data.token);
        setUser({ name: data.user.name });
      } else {
        alert("Sign-up failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      // alert("Sign-up error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
};
