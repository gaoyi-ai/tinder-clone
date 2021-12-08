import { doc, onSnapshot, orderBy, query } from '@firebase/firestore'
import { useRoute } from '@react-navigation/core'
import React, { useState } from 'react'
import { View, KeyboardAvoidingView, Keyboard, FlatList, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from 'react-native/Libraries/NewAppScreen'
import { useEffect } from 'react/cjs/react.development'
import ReceiverMessage from '../components/ReceiverMessage'
import SenderMessage from '../components/SenderMessage'
import useAuth from '../hooks/useAuth'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'

const MessageScreen = () => {
    const { user } = useAuth()
    const { params } = useRoute()
    const { matchedDetails } = params

    const [input, setInput] = useState("")
    const [message, setMessage] = useState([])


    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(db, 'mathes', matchedDetails.id, 'messages'),
                    orderBy("timestamp", "desc")
                )
            ),
            (snapshot) =>
                setMessage(
                    snapshot.doc.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                )
        , [matchedDetails, db])

    const sendMessage = () => {
        addDoc(collection(db, "matches", matchDetails.id, "messages"), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        });

        setInput("")
    }

    return (
        <SafeAreaView style={tw("flex-1")}>
            <Header
                title={getMatchedUserInfo(matchedDetails?.users, user.uid).displayName}
                callEnabled
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw("flex-1")}
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={message}
                        inverted={-1}
                        style={tw("pl-4")}
                        keyExtractor={item => item.id}
                        renderItem={({ item: message }) =>
                            message.userId === user.uid ? (
                                <SenderMessage key={message.id} message={message} />
                            ) : (
                                <ReceiverMessage key={message.id} message={message} />
                            )
                        }
                    />
                </TouchableWithoutFeedback>



                <View style={tw("flex-row justify-between items-center border-t border-gray-200 px-5 py-200")} >
                    <TextInput
                        style={tw("h-10 text-lg")}
                        placeholder="Send Message..."
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button onPress={sendMessage}
                        title="Send"
                        color="#FF5864"
                    />
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default MessageScreen
