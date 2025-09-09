import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
    //   address: string //nextauth gives us address but we'll use id as it'll be easier to look up in the database we're using(cuz we're storing users using email n password)
      id: string;

        //   By default, TypeScript will merge new interface properties and overwrite existing ones. In this case, the default session user properties will be overwritten, with the new one defined above.
        // If you want to keep the default session user properties, you need to add them back into the newly declared interface:    
    // & DefaultSession["user"] part.
    } & DefaultSession["user"]
    //One thing tho, all of this Next-Auth is for logging in the user! not registring user.
    //we can log the user in through github/google mail or anything else(you can see in docs), basically there are multiple providers.
    //so now we have to handle register user(since we'll store the user in the database)
  }
}
//SO the tasks are
//1.Make a seperate api to register the user, since Next-auth doesn't handle register.
//2.We need to login the user using the credentials(you can see that in docs of next-auth)

//for 1. make a folder in app directory called "api" and then another folder inside it "auth" , names of these two can't be any other!
// now let's make a route/api endpoint called register. and create a file called route.ts(cuz this is backend), we'll also create a frontend page with tsx. but that's for later now go to route.ts