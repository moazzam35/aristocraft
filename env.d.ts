declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    RESEND_API_KEY?: string;
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_TEST_MODE?: string;
  }
}
