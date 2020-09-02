const sourcePath = "./src/locales/ru-RU.json";
const destinationPath = "./src/store/LocaleDictionary.ts";
/* eslint-disable-next-line */
const fs = require("fs");
const data = fs.readFileSync(sourcePath, "utf8");
const obj = JSON.parse(data.replace(/^\uFEFF/, ""));
const arr = [
    "// Этот файл сгенерирован автоматически, его нельзя править вручную\r\n",
    "/** Названия доступных строковых ресурсов */",
    "export type LocaleDictionary = {"
];
for (const key in obj) {
    const val = obj[key];
    let type = typeof val;
    if (Array.isArray(val)) {
        type = val.length ? typeof val[0] + "[]" : "string[]";
    }
    arr.push(`    /** ${val} */`);
    arr.push(`    "${key}": ${type};`);
}
arr.push("};");
fs.writeFileSync(destinationPath, arr.join("\r\n"), "utf8");
