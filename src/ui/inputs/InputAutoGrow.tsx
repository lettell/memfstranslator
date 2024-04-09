import { StyleSheet, TextInput, Text, LayoutChangeEvent, View } from 'react-native';
import React, { useEffect, useState, useTransition } from 'react';

const InputAutoGrow = ({ text, setText }: { text: any, setText?: (text: string) => void }) => {
    const inputRef = React.useRef<TextInput>(null);
    const [inputHeight, setInputHeight] = useState(0);
    const [inputWidth, setInputWidth] = useState(0);
    const [_, startTransition] = useTransition();
    const [virtualText, setVirtualText] = useState(text);
    const handleTextChange = (inputText: string) => {
        setVirtualText(inputText);
    };

    useEffect(() => {
        if (virtualText !== text && setText) {
            setText(virtualText);
        }
    }, [virtualText])

    const onLayout = (event: LayoutChangeEvent) => {
        setInputHeight(event.nativeEvent.layout.height);
        setInputWidth(event.nativeEvent.layout.width);

        startTransition(() => {
        });

    };
    return <label className="input-sizer stacked" data-value={text} >
        <textarea rows={1} onChange={(event) => {
            const a: any = event.target.parentNode
            a.dataset.value = event.target.value
            handleTextChange(event.target.value)
        }} value={text} />
    </label>
    return (
        <View style={{ position: 'relative' }}>
            <View onLayout={onLayout} style={{ alignSelf: 'flex-start', backgroundColor: 'blue' }}>
                <Text style={[styles.input, { margin: 0, marginRight: 13 }]}>
                    {virtualText}
                </Text>
            </View>

            <TextInput
                style={[styles.input, { top: 0, left: 0, margin: 0, position: 'absolute', zIndex: 10, height: inputHeight, width: inputWidth }]}
                multiline
                ref={inputRef}
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

