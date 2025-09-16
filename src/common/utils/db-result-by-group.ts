// TODO 添加arrayField字段别名功能
// 数据库查询分组函数
export function dbResultByGroup<T extends Record<string, any>>(
  result: T[],
  groupKey: keyof T,
  arrayField: keyof T,
): (Omit<T, typeof arrayField> & { [K in typeof arrayField]: T[typeof arrayField][] })[] {
  const grouped = result.reduce((acc, item) => {
    const key = item[groupKey];
    
    if (!acc[key]) {
      // 创建新分组，排除数组字段
      const { [arrayField]: _, ...rest } = item;
      acc[key] = {
        ...rest,
        [arrayField]: []
      };
    }
    
    // 将当前项的数组字段值添加到分组中
    if (item[arrayField]) {
      acc[key][arrayField].push(item[arrayField]);
    }
    
    return acc;
  }, {} as Record<any, any>);
  
  return Object.values(grouped);
}

