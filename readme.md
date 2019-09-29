@ztwx/cm-zip
===
`compress` `uncompress`

---
API
---
- **zip compress**
```js
const {zip} =require("@ztwx/cm-zip");

zip("/xxx/inputDir","result.zip")
    .then(()=>...)
    .catch(()=>...)
```

- **zip uncompress**
```js
const {unzip}=require("@ztwx/cm-zip");
unzip("xx/input.zip","outputDir")
    .then(()=>...)
    .catch(()=>...)
```

- **zip progress**

```js
zip(INPUTDIR,OUTPUTZIP,filepath=>console.log(filepath))
unzip(INPUTZIP,OUTPUTDIR,filepath=>console.log(filepath))
```

cli
---
> Global install first
```
    npm install -g @ztwx/cm-zip
```

- To compress
```shell
cm-zip -c ${INPUT_DIR} ${OUTPUT_ZIP}
```

- To uncompress
```shell
cm-zip -x ${INPUT_ZIP} ${OUTPUT_DIR}
```