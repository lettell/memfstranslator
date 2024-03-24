import { StyleSheet, TextInput, Text, LayoutChangeEvent, View } from 'react-native';
import React, { useEffect, useState, useTransition } from 'react';

const InputAutoGrow = ({ text, setText }: { text: string, setText: (text: string) => void }) => {
    const [inputHeight, setInputHeight] = useState(0);
    const [inputWidth, setInputWidth] = useState(0);
    const [_, startTransition] = useTransition();
    const [virtualText, setVirtualText] = useState(text);
    const handleTextChange = (inputText: string) => {
        setVirtualText(inputText);
    };

    useEffect(() => {
        if (virtualText !== text) {
            setText(virtualText);
        }
    }, [virtualText])

    const onLayout = (event: LayoutChangeEvent) => {
        setInputHeight(event.nativeEvent.layout.height);
        setInputWidth(event.nativeEvent.layout.width);

        startTransition(() => {
        });

    };

    return (
        <View style={{ position: 'relative' }}>
                    <View onLayout={onLayout} style={{alignSelf: 'flex-start', backgroundColor: 'blue'}}>
                <Text style={[styles.input, {margin:0, marginRight: 13}]}>
                    {virtualText}
                </Text>
            </View>

            <TextInput
                style={[styles.input, { zIndex: 10, height: inputHeight, width: inputWidth }]}
                multiline
                scrollEnabled={true}
                value={text}
                onChangeText={handleTextChange}
                placeholder="Type something..."
                placeholderTextColor="#888"
                autoCapitalize="none"
                autoCorrect={false}
            />
    
            {/* */}


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    input: {
        margin: 10,
        paddingHorizontal: 0,
        paddingVertical: 4,
        minHeight: 40,
        backgroundColor: '#fff',
        overflow: 'hidden',
        minWidth: 200,
        borderColor: '#ccc',
        color: '#000',
        borderRadius: 5,
        includeFontPadding: true,
        lineHeight: 16 * 1.3,
        fontSize: 16,
    },
});

export default InputAutoGrow;

