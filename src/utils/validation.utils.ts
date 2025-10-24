export const addRemoveField = (fieldList : Set<string>, key : string, add : boolean = true) : Set<string> => {
  if (add === true) {
    fieldList.add(key);
  } else {
    fieldList.delete(key);
  }
  return fieldList;
}
