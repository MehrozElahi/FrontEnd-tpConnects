export class TokenResponse {
    data: TokenResponseData;
}

export class TokenResponseData {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    isChangePassword:boolean;
}