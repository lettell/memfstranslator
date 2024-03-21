import { StyleSheet, TextInput, Text, LayoutChangeEvent } from 'react-native';
import React, { useState, useTransition } from 'react';

const InputAutoGrow = ({text, setText}: {text: string,setText: (text: string) => void}) => {
    const [inputHeight, setInputHeight] = useState(0);
    const [inputWidth, setInputWidth] = useState(0);
    const [_, startTransition] = useTransition();

    const handleTextChange = (inputText: string) => {
        setText(inputText);
    };


    const onLayout = (event: LayoutChangeEvent) => {
        startTransition(() => {
            setInputHeight(event.nativeEvent.layout.height);
            setInputWidth(event.nativeEvent.layout.width);
        });

    };

    return (
        <>

            <TextInput
                style={[styles.input, { height: inputHeight, width: inputWidth }]}
                multiline
                scrollEnabled={false}
                value={text}
                onChangeText={handleTextChange}
                placeholder="Type something..."
                placeholderTextColor="#888"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <Text onLayout={onLayout} style={[styles.input, { zIndex: -1, color: 'transparent', position: 'absolute' }]}>
                {text}
            </Text>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    input: {
        minHeight: 42,
        overflow: 'hidden',
        minWidth: 200,
        alignSelf: 'flex-start',
        borderColor: '#ccc',
        borderRadius: 5,
        includeFontPadding: false,
        lineHeight: 22,
        fontSize: 16,
    },
});

export default InputAutoGrow;

