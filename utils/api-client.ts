// We make an api client here which sends the req to all o' backend and takes response, and then wherever we want to call any function to interact with backend
//we just import this api client object and call that method(controller) through this object.
//components just need to call that method.

import { IVIDEO } from "@/models/Video";
export type VIDEOFORMDATA = Omit<IVIDEO, "_id">
//this is typescript syntax, read more about it on your own.


type fetchOptions = {//all the fetch/axios methods
    method? :"GET" | "POST" | "PUT" | "DELETE";
    body? : any;
    headers? : Record<string, string> //key-value pair.
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: fetchOptions = {}//if there's no fetchOptions then make it empty by default.
    ): Promise<T> {//"Promise<T> means that we will return it a promise type value with any <T> generic type", in ts, the return type comes just after () of the function, body of method begins now.
        const {method = "GET", body, headers = {}} = options;//here also on the left side destructuring, we are giving default values in case no values were passed.
    
        const defaultHeaders = {//could've given them on the line above too.
            "Content-Type": "application/json",
            ...headers,//spread existing headers.
        }

        const response = await fetch(`/api/${endpoint}`,{
            method,
            headers:defaultHeaders,
            body: body ? JSON.stringify(body):undefined
        })

        if(!response.ok){
            throw new Error(await response.text())//we used await here cuz our method expects us to return a Promise only of any type<T> basically.
            //that's why in this method whatever we wanna return from this method, we gotta use await before it.
        }
        return response.json();
    }


    //Like this we can any function and make it hit any endpoint through our own customised fetch method.
    async getVideos(){
        return this.fetch("/videos")
    }

    
    async createVideo(videoData: VIDEOFORMDATA){
        return this.fetch("/videos",{
            method: "POST",
            body: videoData,

        })
    }
}

export const apiClient = new ApiClient();//exporting the created object.

//now the next thing is go into imagekit docs read about videocomponent and imagecomponent. Read about them.