type TagListProps = {
  items: readonly string[];
  limit?: number;
  label: string;
};

export function TagList({ items, limit, label }: TagListProps) {
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;

  return (
    <ul className="tag-list" aria-label={label}>
      {visibleItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
