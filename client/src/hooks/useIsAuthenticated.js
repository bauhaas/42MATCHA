import { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";

function useIsAuthenticated() {
  // Declare a state variable to store the authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Declare a `useEffect` hook to check the user's authentication status
  useEffect(() => {
    // Get the JWT from the local storage
    const jwt = localStorage.getItem('jwt');

    // Check if the JWT is valid
    if (jwt) {
      try {
        // Decode the JWT to get the user's information
        const user = jwt_decode(jwt);
        console.log(user);
        // Check if the JWT has expired
        const currentTime = Date.now() / 1000;
        if (user.exp < currentTime) {
          // The JWT has expired, so the user is not authenticated
          setIsAuthenticated(false);
        } else {
          // The JWT is valid and has not expired, so the user is authenticated
          setIsAuthenticated(true);
        }
      } catch (error) {
        // The JWT is not valid, so the user is not authenticated
        setIsAuthenticated(false);
      }
    } else {
      // There is no JWT in the local storage, so the user is not authenticated
      setIsAuthenticated(false);
    }
  }, []);

  // Return the `isAuthenticated` state variable
  return { isAuthenticated };
}

export default useIsAuthenticated