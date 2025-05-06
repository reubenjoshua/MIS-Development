import axios from "axios";
import { UserToken, UserLogin } from "../models/User";
import { handleError } from "../helpers/errorHandlers";

export const loginAPI = async (userData: UserLogin) => {
    try
    {
        const data = await axios.post <UserToken> (`${import.meta.env.VITE_REACT_APP_API_URL
        }/users/login`, userData);

        console.log (data.data);

        return data;
    }

    catch (err)
    { handleError (err); }
}