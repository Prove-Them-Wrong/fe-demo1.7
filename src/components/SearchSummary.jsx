export default function SearchSummary({ query = "", count = 0 }) {
  return (
    <section className="srp-summary">
      <h1>Search Results</h1>

      {query ? (
        <p>
          Showing {count} result{count !== 1 ? "s" : ""} for
          <strong> “{query}”</strong>
        </p>
      ) : (
        <p>Showing all products</p>
      )}
    </section>
  );
}
