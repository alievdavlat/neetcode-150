'use client';

import { useEffect, useRef } from 'react';
import Editor, { loader, type BeforeMount, type OnMount } from '@monaco-editor/react';

loader.config({ paths: { vs: '/monaco/vs' } });

interface MonacoSurfaceProps {
  path: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onRun: () => void;
}

export function MonacoSurface({ path, value, onChange, onSave, onRun }: MonacoSurfaceProps) {
  const save = useRef(onSave);
  const run = useRef(onRun);

  useEffect(() => {
    save.current = onSave;
    run.current = onRun;
  });

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('neetcode-night', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '59627d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff5fa2' },
        { token: 'string', foreground: 'c6f24e' },
        { token: 'number', foreground: '5ce1ff' },
        { token: 'type', foreground: '5ce1ff' },
        { token: 'type.identifier', foreground: '5ce1ff' },
        { token: 'delimiter', foreground: '8b93ad' },
        { token: 'identifier', foreground: 'e7eaf3' },
      ],
      colors: {
        'editor.background': '#0b0e19',
        'editorGutter.background': '#0b0e19',
        'editor.lineHighlightBackground': '#11162a',
        'editor.selectionBackground': '#24304f',
        'editorLineNumber.foreground': '#333c58',
        'editorLineNumber.activeForeground': '#c6f24e',
        'editorCursor.foreground': '#c6f24e',
        'editorIndentGuide.background1': '#1a2038',
        'editorIndentGuide.activeBackground1': '#2c3450',
        'editorWidget.background': '#12162a',
        'scrollbarSlider.background': '#ffffff14',
        'scrollbarSlider.hoverBackground': '#ffffff22',
      },
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      allowNonTsExtensions: true,
      strict: true,
    });
  };

  const handleMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => save.current());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => run.current());
    editor.focus();
  };

  return (
    <Editor
      path={path}
      value={value}
      defaultLanguage="typescript"
      theme="neetcode-night"
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      onChange={(next) => onChange(next ?? '')}
      loading={<span className="text-xs text-muted-foreground">loading editor…</span>}
      options={{
        fontFamily: 'var(--font-code), ui-monospace, monospace',
        fontSize: 13.5,
        lineHeight: 22,
        fontLigatures: true,
        minimap: { enabled: false },
        padding: { top: 18, bottom: 32 },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        renderLineHighlight: 'all',
        tabSize: 2,
        automaticLayout: true,
        stickyScroll: { enabled: false },
        overviewRulerBorder: false,
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        guides: { indentation: true },
      }}
    />
  );
}
