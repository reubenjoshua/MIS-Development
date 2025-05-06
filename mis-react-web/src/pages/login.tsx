import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '../context/useAuth';
import { UserLogin } from '../models/User';

type LoginFormsInputs = {
    Identifier: string;
    Password:   string;
};

const validation = Yup.object().shape ({
    Identifier: Yup.string()
                            .required ("Email or username is required")
                            .test ("is-email-or-username", "Enter a valid email or username", value =>
                                !!value && (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[a-zA-Z0-9_]{3,30}$/.test(value))
                            ),
    Password:   Yup.string().required ("Password is required"),
});

export default function Login ()
{
    const { loginUser } = useAuth ();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm <LoginFormsInputs> ({ resolver: yupResolver (validation) });
    const handleLogin = (form: LoginFormsInputs) => {
        const userData: UserLogin = {
            Username:   form.Identifier,
            Password:   form.Password,
        };

        loginUser (userData);
    };

    return (
        <div className = "login-container flex justify-center items-center h-screen bg-[#f5f7fa]">
            <div className = "login-card py-10 px-8 md:w-sm w-2xs rounded-sm bg-white shadow-md">
                <h2 className = "mb-4 text-2xl text-center text-(--primary-color)">
                    Management Information System
                </h2>
                
                <form onSubmit = {handleSubmit (handleLogin)} className = "login-form flex flex-col">
                    <div className = "">
                        <div className = "form-group my-4">
                            <Label htmlFor = "identifier" className = "my-2">
                                Email
                            </Label>
                            <Input  id = ""
                                    type = "text"
                                    placeholder = ""
                                    className = ""
                                    required { ...register ("Identifier") }
                                />
                                { errors.Identifier && <p className = "">{ errors.Identifier.message }</p> }
                        </div>
                        <div className = "form-group my-4">
                            <Label htmlFor = "password" className = "my-2">
                                Password
                            </Label>
                            <Input  id = ""
                                    type = "password"
                                    placeholder = ""
                                    className = ""
                                    required { ...register ("Password") }
                                />
                            { errors.Password ? <p className = "">{ errors.Password.message }</p>: "" }
                        </div>
                        <div className = "flex flex-col ">
                            <Button type = "submit" className = "mt-4">
                                Login
                            </Button>
                        </div>
                        
                        {/* <button className = "m-5 p-3 h-10 w-50 bg-(--primary-color) text-white rounded-sm flex justify-center items-center self-center" type = "submit" disabled = {loading}>
                            {loading ? (
                                <>
                                {loading && (
                                    <div className = "flex justify-center items-center">
                                        <div className = "flex space-x-2 mt-2">
                                        <div className = "h-2.5 w-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className = "h-2.5 w-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className = "h-2.5 w-2.5 bg-white rounded-full animate-bounce"></div>
                                        </div>
                                    </div>)
                                }
                                <span className = "animate-pulse"></span>
                                </>
                                ) : (
                                "Login")
                            }
                        </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
}
