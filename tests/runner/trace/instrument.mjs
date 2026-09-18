import ts from 'typescript';

/**
 * Instrument a solution by inserting text at AST positions. Nothing is emitted
 * or reprinted: every insertion is newline-free, so the instrumented copy has
 * the same lines as the file the student is looking at and a recorded line
 * number needs no mapping.
 *
 * The recorder is reached through `globalThis.__t`, which the worker sets
 * before importing the copy - that way no import has to be injected into a file
 * whose first line is a doc comment.
 *
 * Only the named functions' own bodies are instrumented. Callbacks passed to
 * built-ins run normally and produce no steps of their own, so a solution that
 * hands its work to `sort()` honestly has little to show. `functionNames`
 * instruments several at once - a problem whose exports only mean anything
 * together is traced across all of them - and every step says which one it is
 * in. The first name is the one being traced and must exist; the rest are
 * taken if they are declared functions and skipped if they are not.
 */
export function instrument(source, { functionName, functionNames }) {
  const file = ts.createSourceFile('solution.ts', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);

  const wanted = functionNames ?? [functionName];
  const declared = new Map(
    file.statements
      .filter((node) => ts.isFunctionDeclaration(node) && node.name)
      .map((node) => [node.name.text, node]),
  );
  if (!declared.has(wanted[0])) throw new Error(`no exported function named ${wanted[0]} in this file`);

  const meta = [];
  const edits = [];

  const context = {
    file,
    source,
    meta,
    edits,
    lineOf: (pos) => file.getLineAndCharacterOfPosition(pos).line + 1,
    textOf: (node) => source.slice(node.getStart(file), node.getEnd()),
    oneLine: (node) =>
      file.getLineAndCharacterOfPosition(node.getStart(file)).line ===
      file.getLineAndCharacterOfPosition(node.getEnd()).line,
    insert: (at, text, rank = 0) => {
      if (text.includes('\n')) throw new Error('an insertion may not contain a newline');
      edits.push({ at, text, rank, order: edits.length });
    },
  };

  for (const name of wanted) {
    const declaration = declared.get(name);
    if (!declaration) continue;

    context.fn = name;
    walk(context, declaration);
  }

  let code = source;
  const ordered = [...edits].sort((a, b) => b.at - a.at || b.rank - a.rank || a.order - b.order);
  for (const edit of ordered) code = code.slice(0, edit.at) + edit.text + code.slice(edit.at);

  return { code, meta };
}

/** `obj[nums[i]]` changes `obj`, not `nums`. */
function rootName(node) {
  let current = node;
  while (ts.isElementAccessExpression(current) || ts.isPropertyAccessExpression(current)) {
    current = current.expression;
  }
  return ts.isIdentifier(current) ? current.text : null;
}

const isAssignToken = (kind) =>
  kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;

/** The name an expression writes to. `total += 1` changes `total`, as `total = total + 1` would. */
const targetName = (expression) => {
  if (ts.isBinaryExpression(expression) && isAssignToken(expression.operatorToken.kind)) {
    return rootName(expression.left);
  }
  if (ts.isPostfixUnaryExpression(expression) || ts.isPrefixUnaryExpression(expression)) {
    return rootName(expression.operand);
  }
  if (ts.isCallExpression(expression) && ts.isPropertyAccessExpression(expression.expression)) {
    return rootName(expression.expression.expression);
  }
  return null;
};

function record(context, kind, node, extra = {}) {
  const id = context.meta.length;
  context.meta.push({
    id,
    kind,
    fn: context.fn ?? null,
    line: context.lineOf(node.getStart(context.file)),
    text: context.textOf(node),
    changed: null,
    leaves: [],
    ...extra,
  });
  return id;
}

const isLeaf = (node) =>
  ts.isIdentifier(node) || ts.isElementAccessExpression(node) || ts.isPropertyAccessExpression(node);

/**
 * `obj[k] = v` must not become `__t.l(id,0,obj[k]) = v` - that is a call on the
 * left of an assignment, which will not parse. Assignment targets are visited
 * for their element accesses but never wrapped as leaves.
 */
const isAssignment = (node) => ts.isBinaryExpression(node) && isAssignToken(node.operatorToken.kind);

/**
 * `nums.sort()` must not become `__t.l(id,0,nums.sort)()` - wrapping a callee
 * strips the receiver and the call loses its `this`.
 */
const isCallee = (node) => {
  const parent = node.parent;
  return (
    !!parent && (ts.isCallExpression(parent) || ts.isNewExpression(parent)) && parent.expression === node
  );
};

/** `freq[k]++` writes through its operand exactly as `freq[k] = freq[k] + 1` would. */
const isUpdate = (node) =>
  (ts.isPostfixUnaryExpression(node) || ts.isPrefixUnaryExpression(node)) &&
  (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken);

