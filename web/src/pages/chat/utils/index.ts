import awsconfig from '../../../awsconfig.json';

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

export function generateUserArn(id: string) {
  return `${awsconfig.app_instance_arn.value}/user/${id}`;
}
