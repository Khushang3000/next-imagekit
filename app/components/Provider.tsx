import React from "react"

//we need session provider to let the upload component know of the authenticated user.
import { SessionProvider } from "next-auth/react"
import { ImageKitProvider } from "@imagekit/next"

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!
//can also have an additional check that if there's no urlEndpoint then just return an error.


export default function Provider ({children}:{children: React.ReactNode}){
    //the type of object that contains children is the object that contains children(that are of type React.ReactNode)

    //refetchInterval is the time interval after which the session will be refetched, In Seconds.
    return <SessionProvider refetchInterval={5*60}>
        {/* It creates a context that holds your ImageKit configuration (like urlEndpoint, publicKey, authenticator function).

        Any child component (e.g. <IKImage />, <IKUpload />) can consume this context instead of you having to pass props again and again. */}
        
        <ImageKitProvider>
        {children}
        </ImageKitProvider>
        
        </SessionProvider>
}

//now how do we use the provider.we can either use it in page.tsx or layout.tsx of app. since layout wraps everything so why not there,
//also we could wrap the whole body as well, or maybe just children.