// Helper function to normalize text for search comparison
export function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper function to convert simple English plurals to singular form
export function singularize(word = "") {
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("sses")) return word.slice(0, -2);
  if (word.endsWith("ses")) return word.slice(0, -1);
  if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
  return word;
}

// Function to tokenize text into normalized, singularized search terms
export function tokenize(text = "") {
  return normalize(text).split(" ").map(singularize);
}
