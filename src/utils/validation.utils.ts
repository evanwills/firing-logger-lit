export const addRemoveField = (fieldList : string[], key : string, add : boolean = true) : string[] => {
  if (add === true) {
    if (fieldList.includes(key) === false) {
      fieldList.push(key);
    }

    return fieldList;
  }

  return fieldList.filter((item) => (item !== key));
}
