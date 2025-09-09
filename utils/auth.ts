import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
export const authOptions : NextAuthOptions = {//since we're using ts then why not use NextAuthOptions as well.
    //we'll provide authOptions here in a seperate file just to follow seperation of concern or modularity
    //firstly create [...nextauth] folder within the auth folder, now create a file route.ts there and go to it, we'll take authOptions from here later.
    //in nextjs every folder has a file, where that files runs only when that folder path is specified in the url.

    providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!
  })
  //that's it, that's github or any other provider!
]

};