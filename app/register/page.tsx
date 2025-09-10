"use client"
import { useRouter } from 'next/navigation';
import React, { SetStateAction, useState } from 'react'

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();//used to redirect to some page.
    //if this was a server component(nextjs purely), then we could have just did this:
    // redirect("/login")

    //now we need to create a method that takes the data and sends it to an api endpoint.
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();//won't reload the page on form submission which is browser's default behaviour.
        //let's check password first.
        if(password !== confirmPassword){
            alert("Passwords Do Not Match!!!")
            return;
        }

        try {
            //now we send data.
            const response = await fetch("api/auth/register",{
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({//always send body in stringified.
                    // email: email,
                    // password: password
                    email,
                    password
                })
            });
            
            //now we collect data from that response and parse it into json.
            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || "Registration failed")
            }

            console.log(data);
            router.push("/login");
            //redirect the user to the login page.
        } catch (error) {
            console.error(error);
        }
    }
  return (
    <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            {/* we didn't give action as we're handling the form onSubmit, No need to specify method here as well. */}

            <input type="email"
            placeholder='Email'
            value={email}
            onChange={(e:  React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)} 
            // can give this type of event in ts but your choice.
            />
            <input type="password"
            placeholder='Password'
            value={password}
            onChange={(e:  React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} 
            />
            <input type="password"
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e:  React.ChangeEvent<HTMLInputElement>)=>setConfirmPassword(e.target.value)} 
            />
            {/* we ain't sending password and confirm password to the backend, we're only sending password to the backend, the confirmPassword is a frontend thing. */}
            <button type="submit">Register</button>
        </form>
        <p>Already have an account?<a href="/login">Login</a></p>
    </div>
  )
  //we could've also managed debouncing, loading state and error.
}

export default RegisterPage
//use npm run dev, to run the whole application(yes with backend)
//after on the baseUrl/register is where you'll find this page.

//now let's create login page.