const isAssignTarget = (node) => {
  const parent = node.parent;
  if (!parent) return false;
  if (isAssignment(parent) && parent.left === node) return true;
  if (ts.isElementAccessExpression(parent) && parent.expression === node) return isAssignTarget(parent);
  return ts.isPostfixUnaryExpression(parent) || ts.isPrefixUnaryExpression(parent);
};

/**
 * A leaf is the outermost readable piece of an expression: `nums[i]` is a leaf,
 * the `i` inside it is not, or the substituted text would nest into itself. The
 * index is still wrapped separately, for `touched` rather than for the chain.
 */
function wrapLeaves(context, id, root) {
  const entry = context.meta[id];
  const base = root.getStart(context.file);

  const visit = (node, insideLeaf, insideTarget) => {
    if (ts.isFunctionExpression(node) || ts.isArrowFunction(node)) return;

    if (ts.isElementAccessExpression(node)) {
      const name = rootName(node.expression);
      const write = isAssignTarget(node);
      if (name && context.oneLine(node.argumentExpression)) {
        const from = JSON.stringify(context.textOf(node.argumentExpression));
        context.insert(
          node.argumentExpression.getStart(context.file),
          `globalThis.__t.x(${id},"${name}",`,
          3,
        );
        context.insert(node.argumentExpression.getEnd(), `,${write},${from})`, -3);
      }
    }

    if (!insideLeaf && !insideTarget && !isCallee(node) && isLeaf(node) && node !== root) {
      const index = entry.leaves.length;
      entry.leaves.push({ start: node.getStart(context.file) - base, end: node.getEnd() - base });
      context.insert(node.getStart(context.file), `globalThis.__t.l(${id},${index},`, 4);
      context.insert(node.getEnd(), ')', -4);
      node.forEachChild((child) => visit(child, true, false));
      return;
    }

    /** The left of an assignment is where a value lands, not a value to read. */
    if (isAssignment(node)) {
      visit(node.left, insideLeaf, true);
      visit(node.right, insideLeaf, insideTarget);
      return;
    }

    if (isUpdate(node)) {
      visit(node.operand, insideLeaf, true);
      return;
    }

    /** A member name is not a value; only the receiver is worth reading. */
    if (ts.isPropertyAccessExpression(node)) {
      visit(node.expression, insideLeaf, insideTarget);
      return;
    }

    node.forEachChild((child) => visit(child, insideLeaf, insideTarget));
  };

  if (isAssignment(root)) {
    visit(root.left, false, true);
    visit(root.right, false, false);
    return;
  }

  if (isUpdate(root)) {
    visit(root.operand, false, true);
    return;
  }

  root.forEachChild((child) => visit(child, false, false));
}

/**
 * Wrap a value-producing node, plus the leaves that make its substitution
 * readable. The live scope rides along as a third argument so a condition or a
 * return shows the same variable table a statement does - arguments evaluate
 * left to right, so the snapshot is taken after the expression itself.
 */
function wrapValue(context, id, node, live, name) {
  const tail = live ? `,{${live.join(',')}}${name ? `,"${name}"` : ''})` : ')';
  context.insert(node.getStart(context.file), `globalThis.__t.v(${id},`, 2);
  context.insert(node.getEnd(), tail, -2);
  wrapLeaves(context, id, node);
}

/**
 * `i++` reports the value it leaves behind, not the one it read - so the counter
 * is passed a second time and read after the update. A counter is only named
 * when it is a plain identifier: `freq[k]++` writes into an array, and naming
 * `freq` there would claim the whole array was the number that changed. The
 * expression is parenthesised so that `i++, j--` stays one argument.
 */
function wrapUpdate(context, id, node, counter, live) {
  const tail = live ? `,{${live.join(',')}})` : ')';
  context.insert(node.getStart(context.file), `globalThis.__t.u(${id},(`, 2);
  context.insert(node.getEnd(), `),${counter ?? 'undefined'}${tail}`, -2);
}

/** `i++` as a statement of its own, and as a `for` incrementor, are the same step. */
const counterName = (node) =>
  isUpdate(node) && ts.isIdentifier(node.operand) ? node.operand.text : null;

const counterMeta = (node) => ({
  op: node.operator === ts.SyntaxKind.MinusMinusToken ? '-' : '+',
  pre: ts.isPrefixUnaryExpression(node),
});

function walk(context, fn) {
  const scope = fn.parameters.filter((p) => ts.isIdentifier(p.name)).map((p) => p.name.text);
  walkBlock(context, fn.body, scope);
}

const bodyOf = (statement) => (ts.isBlock(statement) ? statement : { statements: [statement] });

