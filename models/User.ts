//we installed bcryptjs, but it's types as well, which we'll use later, as we're using ts and it would throw an error.
import mongoose,{Schema,models,model} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUSER {//declaring our own custom type, as when we'll create an object we'd need that, 
    //why are we declaring a custom type? cuz it will be an actual entity/object that we'll make of this Interface.
    email: string;
    password: string;
    _id? : mongoose.Types.ObjectId | string ;//? means optional
    createdAt?: Date;
    updatedAt?: Date;
}

// now let's use this interface, how? we can use it as a datatype.
const userSchema = new Schema<IUSER>({//we're making use of generics to make a schema object of IUSER type! 
    //generic here means that this schema represents an IUSER object.

    //this type: String below is mongoose's syntax not typescript.
    email: {type: String, required: true, unique: true},//here if you change the types from String to something else then typescript gives you error.
    password:{type: String, required: true, }
}
,
{
    timestamps: true
})

//now we have pre and post hooks which are used with the data,
//pre- used just before the data enters the database
//post- used right after the data enters the database
//so we can perform actions such as:-
//email n password were about to reach the db, but by using pre hook we hashed the password, and then the hashed password was sent to the database.
userSchema.pre('save',async function (next){//1st arg is the action on which we want to perform the pre-hook and function is async because of bcrypt, and next is the parameter that will be called at the end of this function to call the next hook in the pipeline.

    if(this.isModified("password")){//here, this means the userSchema Object.
        this.password = await bcrypt.hash(this.password,8);//8 is the salting, and this.password is the thing that will be hashed(it should be a string)
    }
})

//nextjs has their edge functions/servers all across the world where our code runs, now we don't know which edge is our code running on,
//so we gotta make sure that we don't create new model at each edge, rather we want Only one model.
const User = models?.User || model("User", userSchema); //if User does exist in models, then just give that User model 
//if it doesn't then just make a "User"(name of model), with userSchema.
//since we already used the generic <IUSER> while creating userSchema so we don't need to use the same generic with the model function
//but if we didn't use that generic while creating userSchema then typescript wouldn’t know what fields the model has, and you’d lose type safety. In that case, we'd:
// model<IUSER>("User", userSchema)

//Now similarly we design the Video model.