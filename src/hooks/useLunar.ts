import React from 'react'
import lunr from 'lunr';


export default function useLunar(documents: Array<any>, roots: any) {
    const idx = lunr(function () {
        this.ref('key');
        this.field('value');
        const values = Object.entries(documents).flatMap(contextEntry =>
            roots.map((lang: any) => Object.entries(contextEntry[1][lang]).map(e => {
                // console.log({
                //     key: contextEntry[0] + '|' + lang + '|' + e[0],
                //     value: e[1]
                // })
                console.log(e[1])
                this.add({
                    key: contextEntry[0] + '|' + lang + '|' + e[0],
                    value: e[1]
                })
            }))
        )
        console.log(values, roots)
        // documents.forEach((doc) => {
        //     this.add(doc);
        // });
    });
return idx
}
