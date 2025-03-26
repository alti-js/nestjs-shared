export function convertSnakeToCamel(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertSnakeToCamel(item));
  }

  if (typeof obj !== "object") {
    return obj;
  }

  const camelObj: any = {};
  Object.keys(obj).forEach((key) => {
    const camelKey = key.replace(/_([a-z0-9])/gi, (_, letter) =>
      letter.toUpperCase()
    );
    camelObj[camelKey] = convertSnakeToCamel(obj[key]);
  });

  return camelObj;
}
