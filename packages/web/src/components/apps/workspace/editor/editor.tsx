import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { markdown } from '@codemirror/lang-markdown';
import useTheme from '@srcbook/components/src/components/use-theme';
import { useFiles } from '../../use-files';
import { AppType, FileType } from '@srcbook/shared';
import EditorHeader from './header';
import { extname } from '../../lib/path';

type PropsType = {
  app: AppType;
};

export function Editor(props: PropsType) {
  const { openedFile, updateFile } = useFiles();

  return (
    <div className="flex flex-col">
      <EditorHeader app={props.app} className="shrink-0 h-12 max-h-12" />
      <div className="p-3 w-full flex-1">
        {openedFile ? (
          <CodeEditor file={openedFile} onChange={updateFile} />
        ) : (
          <div className="h-full flex items-center justify-center text-tertiary-foreground">
            Use the file explorer to open a file for editing
          </div>
        )}
      </div>
    </div>
  );
}

function CodeEditor({
  file,
  onChange,
}: {
  file: FileType;
  onChange: (file: FileType, attrs: Partial<FileType>) => void;
}) {
  const { codeTheme } = useTheme();

  const languageExtension = getCodeMirrorLanguageExtension(file);
  const extensions = languageExtension ? [languageExtension] : [];

  return (
    <CodeMirror
      value={file.source}
      theme={codeTheme}
      extensions={extensions}
      onChange={(source) => onChange(file, { source })}
    />
  );
}

function getCodeMirrorLanguageExtension(file: FileType) {
  switch (extname(file.path)) {
    case '.json':
      return json();
    case '.css':
      return css();
    case '.html':
      return html();
    case '.md':
    case '.markdown':
      return markdown();
    case '.js':
    case '.cjs':
    case '.mjs':
    case '.jsx':
    case '.ts':
    case '.cts':
    case '.mts':
    case '.tsx':
      return javascript({ typescript: true, jsx: true });
  }
}
