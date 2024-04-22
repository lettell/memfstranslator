import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import git from 'isomorphic-git';


import { FsaNodeFs, FsaNodeSyncAdapterWorker } from 'memfs/lib/fsa-to-node';
import { fs } from 'memfs';
import http from 'isomorphic-git/http/web'
import { useTranslation } from 'react-i18next';
import GitBasedTabs from 'base/BaseTabs';
import BaseTable from 'base/BaseTable';
// @ts-ignore  
import TestingToolbar from 'tools/TestingToolbar';
import useLunar from 'hooks/useLunar';
import TranslateSearchBar from './components/TranslateSearchBar';
import { useRecoilValue } from 'recoil';
import { searchResultsState } from './states/searchState';
import { deepEqual } from 'utils/object';
import { Dropdown, Option, Toolbar, ToolbarButton, useId } from '@fluentui/react-components';

const SETTINGS = {
    defaultLocale: 'en',
    gitUrl: '/gitlab/paulius2072503/app-translations.git',
    gitWorkingBranch: 'main'
}

const TranslateScreen = () => {
    const { t } = useTranslation();
    const [defaultFolder, _] = useState<string>(SETTINGS.defaultLocale)
    const [files, setFiles] = useState<any>([]);
    const selectedLocaleId = useId('locales')
    const [selectedLocales, setSelectedLocales] = useState<string[] | undefined>([] as any)
    const [roots, setRoots] = useState<any>([])
    const [data, setData] = useState<any>({});
    const [originalData, setOriginalData] = useState<any>({});

    const idx = useLunar(data, roots)
    const [_orignalDefault, setOrignalDefault] = useState<any>({});
    const filteredRoots = useMemo(() => roots.filter((e: any) => e !== defaultFolder), [roots])
    const fsRef = useRef<FsaNodeFs>(fs as any);
    const initFsa = async () => {
        const dir = await (window as any).showDirectoryPicker({ id: 'demo', mode: 'readwrite' });
        const adapter = await FsaNodeSyncAdapterWorker.start(__HOST__ + '/worker.bundle.js', dir);
        fsRef.current = new FsaNodeFs(dir, adapter);
        initGitTranslations();
    }
    useEffect(() => {
        // TODO: after login
        pullTranslations();
    }, [])
    // method to pull translations from git git@github.com:lettell/demo.git
    // TODO: env by build versions
    // TODO: fix
    const pullTranslations = async () => {
        // const dir = await (window as any).showDirectoryPicker({ id: 'demo', mode: 'readwrite' });
        // const adapter = await FsaNodeSyncAdapterWorker.start('https://localhost:9876/worker.bundle.js', dir);

        // 
        try {
            await git.clone({
                fs,
                http,
                dir: '',
                url: __HOST__ + SETTINGS.gitUrl,
                ref: SETTINGS.gitWorkingBranch,
                singleBranch: true,
                onAuth: url => {
                    // let auth = lookupSavedPassword(url)
                    // if (auth) return auth
                    let auth = {}

                    if (confirm('This repo is password protected. Ready to enter a username & password?')) {
                        auth = {
                            username: prompt('Enter username'),
                            password: prompt('Enter password'),
                        }
                        return auth
                    } else {
                        return { cancel: true }
                    }
                },
                depth: 10
            });

        } catch (e) {
            console.log(e)
        } finally {
            initGitTranslations();
            const languages = fs.readdirSync('', { withFileTypes: true }) as Array<any>;
            const avialavleLocales = languages?.filter((e: any) => !e.name.startsWith('.') && e.isDirectory()).map(e => e.name) as Array<any>
            setRoots(avialavleLocales.sort((text1, text2) => {
                if (text1 === SETTINGS.defaultLocale) {
                    return -1
                } else {
                    return 0
                }
            }))
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
        setData(new Object(dataParsed));
        setOriginalData(JSON.parse(JSON.stringify(dataParsed)))
        setFiles(Object.keys(dataParsed));
        setOrignalDefault(orignalDefaultParsed);
    }
    // const handleInputChange = (file: any, locale: any, key: any, translatedValue: any) => {
    //     data[file][locale][key] = translatedValue;
    //     setData({ ...data });
    // }
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
    }
    const [isMatch, setIsMatch] = useState(true)
    const onValueChange = (key: any, locale: any, value: any, file: any) => {
        data[file][locale][key] = value;
        const newData = { ...data }
        setData(newData);
        checkIfMatch(newData)
    }
    const checkIfMatch = useCallback((newData: any) => {
        const isMatchNow = deepEqual(newData, originalData)
        if (isMatchNow !== isMatch) {
            console.warn('SETTING new for save')
            setIsMatch(isMatchNow)
        }
    }, [originalData, isMatch])
    const handleLocalesChange = (_e: any, data: any) => {
        console.log(data);
        setSelectedLocales(data.selectedOptions)
    }
    const fillteredRoots = useMemo(() => {
        return selectedLocales?.length ? roots.filter((e: string) => selectedLocales.includes(e) || e === SETTINGS.defaultLocale) : roots
    }, [roots, selectedLocales])
    return (
        // <SafeAreaView>
        // <StatusBar />
        <>
            <Toolbar>

                <View style={{ flexDirection: 'row' }}>
                    <TranslateSearchBar idx={idx} />
                    <Dropdown
                        aria-labelledby={selectedLocaleId}
                        multiselect={true}
                        selectedOptions={selectedLocales}
                        onOptionSelect={handleLocalesChange}
                        placeholder="Select an locales"
                    >
                        {roots.map((option: string) => (
                            <Option key={option} disabled={option === SETTINGS.defaultLocale}>
                                {option}
                            </Option>
                        ))}
                    </Dropdown>
                    {!isMatch && <ToolbarButton style={{ flex: 1, backgroundColor: 'green' }} onClick={handleSave}>
                        <Text style={{ fontSize: 24, color: 'red', alignItems: 'center' }}>SAVE TRNASLATIONS</Text>
                    </ToolbarButton>}

                </View>
            </Toolbar>

            <GitBasedTabs tabs={files} />
            {/* <TestingToolbar /> */}
            {/* <Text testID="App name text button" accessibilityLabel="App name label" >{t('common.demo')}</Text> */}
            {/* <Pressable onPress={initFsa}>
                This for local editing
                <Text style={{ fontSize: 24 }}>LOAD TRANSLATIONS</Text>
            </Pressable> */}

            {/* <th><Text>{Object.entries(_orignalDefault).map(e => JSON.stringify(e))}</th> */}
            {/* {Object.keys(data).map(e => <th>{e}</th>)} */}


            {/* FOLDERS */}
            {/* LOCALES */}

            {/* FLATTENED VALUES */}

            {
                // TODO: move to separate component
                // [key, object, object]
                Object.keys(data).map(key => {
                    return <BaseTable defaultLocale={SETTINGS.defaultLocale} key={key + 'table'} currentContext={key} onValueChange={(...arg) => onValueChange(...arg, key)} columns={[{ columnKey: 'key', label: 'CONTEXT !!!', columnType: 'System' }, ...fillteredRoots.map((root: string) => ({ columnKey: root, label: root, columnType: 'AdvanedField' }))]} items={Object.entries(data[key][defaultFolder]).map((e: any, i: any) => {
                        return [e[0], ...fillteredRoots.map((root: string) => ({ [root]: data[key][root][e[0]] }))]
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
            {/* TODO: context toolbar */}

        </>
        // </SafeAreaView>

    );
}

export default TranslateScreen