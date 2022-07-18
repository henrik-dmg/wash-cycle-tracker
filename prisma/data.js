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
    actionType: 'Wash',
    machineId: 1,
  },
  {
    actionType: 'Wash',
    machineId: 1,
  },
  {
    actionType: 'Wash',
    machineId: 1,
  },
  {
    actionType: 'Wash',
    machineId: 2,
  },
  {
    actionType: 'Clean',
    machineId: 1,
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
