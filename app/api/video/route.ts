//here, there'll be a get method(to get all videos) and a post method(to create a video record)

import { connectToDB } from "@/utils/db";
import Video, { IVIDEO } from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function GET(){
    //for get all videos we want all users should be able to see them, i.e logged in users and not logged in users.
    // if you want just logged in users then just do this:
    // const session = getServerSession(authOptions)//checking if user is even authorized or not.

    //     //check if there's no session at all
    //     if(!session){
    //         return NextResponse.json(
    //             {error: "Unauthorized"},
    //             {status: 401}
    //         )
    //     }  

    try {
        await connectToDB();
        const videos = await Video.find({}).sort({createdAt: -1}).lean()//.find({}) gives all videos, sort sorts them, lean tells Mongoose: “Just give me a plain JS object, I don’t need all your fancy Document methods.” 
        // Why use .lean()

        // Performance: Lean queries are faster because Mongoose doesn’t need to create full Document objects with methods.

        // Memory: Consumes less memory for large queries.

        // When you don’t need Mongoose methods: For example, when sending data directly to a frontend API.

        if(!videos || videos.length === 0){
            return NextResponse.json([],{status: 200})//empty array so that atleast someone on the frontend can run the loop
        }

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to fetch videos"},
            {status: 500}
        )
    }
}

export async function POST(request: NextRequest){
    try {
        const session = getServerSession(authOptions)//checking if user is even authorized or not.

        //check if there's no session at all
        if(!session){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }      

        await connectToDB();

        const body: IVIDEO = await request.json()//data that user sends from the frontend form, using IVIDEO interface for validation.

        //let's do another validation check.
        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "Missing Required fields"},
                {status: 400}
            )
        }

        const VideoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100 //if quality came from body then it is the quality otherwise it will be 100% quality.
            }//?? operator returns the first truthy value.
        }
        
        const newVideo = await Video.create(VideoData);

        return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to create Video"},
            {status: 500}
        )
    }
}//Now the next thing is Frontend for register login and middleware(can be in backend or frontend) in nextjs.
//in frontend we write page instead of route, and backend is written in api folder.
//npx dotenv-types-generator.
//now, in nextjs if we want hooks(or use classical react) then we gotta use client component, by default everything is server component.
//everything in the api folder was for backend, rest everything that you create in the app folder is frontend.//for ex: register folder in the app folder.
//go to page.tsx there.