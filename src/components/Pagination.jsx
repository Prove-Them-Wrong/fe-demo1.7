import "../styles/pagination.css";

export default function Pagination({
  page = 1,
  totalPages = 1,
  onChange,
}) {
  if (typeof onChange !== "function") return null;

  const safeTotalPages = Math.max(1, totalPages);
  const pages = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination">
      <button
        disabled={page <= 1}
        onClick={() => onChange(Math.max(1, page - 1))}
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? "active" : ""}
          disabled={p === page}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page >= safeTotalPages}
        onClick={() => onChange(Math.min(safeTotalPages, page + 1))}
      >
        Next
      </button>
    </nav>
  );
}
