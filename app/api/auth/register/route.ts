//since nextjs servers don't run normally but on edge functions so there's different way of handling req and response as well
import { NextRequest, NextResponse } from "next/server";
import User from '../../../../models/User'; //importing the User model, for validation maybe.
import { connectToDB } from "@/utils/db";// for registering the user in the database.


//whenever we write backend in nextjs we write it in api folder. the auth folder thingy is specified by the nextauth docs.
//in nextjs since the path is defined by folder structure like example.com/api/auth/register
// now POST method is covered in this register route, for the GET method(Login) we'll create another route and use Nextjs there
//AS NEXTJS HANDLES AUTHENTICATION FOR YOU!!!!!!!!!!!! 
export async function POST(request: NextRequest) {
    //now we just want email n password of the user to register them.
    //1.Get data from frontend.
    //2.we can do validation, and check if db is connected or not(we did this in connectToDB function.) and only then check if user already exists or not.
    //3.then create the user in db and then return the success response.
    try {
      const {email, password} = await request.json(); // in nextjs request doesn't come directly cuz of the edge functions stuff so we always gotta await the request.
      //step1 get data from frontend done.

      if(!email || !password){
        return NextResponse.json(
            {error: "Email and Password are required!!! "},//nextjs already gives us these, and even the status code
            {status: 400}//we can even send statusText.
        )
      }
      //step2.1 validation done

      await connectToDB()
      //step2.2 check conneciton to db done

      const existingUser = await User.findOne({email})
      if(existingUser){
        return NextResponse.json(
            {error: "User already Registered!!! "},
            {status: 400}
        )
      }
      //step2.3 checking if user already exists or not done.


      await User.create({//since this is a db req so we use await, we could also store this in some variable but we ain't doing that for now.
        email,
        password
      })
      //step3.1 creating user done.
      return NextResponse.json(
        {message: "User Registered Successfully"},
        {status: 200}
      )
    } catch (error) {
        console.error("Registration Error", error)
        return NextResponse.json(
            {error: "Failed To register User"},
            {status: 400}
        )
        //step3.2 sending success response done.
        //now go into utils folder and create auth or authOptions file.
    }
}