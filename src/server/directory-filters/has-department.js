export default class HasDepartment {
  filter(data) {
    return data.filter(x => x.department);
  }
}
