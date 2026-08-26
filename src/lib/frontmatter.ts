/** Minimal YAML-ish frontmatter parser for blog markdown files. */

export type RawFrontmatter = Record<string, string | boolean | string[]>;

export function parseFrontmatter(raw: string): { data: RawFrontmatter; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) {
    throw new Error("Markdown is missing opening frontmatter fence");
  }

  const afterOpen = trimmed.slice(3);
  const close = afterOpen.match(/\r?\n---\r?\n/);
  if (!close || close.index === undefined) {
    throw new Error("Markdown is missing closing frontmatter fence");
  }

  const yaml = afterOpen.slice(0, close.index).replace(/^\r?\n/, "");
  const body = afterOpen.slice(close.index + close[0].length);
  return { data: parseYamlBlock(yaml), body: body.replace(/^\r?\n/, "") };
}

function parseYamlBlock(yaml: string): RawFrontmatter {
  const data: RawFrontmatter = {};
  const lines = yaml.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    if (line.trim() === "" || line.trimStart().startsWith("#")) {
      i += 1;
      continue;
    }

    const match = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!match) {
      throw new Error(`Invalid frontmatter line: ${line}`);
    }

    const key = match[1]!;
    const rest = match[2]!;

    if (rest === "" || rest === "|" || rest === ">") {
      const items: string[] = [];
      i += 1;
      while (i < lines.length) {
        const next = lines[i]!;
        const item = next.match(/^\s+-\s+(.*)$/);
        if (!item) break;
        items.push(unquote(item[1]!.trim()));
        i += 1;
      }
      data[key] = items;
      continue;
    }

    data[key] = coerceScalar(rest.trim());
    i += 1;
  }

  return data;
}

function coerceScalar(value: string): string | boolean | string[] {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => unquote(item.trim()))
      .filter((item) => item.length > 0);
  }
  return unquote(value);
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
    (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
  ) {
    return value.slice(1, -1);
  }
  return value;
}
