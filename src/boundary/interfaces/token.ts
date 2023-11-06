export interface StoreTokenRequest{
    accessToken:string;
    refreshToken:string;
    expiresAt:string;
    storeToken:boolean;
}

export interface RefreshTokenRequest {
    token: string;
    refreshToken: string;
}

export interface TokenResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
    refreshTokenExpiryTime: string;
    securityTimeStamp: string;
    isMFARequired: boolean;
    userImageURL: string | null;
}