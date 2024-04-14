import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import git from 'isomorphic-git';


import { FsaNodeFs, FsaNodeSyncAdapterWorker } from 'memfs/lib/fsa-to-node';
import { fs } from 'memfs';
import http from 'isomorphic-git/http/web'
import { useTranslation } from 'react-i18next';
import GitBasedTabs from 'base/BaseTabs';
import BaseTable from 'base/BaseTable';
// @ts-ignore  
import TestingToolbar from 'tools/TestingToolbar';


const TranslateScreen = () => {
    const { t } = useTranslation();
    const [defaultFolder, _] = useState<string>('lt')
    const [files, setFiles] = useState<any>([]);
    const [roots, setRoots] = useState<any>([])
    const [data, setData] = useState<any>({});
    const [_orignalDefault, setOrignalDefault] = useState<any>({});
    const filteredRoots = useMemo(() => roots.filter((e: any) => e !== defaultFolder), [roots])
    const fsRef = useRef<FsaNodeFs>(fs as any);
    const initFsa = async () => {
        const dir = await (window as any).showDirectoryPicker({ id: 'demo', mode: 'readwrite' });
        const adapter = await FsaNodeSyncAdapterWorker.start('https://localhost:9876/worker.bundle.js', dir);
        fsRef.current = new FsaNodeFs(dir, adapter);
        initGitTranslations();
    }
    useEffect(() => {
        // TODO: after login
        pullTranslations();
    }, [])
    // method to pull translations from git git@github.com:lettell/demo.git
    // TODO: env by build versions
    const pullTranslations = async () => {
        // const dir = await (window as any).showDirectoryPicker({ id: 'demo', mode: 'readwrite' });
        // const adapter = await FsaNodeSyncAdapterWorker.start('https://localhost:9876/worker.bundle.js', dir);
        try {
            await git.clone({
                fs,
                http,
                dir: '',
                url: 'https://localhost:9876/lettell/demo.git',
                ref: 'main',
                singleBranch: true,
                depth: 10
            });

        } catch (e) {
            console.log(e)
        } finally {
            initGitTranslations();
            const languages = fs.readdirSync('', { withFileTypes: true }) as Array<any>;
            setRoots(languages?.filter((e: any) => !e.name.startsWith('.') && e.isDirectory()).map(e => e.name) as Array<any>)
        }
    }
    useEffect(() => {
        if (roots.length > 0) {
            initApp();

        }

    }, [roots]);

    const initGitTranslations = async () => {
        const languages = fsRef.current?.readdirSync('', { withFileTypes: true }) as Array<any>;
        console.log(languages)
        setRoots(languages?.filter((e: any) => e.isDirectory()).map(e => e.name) as Array<any>)
    }
    //flattened json object keys retunr flattened key and value
    const flattenJSON = (obj: any = {}, res: any = {}, extraKey = '') => {
        for (let key in obj) {
            if (typeof obj[key] !== 'object') {
                res[extraKey + key] = obj[key];
            } else {
                flattenJSON(obj[key], res, `${extraKey}${key}.`);
            };
        };
        return res;
    };


    const initApp = async () => {
        const dataParsed: any = {};
        const orignalDefaultParsed: any = {};
        const defaultFiles = await fsRef.current?.readdirSync(defaultFolder, { withFileTypes: true }) as Array<any>;

        for (const file of defaultFiles) {
            if (file.isFile() && file.name.endsWith('.json')) {
                const defaulContent = await fsRef.current?.readFileSync(`${defaultFolder}/${file.name}`, 'utf-8');
                const otherContent = await Promise.all(filteredRoots.map(async (root: string) => {
                    const existFile = await fsRef.current?.existsSync(`${root}/${file.name}`);
                    if (!existFile) {
                        await fsRef.current?.promises.writeFile(`${root}/${file.name}`, '{}', { encoding: 'utf-8' });
                    }
                    return await fsRef.current?.readFileSync(`${root}/${file.name}`, 'utf-8');
                }));
                if (typeof defaulContent === 'string') {
                    const defaultJson = JSON.parse(defaulContent);
                    const flattenedKeys = flattenJSON(defaultJson);
                    if (!dataParsed[file.name]) {
                        dataParsed[file.name] = {};
                    }
                    if (!orignalDefaultParsed[file.name]) {
                        orignalDefaultParsed[file.name] = defaultJson;
                    }
                    const otherFlattenedKeys = otherContent.map((content: any) => {
                        if (typeof content === 'string') {
                            const json = JSON.parse(content);
                            return flattenJSON(json);
                        }
                    });
                    dataParsed[file.name][defaultFolder] = flattenedKeys;
                    for (let i = 0; i < filteredRoots.length; i++) {
                        if (!dataParsed[file.name][filteredRoots[i]]) {
                            dataParsed[file.name][filteredRoots[i]] = otherFlattenedKeys[i];
                        }
                    }
                }
            }
        }
        setData(dataParsed);
        setFiles(Object.keys(dataParsed));
        setOrignalDefault(orignalDefaultParsed);
    }
    const handleInputChange = (file: any, locale: any, key: any, translatedValue: any) => {
        data[file][locale][key] = translatedValue;
        setData({ ...data });
    }
    const handleSave = async () => {
        for (const file in data) {
            for (const locale in data[file]) {
                const content = data[file][locale];
                const json: any = {};
                for (const key in content) {
                    const keys = key.split('.');
                    let temp = json;
                    for (let i = 0; i < keys.length; i++) {
                        if (i === keys.length - 1) {
                            temp[keys[i]] = content[key];
                        } else {
                            if (!temp[keys[i]]) {
                                temp[keys[i]] = {};
                            }
                            temp = temp[keys[i]];
                        }
                    }
                }
                await fsRef.current?.promises.writeFile(`${locale}/${file}`, JSON.stringify(json), { encoding: 'utf-8' });
            }
        }
        git.add({ fs, dir: '', filepath: '.' });
        let sha = await git.commit({
            fs,
            dir: '',
            author: { name: 'Paulius Jarosius', email: 'jarosius@gmail.com' },
            message: 'Nice commit message',
        });
        let pushResult = await git.push({
            fs,
            http,
            dir: '',
            remote: 'origin',
            ref: 'main',
            onAuth: () => ({ username: process.env.GITHUB_TOKEN }),
        })
        console.log(pushResult, sha)
    }
    console.log(data)

    const onValueCuange = (key: any, locale: any, value: any, file: any) => {
        data[file][locale][key] = value;
        setData({ ...data });
    }

    return (
        // <SafeAreaView>
        // <StatusBar />
        <>
            <GitBasedTabs tabs={files} />
            <TestingToolbar />
            <Text testID="App name text button" accessibilityLabel="App name label" >{t('common.demo')}</Text>
            <Pressable onPress={initFsa}>
                <Text style={{ fontSize: 24 }}>LOAD TRANSLATIONS</Text>
            </Pressable>
            <Pressable onPress={handleSave}>
                <Text style={{ fontSize: 24 }}>SAVE TRNASLATIONS</Text>
            </Pressable>
            {/* <th><Text>{Object.entries(_orignalDefault).map(e => JSON.stringify(e))}</th> */}
            {/* {Object.keys(data).map(e => <th>{e}</th>)} */}


            {/* FOLDERS */}
            {/* LOCALES */}

            {/* FLATTENED VALUES */}

            {
                // TODO: move to separate component
                // [key, object, object]
                Object.keys(data).map(key => {

                    return <BaseTable onValueChange={(...arg) => onValueCuange(...arg, key)} columns={[{ columnKey: 'key', label: 'KEY', columnType: 'System' }, ...roots.map((root: string) => ({ columnKey: root, label: root, columnType: 'AdvanedField' }))]} items={Object.entries(data[key][defaultFolder]).map((e: any, i: any) => {
                        return [e[0], ...roots.map((root: string) => ({ [root]: data[key][root][e[0]] }))]
                    })} loader={false} />
                })


                //   Object.keys(data).map(key => {
                //   return <View>
                //     <View style={{ flexDirection: 'row' }}>
                //       <Text>KEY</Text>
                //       {Object.keys(data).map(key => Object.keys(data[key]).map(locale => <View><Text>{locale}</Text></View>))}
                //     </View>
                //     {Object.entries(data[key][defaultFolder]).map((e: any, i: any) => {
                //       return <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row' }}>
                //         {/* KEY */}
                //         <View>
                //           <Text key={i}>{e[0]}</Text>
                //         </View>
                //         {/* 
                //         {/* DEFAULT VALUE */}
                //         <View>
                //           <InputAutoGrow setText={(translatedValue) => handleInputChange(key, defaultFolder, e[0], translatedValue)} text={e[1]} />
                //           {/* <label key={i} className="input-sizer stacked" data-value={e[1]} >
                //             <textarea rows={1} onChange={(event) => {
                //               const a: any = event.target.parentNode
                //               a.dataset.value = event.target.value
                //               handleInputChange(key, defaultFolder, e[0], event.target.value)
                //             }} value={e[1]} />
                //           </label> */}
                //           {/* <TextInput multiline={true} onChangeText={(translatedValue) => handleInputChange(key, defaultFolder, e[0], translatedValue)} value={e[1} /> */}
                //         </View>
                //         {/* TRANSLATIONS */}
                //         {filteredRoots.map((root: string, i: any) => {
                //           return <View key={i}><InputAutoGrow setText={(translatedValue) => handleInputChange(key, root, e[0], translatedValue)} text={data[key][root][e[0]]} /></View>
                //           // return <label className="input-sizer stacked" data-value={data[key][root][e[0]]} >
                //           //   <textarea rows={1} onChange={(event) => {
                //           //     const a: any = event.target.parentNode
                //           //     a.dataset.value = event.target.value
                //           //     handleInputChange(key, root, e[0], event.target.value)
                //           //   }} value={data[key][root][e[0]] || 'EMPTY!!'} key={i} />
                //           // </label>
                //         })}
                //       </ScrollView>
                //     }

                //     )}

                //   </View>
                // })
            }
        </>
        // </SafeAreaView>

    );
}

export default TranslateScreen