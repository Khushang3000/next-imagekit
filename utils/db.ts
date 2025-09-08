import mongoose from "mongoose";//for connection

//nextjs automatically gives you access to the env variables and you don't need to install additional packages.

const MONGODB_URI = process.env.MONGODB_URI!
// ! just means we're telling typescript that this value is not null or undefined.

if(!MONGODB_URI){
    throw new Error("Please define mongodb_uri in env variables")
}

//let's cache the connection, i.e if connection is already available then use that connection, if not then just create a new one.
let cached = global.mongoose; //for the first time this code runs, this will be undefined

// SO, Types.d.ts tells typescript that.
// “Hey, there is a global variable mongoose, and when you access it, it will always exist and have this shape.”

// So from a type-checking perspective, global.mongoose is never undefined.

// 2. What actually happens at runtime

// At runtime (when the program actually executes):

// Node.js doesn’t magically create global.mongoose just because you declared a type.

// Until you explicitly assign it, global.mongoose is undefined(for the first time the code runs anywhere, it will always be undefined and then reach this if block below) (just like any uninitialized property on an object).
if(!cached){//if there is no cache value then just set all o' them(promise and connection) to null, atleast initialize them.
    cached = global.mongoose = {connection: null, promise: null}//atleast initialize it with connection and promise
    //here's where typescript helps, we can not set any other values than connection or promise!!! that is type safety.
}
// ################################################################################################################
// 1. interface
// Used to define a shape of an object (a custom type).

// Exists only in TypeScript’s type system, not at runtime.

// Example:
// interface User {
//   id: string;
//   name: string;
// }

// const u: User = { id: "1", name: "Alice" }; // ✅
// Here you’re just creating a reusable type contract.

// 2. declare

// Used to tell TypeScript about something that already exists at runtime, but TS doesn’t know about it.

// Doesn’t create the value — just informs the compiler.

// Example:
// declare const process: {
//   env: { [key: string]: string | undefined }
// };
// Here you’re saying:
// “Trust me, there’s a process variable available at runtime, and it looks like this.”
// You’re not defining it (Node.js defines it), you’re just describing it for TS.
// ######################################################################################################################
export async function connectToDB(){
    // 1.if connection is there 
    if(cached.connection){//if connection is there in cached, then just simply export it! 
        return cached.connection;
    }
    // 2.IF ABOVE CASE WASN'T TRUE, THEN THERE IS DEFINTELY NO CONNECTION


    // 2.a- if there is no promise, then send promise
    if(!cached.promise){

        const opts = {
            // bufferCommands: true,
            // maxPoolSize: 10
            //these opts are passed on the basis of which plan you're using, and if you're using the free tier then just don't pass opts
            //in mongoose.connect as a 2nd option.
        }


        cached.promise = mongoose.connect(MONGODB_URI,opts).then(()=>mongoose.connection);
        //this promise will store promise which returns the Connection type(as declared in the types.d.ts)
    }

    try {
        cached.connection = await cached.promise; //return, the resolved value(connection) and store it in cached.connection
    } catch (error) {
        // if there was an error then just make the promise inside the cached to null.
        cached.promise = null;
        throw error;
    }

    //if everything was successful then just return the cached.connection.
    return cached.connection;

}