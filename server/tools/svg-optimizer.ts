export type SvgOptimizeOptions = {
  removeMetadata: boolean;
  simplifyPaths: boolean;
  roundDecimals: boolean;
  prettify: boolean;
  precision: number;
};

export type SvgOptimizeResult = {
  optimizedSvg: string;
  reactComponent: string;
  originalBytes: number;
  optimizedBytes: number;
  savingsPercent: number;
};

function roundDecimalToken(token: string, precision: number) {
  const numeric = Number(token);

  if (!Number.isFinite(numeric)) {
    return token;
  }

  const normalized = Number(numeric.toFixed(precision));
  if (Object.is(normalized, -0)) {
    return "0";
  }

  let output = normalized.toString();
  output = output.replace(/^0\./, ".");
  output = output.replace(/^-0\./, "-.");
  return output;
}

function roundSvgDecimals(svg: string, precision: number) {
  return svg.replace(/-?\d+\.\d+(?:e[-+]?\d+)?/gi, (match) =>
    roundDecimalToken(match, precision),
  );
}

function simplifyPathValue(pathValue: string, options: SvgOptimizeOptions) {
  let output = pathValue.replace(/,/g, " ").replace(/\s+/g, " ").trim();

  if (options.roundDecimals) {
    output = output.replace(/-?\d+\.\d+(?:e[-+]?\d+)?/gi, (match) =>
      roundDecimalToken(match, options.precision),
    );
  }

  output = output
    .replace(/\s*([AaCcHhLlMmQqSsTtVvZz])\s*/g, "$1")
    .replace(/(\d)-/g, "$1 -")
    .replace(/\s+/g, " ")
    .trim();

  return output;
}

function simplifyPathData(svg: string, options: SvgOptimizeOptions) {
  return svg.replace(/\sd=(['"])([\s\S]*?)\1/g, (_, quote: string, value: string) => {
    const simplified = simplifyPathValue(value, options);
    return ` d=${quote}${simplified}${quote}`;
  });
}

function removeMetadataBlocks(svg: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!doctype[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<desc[\s\S]*?<\/desc>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/\s+(?:inkscape|sodipodi):[a-z-]+="[^"]*"/gi, "");
}

function minifySvg(svg: string) {
  return svg
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\r?\n/g, "")
    .trim();
}

function prettyPrintSvg(svg: string) {
  const compact = minifySvg(svg);
  const tokens = compact.split(/(<[^>]+>)/g).filter(Boolean);
  const lines: string[] = [];
  let indent = 0;

  for (const token of tokens) {
    const value = token.trim();
    if (!value) continue;

    const isTag = value.startsWith("<") && value.endsWith(">");
    const isClosingTag = /^<\//.test(value);
    const isCommentOrMeta = /^<!|^<\?/.test(value);
    const isSelfClosing = /\/>$/.test(value);

    if (isClosingTag) {
      indent = Math.max(indent - 1, 0);
    }

    lines.push(`${"  ".repeat(indent)}${value}`);

    if (isTag && !isClosingTag && !isSelfClosing && !isCommentOrMeta) {
      indent += 1;
    }
  }

  return lines.join("\n");
}

function escapeTemplateLiteral(input: string) {
  return input.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function toReactComponent(svg: string) {
  const escaped = escapeTemplateLiteral(svg);
  return `import * as React from "react";

const svgMarkup = \`${escaped}\`;

export function OptimizedSvg(props: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} dangerouslySetInnerHTML={{ __html: svgMarkup }} />;
}
`;
}

function calculateSavings(originalBytes: number, optimizedBytes: number) {
  if (originalBytes <= 0) return 0;

  const ratio = ((originalBytes - optimizedBytes) / originalBytes) * 100;
  return Math.max(0, Math.round(ratio));
}

export function optimizeSvg(svg: string, options: SvgOptimizeOptions): SvgOptimizeResult {
  const normalizedInput = svg.replace(/^\uFEFF/, "").trim();

  if (!/<svg[\s>]/i.test(normalizedInput)) {
    throw new Error("Input must contain a valid <svg> element");
  }

  let output = normalizedInput;

  if (options.removeMetadata) {
    output = removeMetadataBlocks(output);
  }

  if (options.simplifyPaths) {
    output = simplifyPathData(output, options);
  }

  if (options.roundDecimals && !options.simplifyPaths) {
    output = roundSvgDecimals(output, options.precision);
  }

  output = options.prettify ? prettyPrintSvg(output) : minifySvg(output);

  const originalBytes = Buffer.byteLength(normalizedInput, "utf8");
  const optimizedBytes = Buffer.byteLength(output, "utf8");

  return {
    optimizedSvg: output,
    reactComponent: toReactComponent(output),
    originalBytes,
    optimizedBytes,
    savingsPercent: calculateSavings(originalBytes, optimizedBytes),
  };
}
