export const indexed = (list: { id: string }[]) => {
  const record: { [key: string]: { id: string } } = {};

  for (const item of list) {
    record[item.id] = item;
  }

  return record;
};
