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
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth Context for sharing user state across the app
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = ""; // replace with you URL

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user has a valid token in AsyncStorage
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        setToken(token);
        const response = await fetch(
          `${API_URL}/validate-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser( {name: data.user.name} );
        } else {
          const errorData = await response.json();
          // alert(errorData.error || "User not found or token invalid.");
        }
      } else {
        // alert("No token found.");
      }
    } catch (error) {
      alert("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      // alert("Login response:", data);

      if (data && data.token) {
        await AsyncStorage.setItem("userToken", data.token);
        setToken(data.token);
        // alert("Token stored in AsyncStorage:", data.token); 
        setUser({ name: data.user.name });
      } else {
        alert("Login failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Login error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem("userToken");
      // alert("Token removed from AsyncStorage");
      setUser(null);
    } catch (error) {
      alert("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
};
