import mongoose,{Schema,models,model} from "mongoose";

export const VIDEO_DIMENSIONS = {//we ain't using interface here cuz we don't need to create that datatype here, if we were to use those values somewhere else then we would've used the interface.
    width: 1080,
    height: 920    
// const → means the variable binding (VIDEO_DIMENSIONS) cannot be reassigned.
// But the object’s properties are still mutable and widened.

// as const → is a TypeScript assertion that makes the object:
// deeply immutable (readonly)
// properties have literal types instead of just number.
// 
} as const;


export interface IVIDEO{
    _id?: mongoose.Types.ObjectId;//"?"cuz maybe user is on the register page and hasn't created an account yet, so id isn't there, but if he's on the login page, then there is an id.
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?:{//transformation is of datatype - Object
        height: number,
        width: number,
        quality?: number
    }//we also coulda provided another interface like IDIMENSIONS, if we had created an interface for dimensions, but we didn't
    //that's why we're using this object datatype.

}

const videoSchema = new Schema<IVIDEO>(
    {//mongoose syntax.
        title: {type: String, required: true, },
        description: {type: String, required: true},
        videoUrl: {type: String, required: true},
        thumbnailUrl: {type: String, required: true},
        controls: {type: Boolean, default: true},
        transformation: {
            height: {type: Number, default: VIDEO_DIMENSIONS.height},//using Const values as default.
            width: {type: Number, default: VIDEO_DIMENSIONS.width},
            quality: {type: Number, min: 1, max: 100}//this quality thing comes from imagekit.
        }

    },
    {
        timestamps: true
    }
)

//we could also use hooks like pre-> maybe to send a confirmation email to the user that their video has been uploaded.

const Video = models?.Video || model("Video",videoSchema);

export default Video;
//git commit puts the latest commit to the head, and git push updates the online repo with the latest updates made in the local repo.
//Now since there are multiple edges in nextjs, so the api you make also runs on all of them,
//so we now also need to check if database is already connected somewhere or not, otherwise the same database will be connected to multiple edges
//What we really need to check is that if the connection to db already exists or not.(same thing that we did with models)
//There can be 3 states here:-
//1.connected.
//2.Not connected.
//3.Promise On the Way.

//Firstly, we'll create a types declaration file.