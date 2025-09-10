declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_PUBLIC_KEY: string;
      
      NEXT_PUBLIC_URL_ENDPOINT: string;
      IMAGEKIT_PRIVATE_KEY: string;
      
    }
  }
}

export {};
