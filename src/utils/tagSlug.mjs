/**
 * The one normalization every tag goes through, at build time and in the
 * browser: "Turkish Cuisine", "turkish cuisine" and "turkish-cuisine" are the
 * same tag. Aliases (golang -> go) are applied after this, from the registry.
 */
export function normalizeTag(value) {
  return (
    String(value ?? '')
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/ı/g, 'i')
      // Keep language names distinct before punctuation is dropped:
      // C# -> csharp, C++ -> cpp, .NET -> dotnet (else all would become "c").
      .replace(/\+\+/g, 'pp')
      .replace(/#/g, 'sharp')
      .replace(/(^|[^a-z0-9])\.net\b/g, '$1dotnet')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}
