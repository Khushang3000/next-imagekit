import { Connection } from "mongoose";
//our node ecosystem doesn't know that if the db is already connected or not, that's why we're using a global variable which tells the whole
//ecosystem if the db is connected or not, if we didn't have this and just did const connection = await mongoose.connect(...) in nextjs then
// every API route or server function can be re-executed whenever a request comes in.
// So, inside every route handler → you’ll end up opening a new DB connection on every request.


declare global {//now the entire application has access to this "global" variable.
    //basically makes this type definition available all over the project.
    var mongoose: {
        connection: Connection | null;
        promise: Promise<Connection> | null; 
        // Promise<T> means:
        // "This is a Promise that will eventually resolve to a value of type T."

    }
}

export {} //this is just syntax, to make sure that global is available throughout the node ecosystem.
//now just create an .env file and put mongodb url in it. and then just create a lib/utils folder and go inside it to the db.ts file.