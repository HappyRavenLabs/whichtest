import React, { useState, useMemo, useEffect } from "react";
import yaml from "js-yaml";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  TextField,
  Chip,
  useMediaQuery,
} from "@mui/material";

/* =========================================================
   Utilities
   ========================================================= */

function parseYaml(text) {
  return yaml.load(text);
}

// translation helper with safe fallback
function t(value, lang) {
  if (typeof value === "string") return value;
  return value?.[lang] ?? value?.en ?? "";
}

// inject glossary tooltips before Markdown parsing
function applyGlossary(text, glossary = {}, lang) {
  if (!glossary) return text;
  let result = text;
  Object.entries(glossary).forEach(([word, translations]) => {
    const explanation = t(translations, lang);
    const re = new RegExp(`{{term:${word}}}`, "g");
    result = result.replace(
      re,
      `<span class="glossary" title="${explanation}">${word}</span>`
    );
  });
  return result;
}

// flatten tree for full‑text search
function flattenTree(nodes, path = [], acc = []) {
  nodes.forEach(n => {
    const newPath = [...path, n];
    if (n.content) acc.push({ node: n, path: newPath });
    if (n.children) flattenTree(n.children, newPath, acc);
  });
  return acc;
}

/* =========================================================
   Main App
   ========================================================= */

export default function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState(prefersDark ? "dark" : "light");
  const [lang, setLang] = useState("en");
  const [data, setData] = useState(null);
  const [path, setPath] = useState([]);
  const [search, setSearch] = useState("");

  // load YAML at runtime
  useEffect(() => {
    fetch("/feed.yaml")
      .then(r => r.text())
      .then(text => setData(parseYaml(text)));
  }, []);

  /* ---------------- Theme ---------------- */

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          contrastThreshold: mode === "contrast" ? 7 : 3,
        },
        typography: {
          fontSize: 14,
        },
      }),
    [mode]
  );

  /* ---------------- Navigation ---------------- */

  const currentNode = useMemo(() => {
    if (!data) return null;
    let node = { children: data.items };
    path.forEach(id => {
      node = node.children?.find(c => c.id === id);
    });
    return node;
  }, [data, path]);

  const breadcrumbs = useMemo(() => {
    if (!data) return [];
    return path.map((_, idx) => {
      let node = { children: data.items };
      path.slice(0, idx + 1).forEach(id => {
        node = node.children.find(c => c.id === id);
      });
      return node;
    });
  }, [data, path]);

  /* ---------------- Search ---------------- */

  const searchResults = useMemo(() => {
    if (!search || !data) return [];
    const flat = flattenTree(data.items);
    const q = search.toLowerCase();
    return flat.filter(({ node }) =>
      t(node.label, lang).toLowerCase().includes(q) ||
      t(node.content, lang).toLowerCase().includes(q)
    );
  }, [search, data, lang]);

  if (!data) return <div>Loading…</div>;

  /* ---------------- Render ---------------- */

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box p={2} maxWidth="900px" mx="auto">

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h5">YAML Content Explorer</Typography>

          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <Select
              size="small"
              value={lang}
              onChange={e => setLang(e.target.value)}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="pl">PL</MenuItem>
            </Select>

            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, v) => v && setMode(v)}
              size="small"
            >
              <ToggleButton value="light">Light</ToggleButton>
              <ToggleButton value="dark">Dark</ToggleButton>
              <ToggleButton value="contrast">Contrast</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Stack direction="row" spacing={1} mb={2}>
            {breadcrumbs.map((b, i) => (
              <Chip
                key={b.id}
                label={t(b.label, lang)}
                onClick={() => setPath(path.slice(0, i + 1))}
              />
            ))}
          </Stack>
        )}

        {/* Search results */}
        {search && searchResults.length > 0 && (
          <Stack spacing={1} mb={2}>
            {searchResults.map(({ node, path: p }) => (
              <Button
                key={node.id}
                variant="outlined"
                onClick={() => {
                  setPath(p.map(n => n.id));
                  setSearch("");
                }}
              >
                {t(node.label, lang)}
              </Button>
            ))}
          </Stack>
        )}

        {/* Navigation buttons */}
        {!search && currentNode?.children && (
          <Stack spacing={1}>
            {currentNode.children.map(child => (
              <Button
                key={child.id}
                variant="outlined"
                onClick={() => setPath([...path, child.id])}
              >
                {t(child.label, lang)}
              </Button>
            ))}
          </Stack>
        )}

        {/* Content */}
        {!search && currentNode?.content && (
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ lineHeight: 1.7 }}>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {applyGlossary(
                  t(currentNode.content, lang),
                  currentNode.glossary,
                  lang
                )}
              </ReactMarkdown>
            </CardContent>
          </Card>
        )}

        {/* Back */}
        {path.length > 0 && !search && (
          <Button sx={{ mt: 2 }} onClick={() => setPath(path.slice(0, -1))}>
            ← Back
          </Button>
        )}

      </Box>
    </ThemeProvider>
  );
}