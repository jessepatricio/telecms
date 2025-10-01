export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const validatePassword: (password: string) => {
    isValid: boolean;
    errors: string[];
};
//# sourceMappingURL=password.d.ts.map