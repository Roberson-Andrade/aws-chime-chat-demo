export function filterList<T extends { name: string }>(
  list: T[],
  filter: string
): T[] {
  return list.filter((item) =>
    item.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036F]/g, '')
      .includes(
        filter
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036F]/g, '')
      )
  );
}
