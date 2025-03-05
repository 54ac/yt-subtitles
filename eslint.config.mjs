import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	tseslint.configs.stylistic,
	eslintConfigPrettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.webextensions
			},
			ecmaVersion: "latest",
			sourceType: "module"
		},

		rules: {
			"no-unused-vars": 1,
			"no-console": 1,
			"no-unused-expressions": [
				2,
				{
					allowShortCircuit: true,
					allowTernary: true
				}
			]
		}
	}
);
