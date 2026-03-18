// types/auth.ts

export type Exchange = 
    | "NSE" | "SLBM" | "NDM" | "NCO" | "CDS" | "NCDEX" 
    | "MCXSX" | "MCXSXFO" | "MCXSXCM" | "MCX" | "BSEMF" 
    | "BSE" | "BCO" | "BCD" | "BFO" | "NFO";

export type ProductCode = "BO" | "CNC" | "CO" | "MIS" | "MTF" | "NRML";

export type AuthStep = 'LOGIN' | 'OTP' | 'CHANGE PASSWORD' | 'FORGOT PASSWORD';
export type AuthFlow = 'LOGIN_FLOW' | 'RECOVERY_FLOW';
export type RecoveryTab = 'PASSWORD' | 'USER_ID'; 
export interface RecoveryStepProps {
  onNext: (id: string, type: RecoveryTab) => void;
}
export interface StepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
}
export interface JwtTokens {
    accessToken: string;
    refreshToken: string;
}

export interface KraResponse {
    kraMessage: string;
    kraUrl: string[];
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    username: string;
    userId: number;
    accountId: string;
    emailId: string;
    phoneNumber: number;
    enabledExchanges: Exchange[];
    enabledProductCode: ProductCode[];
    brokerName: string;
    branchId: string;
    userType: string;
    loginMessage: string;
    disclosureUrl: string;
    gttEnabled: boolean;
    sipEnabled: boolean;
    marketWatchCount: string;
    userSessionId: number;
    isPasswordExpired: boolean;
    indexEnabledExchanges: string[] | null;
    kraResponse: KraResponse[];
    jwtTokens: JwtTokens; 
}

export interface HandshakeResponse {
    message: string;
    bffPublicKey: string;
}

export interface LoginResponse {
    message: string;
}