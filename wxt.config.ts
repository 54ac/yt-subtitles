import { defineConfig } from "wxt";
import eslint from "@nabla/vite-plugin-eslint";
import stylelint from "vite-plugin-stylelint";

export default defineConfig({
	extensionApi: "chrome",
	manifest: ({ browser }) => {
		return {
			name: "Better YouTube Subtitles",
			description: "__MSG_extText__",
			default_locale: "en",
			commands: {
				optionsOpen: {
					description: "__MSG_commandOptionsOpen__"
				},
				fontSizeToggle: {
					description: "__MSG_commandFontSizeToggle__"
				},
				fontSizeUp: {
					description: "__MSG_commandFontSizeUp__"
				},
				fontSizeDown: {
					description: "__MSG_commandFontSizeDown__"
				},
				fontOpacityToggle: {
					description: "__MSG_commandFontOpacityToggle__"
				},
				fontOpacityUp: {
					description: "__MSG_commandFontOpacityUp__"
				},
				fontOpacityDown: {
					description: "__MSG_commandFontOpacityDown__"
				},
				backgroundColorOpacityToggle: {
					description: "__MSG_commandBackgroundColorOpacityToggle__"
				}
			},
			permissions:
				browser === "firefox"
					? ["storage", "tabs"]
					: ["storage", "tabs", "fontSettings"]
		};
	},
	vite: () => ({ plugins: [eslint(), stylelint()] })
});
