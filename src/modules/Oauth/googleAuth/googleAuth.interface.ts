export interface GoogleUserResult{
    id: string,
    email: string,
    verified_email: string,
    name: string,
    given_name: string,
    family_name: string,
    locale: string
    phoneNumber: string
  }
  
  export interface GoogleOauthToken {
    access_token: string;
    id_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    scope: string;
  }