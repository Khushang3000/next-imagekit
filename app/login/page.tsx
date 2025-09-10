"use client";
import React,{useState} from 'react'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        //if we had a custom different backend then we woulda sent a get request there and normally it woulda worked if we built backend to handle request from frontend in that way.

        const result = await signIn("Credentials",{//we named our credentials "Credentials" see authOptions, oh and btw this signIn Function is provided by NextAuth.
            email,
            password,
            redirect: false,
            //if this redirect was true this would've triggered the redirect callback function that we discussed about in the authOptions. 
        })
        //this result stores whatever our authorize function returned!!!!!!! 

        if(result?.error){
            console.log(result.error)//
        }else{
            router.push("/")
        }

    }

    return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input type="email"
            placeholder='Email'
            value={email}
            onChange={(e:  React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)} 
            />
        
            <input type="password"
            placeholder='Password'
            value={password}
            onChange={(e:  React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} 
            />

            <button type='submit'>Login</button>
        </form>
        <div>
            {/* in case of Google login:-
                        <button onClick={()=>{signIn("google")}}>SignIn with Google...</button>
                        and that thing that was in docs where you want to login with google credentials-> you coulda just copy pasted the code that was in docs.
            */}
            Don't have an account? <button onClick={()=>{router.push("/register")}}>Register</button>
        </div>

    </div>
    )
}
//NOW WE GOTTA HANDLE MIDDLEWARE->file's name is "middleware" can't be different.
//go to that file in app folder.
export default Login