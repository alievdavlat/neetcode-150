import path from 'node:path';
import ts from 'typescript';
import type { TypeMarker } from '@/lib/types';
import { resolveProblemFile, WORKSPACE_ROOT } from './workspace';

const MAX_MARKERS = 50;

/** The workspace tsconfig supplies the options; the file being checked is the root. */
function compilerOptions(): ts.CompilerOptions {
  const configFile = path.join(WORKSPACE_ROOT, 'tsconfig.json');
  const read = ts.readConfigFile(configFile, ts.sys.readFile);
  if (read.error) throw new Error(ts.flattenDiagnosticMessageText(read.error.messageText, ' '));

  return ts.parseJsonConfigFileContent(read.config, ts.sys, WORKSPACE_ROOT).options;
}

const markerFor = (source: ts.SourceFile, diagnostic: ts.Diagnostic): TypeMarker[] => {
  if (diagnostic.start === undefined) return [];
  const { line, character } = source.getLineAndCharacterOfPosition(diagnostic.start);

  return [
    {
      line: line + 1,
      column: character + 1,
      code: `TS${diagnostic.code}`,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
    },
  ];
};

/**
 * Every diagnostic the compiler reports for one problem file.
 *
 * Only the open file's markers ever reach the editor, so the program is rooted
 * at that file rather than at the whole workspace: compiling all 1104 problems
 * to report on one of them cost seconds on every save, and 1103 files of that
 * work was thrown away. Whatever the file imports still comes along, so the
 * shared node types are checked as before - verified against the old
 * whole-workspace compile, which reports the same diagnostics.
 *
 * The compiler only reads and types the source; it never runs it, so this
 * belongs in process rather than behind the bridge.
 */
export async function typecheckFile(file: string): Promise<TypeMarker[]> {
  const absolute = resolveProblemFile(file);
  const program = ts.createProgram({ rootNames: [absolute], options: compilerOptions() });
  const source = program.getSourceFile(absolute);
  if (!source) throw new Error(`could not read ${file}`);

  return [...program.getSyntacticDiagnostics(source), ...program.getSemanticDiagnostics(source)]
    .flatMap((diagnostic) => markerFor(source, diagnostic))
    .slice(0, MAX_MARKERS);
}
