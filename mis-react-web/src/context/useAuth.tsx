import React from "react";
// import axios from "axios";
import Cookies from "js-cookie";

import { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "./authProvider";
import { UserProfile, UserLogin, UserToken } from '../models/User';

import { mockLoginAPI, mockFetchUserDetails } from "@/mocks/mockAPI";
import { date } from "yup";

type UserContextType = {
    user:       UserProfile | null;
    token:      string | null;
    loginUser:  (userData: UserLogin) => void;
    logout:     () => void;
    isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext <UserContextType> ({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState <string | null> (null);
    const [user, setUser] = useState <UserProfile | null> (null);
    const [isReady, setIsReady] = useState (false);
    const tokenExpirationInMs = 60 * 60 * 1000;

    // useEffect (() => {
    //     const storedToken = Cookies.get ("token");

    //     if (storedToken)
    //     {
    //         setToken (storedToken);
    //         // axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
    //         fetchUserDetails (storedToken);
    //     }
    //     else
    //     { setIsReady (true); }
    // }, []);

    useEffect (() => {
        const storedToken = Cookies.get ("token");
        const lastActivity = Cookies.get ("lastActivity");

        if (storedToken && lastActivity)
        {
            const timeElapsed = Date.now() - Number (lastActivity);

            if (timeElapsed < tokenExpirationInMs)
            {
                setToken (storedToken);
                // axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
                Cookies.set ("lastActivity", String (Date.now()));
                fetchUserDetails (storedToken);
            }
            else
            { logout(); }
        }

        setIsReady (true);
    }, []);

    const fetchUserDetails = async (token: string) => {
        try
        {
            // const res = await axios.get (`${import.meta.env.VITE_REACT_APP_API_URL}/users/userDetails`, {
            //     headers: {
            //         Authorization:  `Bearer ${token}`,
            //         "Content-Type": "application/json",
            //     },
            // });
            // const data = res.data;

            // if (data && typeof data.ID !== "undefined")
            // {
            //     setUser(
            //     {
            //         ID:         data.ID,
            //         FirstName:  data.FirstName,
            //         LastName:   data.LastName,
            //         Email:      data.Email,
            //         Password:   data.Password,
            //         Role:       data.Role
            //     });
            // }

            const data = await mockFetchUserDetails (token);

            if (data)
            { setUser (data); }

            setIsReady (true);
        }
        catch (err)
        {
            console.error ("Error fetching user data: ", err);
            setIsReady (true);
        }
    };

    const loginUser = async (userData: UserLogin) => {
        try
        {
            // const res = await loginAPI (userData);

            // if (typeof res?.data === 'boolean')
            // {
            //     if (res.data === true)
            //     { toast.error ("User does not exist"); }
            //     else
            //     { toast.error ("Invalid credentials"); }
            // }
            // else if (res?.data && typeof res.data.token === 'string')
            // {
            //     Cookies.set ("token", res.data.token);

            //     setToken (res.data.token);
            //     toast.success ("Login Success");
            //     navigate ("/mis/");
            //     fetchUserDetails (res.data.token);
            // }
            // else
            // { toast.warning ("Unexpected response from server"); }

            const res = await mockLoginAPI (userData);

            if (!res.success)
            {
                toast.error (res.error);
                return;
            }

            const { token, user } = res.data;

            Cookies.set ("token", token);
            Cookies.set ("lastActivity", String (Date.now()));
            setToken (token);
            setUser (user);

            // toast.success ("Login Success");

            fetchUserDetails (res.data.token);
            navigate ("/mis/dashboard");
        }
        catch (err)
        // { toast.warning ("Server error occurred"); }
        {
            console.error ("Mock fetch failed: ", err);
            setIsReady (true);
        }
    };

    // const isLoggedIn = () => {
    //     return !!token;
    // };
    const isLoggedIn = () => !!token;

    const logout = () => {
        Cookies.remove ("token");
        Cookies.remove ("lastActivty");

        setUser (null);
        setToken ("");
        navigate ("/mis");
    };

    return (
        <UserContext.Provider
            value = {
                {
                    loginUser,
                    user,
                    token,
                    logout,
                    isLoggedIn
                }
            }
        >
            { isReady ? children : null }
        </UserContext.Provider>
    );
}

export const useAuth = () => React.useContext (UserContext);