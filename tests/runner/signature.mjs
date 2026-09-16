const FUNCTION_STUB = /export function (\w+)\(([\s\S]*?)\):\s*([^{]+)\{/;
const CLASS_STUB = /export class (\w+)/;
const METHOD = /^\s{2}(\w+)\(([^)]*)\):\s*([^{]+)\{/gm;

/** Split a parameter list on the commas that are not inside a generic or array type. */
const splitParams = (source) =>
  source
    .split(/,(?![^<[]*[>\]])/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const colon = part.indexOf(':');
      return { name: part.slice(0, colon).trim(), type: part.slice(colon + 1).trim() };
    });

/**
 * Read the generated stub to learn what a problem's entry point looks like.
 * The stub is the only place the argument and return types are written down,
 * and they decide which shape adapter and which size generator apply.
 */
export function readSignature(stub) {
  const source = stub.trim();

  const asFunction = source.match(FUNCTION_STUB);
  if (asFunction) {
    const [, name, params, returns] = asFunction;
    return { kind: 'function', name, params: splitParams(params), returns: returns.trim() };
  }

  const asClass = source.match(CLASS_STUB);
  if (!asClass) return { kind: 'unknown' };

  const methods = [];
  let constructorParams = [];
  for (const match of source.matchAll(METHOD)) {
    const [, name, params, returns] = match;
    if (name === 'constructor') {
      constructorParams = splitParams(params);
      continue;
    }
    methods.push({ name, params: splitParams(params), returns: returns.trim() });
  }

  return { kind: 'class', name: asClass[1], constructorParams, methods };
}
