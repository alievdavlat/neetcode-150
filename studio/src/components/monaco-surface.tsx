'use client';

import { useEffect, useRef } from 'react';
import Editor, { loader, type BeforeMount, type Monaco, type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TypeMarker } from '@/lib/types';

loader.config({ paths: { vs: '/monaco/vs' } });

interface MonacoSurfaceProps {
  path: string;
  value: string;
  markers: TypeMarker[];
  activeLine?: number | null;
  onLineClick?: (line: number) => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onRun: () => void;
}

export function MonacoSurface({
  path,
  value,
  markers,
  activeLine,
  onLineClick,
  onChange,
  onSave,
  onRun,
}: MonacoSurfaceProps) {
  const save = useRef(onSave);
  const run = useRef(onRun);
  const lineClick = useRef(onLineClick);
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const buffer = useRef(value);

  useEffect(() => {
    save.current = onSave;
    run.current = onRun;
    lineClick.current = onLineClick;
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

  /**
   * The doc block repeats the brief sitting beside it, so the editor opens on the
   * code and folds the header away. The file keeps it: the runner reads the
   * LeetCode and Video lines out of it, a practice copy carries it so promoting
   * back cannot lose it, and a regenerate writes it again. Folding ranges are
   * computed a beat after the model lands, so this asks more than once and gives
   * up quietly - a header left open is a small thing next to a thrown error.
   */
  const foldHeader = (instance: editor.IStandaloneCodeEditor) => {
    if (!instance.getModel()?.getLineContent(1).trimStart().startsWith('/**')) return () => {};

    const timers = [0, 120, 400].map((delay) =>
      window.setTimeout(() => {
        try {
          instance.trigger('brief', 'editor.fold', { selectionLines: [1] });
        } catch {
          /* the folding model is not ready, and the next attempt may find it */
        }
      }, delay),
    );

    return () => timers.forEach(window.clearTimeout);
  };

  useEffect(() => {
    const instance = editorRef.current;
    if (!instance) return;

    return foldHeader(instance);
    /** A new file is a new header to fold; typing in one is not. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const handleMount: OnMount = (instance, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = instance;
    buffer.current = instance.getValue();
    foldHeader(instance);
    instance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => save.current());
    instance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => run.current());

    /** Clicking the gutter jumps the replay to the next time that line runs. */
    const gutter = new Set([
      monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN,
      monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS,
      monaco.editor.MouseTargetType.GUTTER_LINE_DECORATIONS,
    ]);

    instance.onMouseDown((event) => {
      const line = event.target.position?.lineNumber;
      if (line && gutter.has(event.target.type)) lineClick.current?.(line);
    });

    instance.focus();
  };

  const handleChange = (next: string | undefined) => {
    buffer.current = next ?? '';
    onChange(buffer.current);
  };

  /**
   * The model owns the text while he types. Handing the prop back to `value`
   * would let @monaco-editor/react replace the whole document on any render
   * that arrives a keystroke late, which drops the caret at the end of the
   * file. Only changes made outside the editor are pushed in, and the caret
   * is carried through them.
   */
  useEffect(() => {
    const instance = editorRef.current;
    const model = instance?.getModel();
    if (!instance || !model || value === buffer.current) return;

    buffer.current = value;
    if (value === model.getValue()) return;

    const selections = instance.getSelections();
    model.pushStackElement();
    model.pushEditOperations(selections, [{ range: model.getFullModelRange(), text: value }], () => selections);
    model.pushStackElement();
  }, [value]);

  useEffect(() => {
    const monaco = monacoRef.current;
    const model = editorRef.current?.getModel();
    if (!monaco || !model) return;

    monaco.editor.setModelMarkers(
      model,
      'tsc',
      markers.map((marker) => ({
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: marker.line,
        startColumn: marker.column,
        endLineNumber: marker.line,
        endColumn: marker.column + 1,
        message: `${marker.code}: ${marker.message}`,
      })),
    );
  }, [markers, path]);

  /** The replayed step highlights its line in the file the student is reading. */
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    if (!decorationsRef.current) decorationsRef.current = editor.createDecorationsCollection();

    decorationsRef.current.set(
      activeLine
        ? [
            {
              range: new monaco.Range(activeLine, 1, activeLine, 1),
              options: { isWholeLine: true, className: 'trace-active-line' },
            },
          ]
        : [],
    );

    if (activeLine) editor.revealLineInCenterIfOutsideViewport(activeLine);
  }, [activeLine, path]);

  return (
    <Editor
      path={path}
      defaultValue={value}
      defaultLanguage="typescript"
      theme="neetcode-night"
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      onChange={handleChange}
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
