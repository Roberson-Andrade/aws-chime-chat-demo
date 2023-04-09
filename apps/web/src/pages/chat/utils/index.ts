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

export function getAppInstanceArn() {
  if (!awsconfig.app_instance_arn.value) {
    throw new Error('app_instance_arn does not exists');
  }

  return awsconfig.app_instance_arn.value;
}

export function generateUserArn(id: string) {
  return `${getAppInstanceArn()}/user/${id}`;
}

export function getIdFromUserArn(userArn: string) {
  const id = userArn.split('user/')[1];

  return id;
}
