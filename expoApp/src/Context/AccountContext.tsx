import React from "react";

interface AccountContextProps {
    connected: boolean;
    signer: any;
    provider: any;
    connect: () => void;
    killSession: () => void;
}

export const AccountContext = React.createContext<AccountContextProps>({
    connected: false,
    signer: null,
    provider: null,
    connect: () => { },
    killSession: () => { }
});
