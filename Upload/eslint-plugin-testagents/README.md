# eslint-plugin-testagents

Rules for testing presents of malicious code

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-testagents`:

```
$ npm install eslint-plugin-testagents --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-testagents` globally.

## Usage

Add `testagents` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "testagents"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "testagents/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





