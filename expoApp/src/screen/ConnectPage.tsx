import React, { useContext } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { AccountContext } from "../Context/AccountContext";
import { HelloWorld__factory } from "../contracts"
import { ethers } from "ethers";

import {CONTRACT_ADDRESS} from "@env"


export default function ConnectPage() {
    const state = useContext(AccountContext);
    const { connected, signer, connect, killSession } = state;
    const [address, setAddress] = React.useState<string>('');
    const [balance, setBalance] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('');
    const [text, onChangeText] = React.useState('');

    const contractAddress = CONTRACT_ADDRESS;

    const contract = HelloWorld__factory.connect(contractAddress, signer);

    const getMessage = async () => {
        const message = await contract.message();
        setMessage(message);
    }

    const setMessageContract = async () => {
        await contract.update(text);
        console.log("Message sent to the contract: " + text)
    }

    // Subscribe to the event "UpdatedMessages" of the contract, get info (address, balance, message)
    React.useEffect(() => {
        if (connected) {
            // Set the address and the balance of the connected account
            signer.getAddress().then(
                (address: string) => {
                    setAddress(address);
                }
            )
            signer.getBalance().then(
                (balance: ethers.BigNumber) => {
                    setBalance(ethers.utils.formatEther(balance));
                }
            )

            // Get current message
            getMessage();

            // Subscribe to the event "UpdatedMessages" of the contract
            contract.on("UpdatedMessages", (oldMsg: string, newMessage: string) => {
                Alert.alert("Message updated !", "The message was updated from " + oldMsg + " to " + newMessage + ".")
                setMessage(newMessage);
            }
            );
        } else{
            // Reset the address and the balance of the connected account
            setAddress('');
            setBalance('');
            setMessage('');
        }
    }, [connected]);


    return (
        <View>
            <Text>Address: {address}</Text>
            <Text>Balance: {balance}</Text>
            <Text>Message: {message}</Text>
            <Text>Connected: {connected ? "Yes" : "No"}</Text>
            {!connected ?
                <Button onPress={connect} title="Connect" />
                :
                <>
                    <Button onPress={killSession} title="Disconnect" />
                    <Button onPress={getMessage} title="Get Message" />
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        placeholder="Insert new message for the contract"
                    />
                    <Button onPress={setMessageContract} title="Set Message" />
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});
