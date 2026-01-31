export function generateId() {
  return crypto.randomUUID();
}

export function findById(items: any[], id: string) {
  return items.find(item => item.id === id);
}

export function updateById(items: any[], updatedItem: any) {
  return items.map(item => item.id === updatedItem.id ? updatedItem : item);
}

export function filterById(items: any[], id: string) {
  return items.filter(item => item.id !== id);
}

export function prependItem(items: any[], item: any) {
  return [item, ...items];
}
