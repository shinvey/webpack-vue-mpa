// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/recommended', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        /**
         * 引用webpack.base.conf.js导致编译进程无法退出
         * 初步断定造成了循环引用，但没有debug验证过
         * webpack.resolver.js独立出来不经可以满足eslint配置需求，同时也可以满足webStorm读取webpack config配置需求
         */
        config: 'build/webpack.resolver.js'
      }
    }
  },
  'globals': {
    'document': true,
    'window': true
  },
  // add your custom rules here
  rules: {
    'no-restricted-syntax': 0,
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      // vue: 'never'
    }],
    'import/no-unresolved': [0, {commonjs: true, amd: true}],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['warn', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.return value
      ]
    }],
    'no-console': 'off',
    'comma-dangle': ['off', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'no-underscore-dangle': ['off', { 'allowAfterThis': true }],
    'no-unused-expressions': ['error', {
      'allowShortCircuit': true,
      "allowTernary": true
    }],
    'one-var': ['off', 'consecutive'],
    'no-continue': ['warn'],
    'no-plusplus': ['off'],
    'import/prefer-default-export': ['off'],
    'max-len': ['warn'],
    'linebreak-style': ["off"],
    "no-mixed-operators": [
      "error",
      {
        "groups": [
          // ["+", "-", "*", "/", "%", "**"],
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          // ["&&", "||"],
          ["in", "instanceof"]
        ],
        "allowSamePrecedence": false
      }
    ],
    'vue/require-v-for-key': ["warn"],
    // 'quote-props': ["error", "as-needed"],
    'vue/html-self-closing': ["error", {
      "html": {
        "void": "never",
        "normal": "any",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }]
  }
};
