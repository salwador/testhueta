#include <napi.h>
#include <string>
#include <vector>
#include <unordered_map>
#include <numeric>
#include <algorithm>
#include <sstream>
#include <iostream>
#include <chrono>

////////////////////////////////

struct EscapedString {
    std::string text = "";
    size_t length = 0;    
};

struct BuildedQuery {
    std::string text = "";
    size_t length = 0;
};

////////////////////////////////

// Таблица для преобразования символов в их HEX представление для "esc"
static const char hexMap[17] = "0123456789ABCDEF";

// Преобразование буковок
EscapedString esc(const std::string& param) {
    EscapedString result;
    result.text.reserve(param.length() * 2); 
    
    for (unsigned char c : param) {
        if (c == ' ') {
            result.text.push_back('+');
            result.length += 1;
        } else if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
            result.text.push_back(c);
            result.length += 1;
        } else {
            result.text.push_back('%'); 
            result.text.push_back(hexMap[c >> 4]);  // Высшая часть байта
            result.text.push_back(hexMap[c & 0x0F]);  // Младшая часть байта
            result.length += 3;
        }
    }

    return result;
}

// Проверка является ли строка числом
bool isNumeric(const std::string_view& str) {
    char* endptr = nullptr;
    const char* c_str = str.data();
    std::strtol(c_str, &endptr, 10);  // Попытка преобразования строки в число
    return endptr != c_str && *endptr == '\0';  // Проверка завершения строки
}

// Обработка вложенных объектов и массивов
BuildedQuery httpBuildQuery(const Napi::Value& queryData, const std::string& numericPrefix = "", const std::string& argSeparator = "&", const std::string& tempKey = "", const size_t separatorSize = 0) {
    BuildedQuery query;

    if (queryData.IsObject()) {
        Napi::Object obj = queryData.As<Napi::Object>();
        Napi::Array keys = obj.GetPropertyNames();
        size_t keysLength = keys.Length();
        bool isFirst = true;

        // Обрабатываем каждый ключ объекта
        for (size_t i = 0; i < keysLength; i++) {
            std::string key = keys.Get(i).ToString().Utf8Value();
            Napi::Value value = obj.Get(key);
            std::string fullKey = tempKey.empty() ? key : tempKey + "[" + key + "]";  // Формирование полного ключа

            // Получаем тип значения, используя метод Type()
            napi_valuetype valueType = value.Type();

            // Если значение — вложенный объект, то рекурсия
            if (valueType == napi_object) {
                BuildedQuery buildResult = httpBuildQuery(value, numericPrefix, argSeparator, fullKey, separatorSize);

                if (isFirst) {
                    query.length =+ buildResult.length;
                    query.text.reserve(query.length);
                    isFirst = false;
                } else {
                    query.length =+ buildResult.length + 1;
                    query.text.reserve(query.length);
                    query.text.append(argSeparator);
                }

                query.text.append(buildResult.text);

            } else {
                // Если передан префикс и ключ является числом
                if (!numericPrefix.empty() && isNumeric(key)) {
                    fullKey = numericPrefix + key;
                }

                // Преобразование значения к строке
                std::string val;

                switch (valueType) {
                    case napi_boolean:
                        val = value.As<Napi::Boolean>().Value() ? "1" : "0";
                        break;
                    case napi_number:
                        val = value.ToString();
                        break;
                    case napi_string:
                        val = value.ToString().Utf8Value();
                        break;
                    default:
                        val = "";
                        break;
                }

                // Escaping ключа и значения
                EscapedString encodedKey = esc(fullKey);
                EscapedString encodedValue = esc(val);
                
                if (isFirst) {
                    query.length =+ encodedKey.length + 1 + encodedValue.length;
                    query.text.reserve(query.length);
                    isFirst = false;
                } else {
                    query.length =+ 1 + encodedKey.length + 1 + encodedValue.length;
                    query.text.reserve(query.length);
                    query.text.append(argSeparator);
                }

                query.text.append(encodedKey.text);
                query.text.append("=");
                query.text.append(encodedValue.text);
            }
        }
    }

    return query;
}

// Обёртка для вызова httpBuildQuery из Node.JS
Napi::String HttpBuildQueryWrapper(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    size_t infoLength = info.Length();

    // Проверка, что первый аргумент — объект
    if (infoLength < 1 || !info[0].IsObject()) {
        Napi::TypeError::New(env, "Expected an object").ThrowAsJavaScriptException();
        return Napi::String::New(env, "");
    }

    // Получаем аргументы
    Napi::Value queryData = info[0];
    std::string numericPrefix = (infoLength > 1 && info[1].IsString()) ? info[1].As<Napi::String>().Utf8Value() : "";
    std::string argSeparator = (infoLength > 2 && info[2].IsString()) ? info[2].As<Napi::String>().Utf8Value() : "&";
    std::string tempKey = (infoLength > 3 && info[3].IsString()) ? info[3].As<Napi::String>().Utf8Value() : "";

    // Строим строку запроса
    BuildedQuery query = httpBuildQuery(queryData, numericPrefix, argSeparator, tempKey, argSeparator.size());

    // Возвращаем строку в JavaScript
    return Napi::String::New(env, query.text);
}

// Инициализация модуля
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "httpBuildQuery"), Napi::Function::New(env, HttpBuildQueryWrapper));
    return exports;
}

// Регистрация модуля в Node.JS
NODE_API_MODULE(main, Init)