/**
 * `for (const n of nums) count(n);` has no braces to put a marker inside, so a
 * trailing `__t.s(...)` would land after the loop and run once, out of scope.
 * An unbraced body carries its scope on the value call instead, which sits
 * inside the statement itself.
 */
const walkBody = (context, statement, live) =>
  walkBlock(context, bodyOf(statement), live, ts.isBlock(statement));

function walkBlock(context, block, inherited, braced = true) {
  let live = [...inherited];

  for (const statement of block.statements) {
    if (ts.isVariableStatement(statement)) {
      let last = null;

      for (const declaration of statement.declarationList.declarations) {
        const name = ts.isIdentifier(declaration.name) ? declaration.name.text : null;
        last = record(context, 'stmt', statement, { changed: name });

        if (declaration.initializer && context.oneLine(declaration.initializer)) {
          context.meta[last].text = context.textOf(declaration.initializer);
          wrapValue(context, last, declaration.initializer, live, name);
        }

        if (name) live = [...live, name];
      }

      if (braced && last !== null) {
        context.insert(statement.getEnd(), `;globalThis.__t.s(${last},{${live.join(',')}});`, 100);
      }
      continue;
    }

    if (ts.isExpressionStatement(statement)) {
      const expression = statement.expression;
      const counter = counterName(expression);
      const id = record(context, 'stmt', statement, {
        changed: targetName(expression),
        ...(counter ? counterMeta(expression) : { op: null }),
      });
      context.meta[id].text = context.textOf(expression);

      if (context.oneLine(expression)) {
        const carried = braced ? null : live;
        if (isUpdate(expression)) wrapUpdate(context, id, expression, counter, carried);
        else wrapValue(context, id, expression, carried);
      }

      if (braced) context.insert(statement.getEnd(), `;globalThis.__t.s(${id},{${live.join(',')}});`, 100);
      continue;
    }

    walkControl(context, statement, live);
  }
}

function walkControl(context, statement, live) {
  if (ts.isForStatement(statement)) {
    let inner = [...live];

    if (statement.initializer && ts.isVariableDeclarationList(statement.initializer)) {
      for (const declaration of statement.initializer.declarations) {
        const name = ts.isIdentifier(declaration.name) ? declaration.name.text : null;
        if (declaration.initializer && context.oneLine(declaration.initializer)) {
          const id = record(context, 'loop-init', declaration.initializer, { changed: name });
          wrapValue(context, id, declaration.initializer, inner, name);
        }
        if (name) inner = [...inner, name];
      }
    }

    if (statement.condition) {
      const id = record(context, 'loop-cond', statement.condition);
      wrapValue(context, id, statement.condition, inner);
    }

    if (statement.incrementor) {
      const counter = counterName(statement.incrementor);
      const id = record(context, 'loop-update', statement.incrementor, {
        changed: counter ?? targetName(statement.incrementor),
        ...(counter ? counterMeta(statement.incrementor) : { op: null }),
      });
      wrapUpdate(context, id, statement.incrementor, counter, inner);
    }

    walkBody(context, statement.statement, inner);
    return;
  }

  if (ts.isForOfStatement(statement)) {
    const declaration = statement.initializer.declarations?.[0];
    const bound = declaration && ts.isIdentifier(declaration.name) ? declaration.name.text : null;
    const id = record(context, 'loop-update', statement.expression, { changed: bound });
    if (bound) context.meta[id].text = `${bound} of ${context.textOf(statement.expression)}`;
    context.insert(statement.expression.getStart(context.file), `globalThis.__t.i(${id},`, 2);
    context.insert(
      statement.expression.getEnd(),
      `,() => ({${live.join(',')}})${bound ? `,"${bound}"` : ''})`,
      -2,
    );

    walkBody(context, statement.statement, bound ? [...live, bound] : live);
    return;
  }

  if (ts.isWhileStatement(statement) || ts.isDoStatement(statement)) {
    const id = record(context, 'loop-cond', statement.expression);
    wrapValue(context, id, statement.expression, live);
    walkBody(context, statement.statement, live);
    return;
  }

  if (ts.isIfStatement(statement)) {
    const id = record(context, 'cond', statement.expression);
    wrapValue(context, id, statement.expression, live);
    walkBody(context, statement.thenStatement, live);
    if (statement.elseStatement) walkBody(context, statement.elseStatement, live);
    return;
  }

  if (ts.isReturnStatement(statement) && statement.expression && context.oneLine(statement.expression)) {
    const id = record(context, 'return', statement.expression);
    wrapValue(context, id, statement.expression, live);
    return;
  }

  if (ts.isBlock(statement)) walkBlock(context, statement, live);
}
