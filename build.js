/**
 * Build script for JodoTarot standalone version.
 *
 * Bundles all JS (ES modules) and CSS into a single index-standalone.html
 * that can be opened directly via file:// without a server.
 *
 * Usage: node build.js
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 1. Persona static-import plugin
// ---------------------------------------------------------------------------
// The personas/index.js uses dynamic imports (`await import(path)`) which
// esbuild cannot resolve. This plugin intercepts that file and replaces it
// with a version that uses static imports for all 21 personas.

const PERSONA_DIR = path.join(__dirname, 'assets', 'js', 'models', 'personas');

function personaStaticImportPlugin() {
  return {
    name: 'persona-static-imports',
    setup(build) {
      // Match the personas index file
      build.onLoad(
        { filter: /models[/\\]personas[/\\]index\.js$/ },
        async (args) => {
          // Read the original file to extract the PERSONA_PATHS mapping
          const original = fs.readFileSync(args.path, 'utf8');

          // Extract persona key -> file pairs from PERSONA_PATHS
          const pairRegex = /'(\w+)':\s*'\.\/(\w+\.js)'/g;
          const personas = [];
          let match;
          while ((match = pairRegex.exec(original)) !== null) {
            const key = match[1];
            const fileName = match[2];
            const className = fileName.replace('.js', '');
            personas.push({ key, fileName, className });
          }

          if (personas.length === 0) {
            throw new Error('Could not extract any persona from personas/index.js');
          }

          // Generate static imports
          const imports = personas
            .map((p) => `import ${p.className} from './${p.fileName}';`)
            .join('\n');

          const mapEntries = personas
            .map((p) => `  '${p.key}': ${p.className}`)
            .join(',\n');

          const contents = `
${imports}

const PERSONA_MAP = {
${mapEntries}
};

export async function getPersonaPrompt(personaKey, language = 'fr', spreadType = 'cross') {
  try {
    const PersonaClass = PERSONA_MAP[personaKey];
    if (!PersonaClass) return '';
    const persona = new PersonaClass(language);
    return persona.buildSystemPrompt(spreadType);
  } catch (error) {
    console.error('Erreur lors du chargement du prompt pour ' + personaKey + ':', error);
    return '';
  }
}

export async function getAllPersonas() {
  return { ...PERSONA_MAP };
}

const PERSONAS = Object.keys(PERSONA_MAP).reduce((o, k) => ({ ...o, [k]: k }), {});
export default PERSONAS;
`;

          return { contents, loader: 'js', resolveDir: path.dirname(args.path) };
        }
      );
    },
  };
}

// ---------------------------------------------------------------------------
// 2. DeckService patch plugin
// ---------------------------------------------------------------------------
// DeckService.loadDeck() uses fetch() to validate card images before loading.
// fetch() fails on file:// protocol. Since <img> tags load fine from file://,
// we simply remove the fetch-based validation loop in the standalone build.

function deckServicePatchPlugin() {
  return {
    name: 'deckservice-patch',
    setup(build) {
      build.onLoad(
        { filter: /services[/\\]DeckService\.js$/ },
        async (args) => {
          let contents = fs.readFileSync(args.path, 'utf8');

          // Remove the fetch-based image validation block (lines 63-78 in original)
          // Replace the whole "Vérifier que toutes les images sont accessibles" block
          contents = contents.replace(
            /\/\/ Vérifier que toutes les images sont accessibles[\s\S]*?for \(const card of majorCards\) \{[\s\S]*?\}\s*\}/,
            '// Image validation skipped in standalone build (fetch fails on file://)'
          );

          return { contents, loader: 'js', resolveDir: path.dirname(args.path) };
        }
      );
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Build
// ---------------------------------------------------------------------------

async function build() {
  console.log('Building JodoTarot standalone...');

  // --- Bundle JS -----------------------------------------------------------
  const jsResult = await esbuild.build({
    entryPoints: [path.join(__dirname, 'assets', 'js', 'main.js')],
    bundle: true,
    format: 'iife',
    write: false,
    minify: false,
    target: ['es2020'],
    plugins: [personaStaticImportPlugin(), deckServicePatchPlugin()],
  });

  const bundledJS = jsResult.outputFiles[0].text;
  console.log(`  JS bundled: ${(bundledJS.length / 1024).toFixed(1)} KB`);

  // --- Bundle CSS ----------------------------------------------------------
  const cssResult = await esbuild.build({
    entryPoints: [path.join(__dirname, 'assets', 'css', 'main.css')],
    bundle: true,
    write: false,
    minify: false,
    loader: { '.css': 'css' },
  });

  const bundledCSS = cssResult.outputFiles[0].text;
  console.log(`  CSS bundled: ${(bundledCSS.length / 1024).toFixed(1)} KB`);

  // --- Generate standalone HTML --------------------------------------------
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, 'index.html'),
    'utf8'
  );

  const standaloneHTML = htmlTemplate
    // Replace CSS link with inlined styles
    .replace(
      /<link\s+rel="stylesheet"\s+href="assets\/css\/main\.css"\s*\/?>/,
      `<style>\n${bundledCSS}\n</style>`
    )
    // Replace module script with inlined IIFE (no type="module" needed)
    .replace(
      /<script\s+type="module"\s+src="assets\/js\/main\.js"\s*><\/script>/,
      `<script>\n${bundledJS}\n</script>`
    );

  const outPath = path.join(__dirname, 'index-standalone.html');
  fs.writeFileSync(outPath, standaloneHTML, 'utf8');

  console.log(`  Output: ${outPath}`);
  console.log(
    `  Total size: ${(standaloneHTML.length / 1024).toFixed(1)} KB`
  );
  console.log('Done! Open index-standalone.html in your browser (file:// works).');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
