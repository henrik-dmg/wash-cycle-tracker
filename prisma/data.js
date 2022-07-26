const machines = [
  {
    name: 'First Machine',
    description: 'Things you can wear on your head',
  },
  {
    name: 'Second Machine',
    description: 'Things you can wear on your feet',
  },
]

const users = [
  {
    id: 'someUserID',
    name: 'Henrik Panhans',
  },
  {
    id: 'someOtherUserID',
    name: 'Lisa-Marie Reinert',
  },
]

const actions = [
  {
    actionType: 'wash',
    machineId: 1,
    userId: "someUserID"
  },
  {
    actionType: 'wash',
    machineId: 1,
    userId: "someUserID"
  },
  {
    actionType: 'wash',
    machineId: 1,
    userId: "someUserID"
  },
  {
    actionType: 'wash',
    machineId: 2,
    userId: "someUserID"
  },
  {
    actionType: 'clean',
    machineId: 1,
    userId: "someUserID"
  },
]

const userMachineRelationships = [
  {
    machineId: 1,
    userId: "someUserID",
    assignedBy: "admin"
 },
 {
    machineId: 2,
    userId: "someUserID",
    assignedBy: "admin"
 },
 {
    machineId: 1,
    userId: "someOtherUserID",
    assignedBy: "admin"
 }
]

module.exports = {
  machines,
  actions,
  users,
  userMachineRelationships
}
