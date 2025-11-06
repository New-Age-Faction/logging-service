/**
 * Parses generic error object's stacks into their primary components.
 */

// - Imports ------------------------------------------------------------------

// - Types --------------------------------------------------------------------
export interface StackTraceRoot {
  method: string;
  file: string;
  line: number;
  column: number;
}

// - Classes ------------------------------------------------------------------
export const parseErrorStack = (stack?: string): StackTraceRoot | null => {
  if (!stack) return null;

  const lines = stack.split("\n").slice(1); // skip error message
  if (lines.length === 0) return null;

  // Match typical Node stack line: "at fn (/path/to/file.ts:12:34)"
  const match =
    lines[0].match(/\s*at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
    lines[0].match(/\s*at\s+(.*):(\d+):(\d+)/); // fallback without fn

  if (!match) return null;

  if (match.length === 5) {
    const [, method, file, line, column] = match;
    return { method, file, line: Number(line), column: Number(column) };
  } else if (match.length === 4) {
    const [, file, line, column] = match;
    return {
      method: "<anonymous>",
      file,
      line: Number(line),
      column: Number(column),
    };
  }

  return null;
};
