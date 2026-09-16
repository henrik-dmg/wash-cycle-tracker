const machines = [
  {
    name: 'Flat 3B washer',
    description: 'Front-loader in the bathroom',
    costPerWash: 80,
    currency: 'EUR',
    inviteCode: 'sample-invite-flat-3b',
  },
  {
    name: 'Basement washer',
    description: 'Shared machine for the whole building',
    costPerWash: 120,
    currency: 'EUR',
    inviteCode: 'sample-invite-basement',
  },
]

const users = [
  {
    id: 'someUserID',
    name: 'Henrik Panhans',
    email: 'henrik@example.com',
    emailVerified: true,
  },
  {
    id: 'someOtherUserID',
    name: 'Leona Schulz-Schaeffer',
    email: 'leona@example.com',
    emailVerified: true,
  },
]

// Returns a date in the current UTC month, or `monthsAgo` months before it.
function dateInMonth(monthsAgo, day) {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, day, 18))
}

// The cost is the price of the machine at the time of the log. A clean cycle costs nothing.
const actions = [
  { actionType: 'wash', machineId: 1, userId: 'someUserID', cost: 70, date: dateInMonth(1, 4) },
  { actionType: 'wash', machineId: 1, userId: 'someOtherUserID', cost: 70, date: dateInMonth(1, 12) },
  { actionType: 'clean', machineId: 1, userId: 'someOtherUserID', cost: 0, date: dateInMonth(1, 20) },
  { actionType: 'wash', machineId: 1, userId: 'someUserID', cost: 80, date: dateInMonth(0, 1) },
  { actionType: 'wash', machineId: 1, userId: 'someUserID', cost: 80, date: dateInMonth(0, 1) },
  { actionType: 'wash', machineId: 1, userId: 'someOtherUserID', cost: 80, date: dateInMonth(0, 1) },
  { actionType: 'clean', machineId: 1, userId: 'someUserID', cost: 0, date: dateInMonth(0, 1) },
  { actionType: 'wash', machineId: 2, userId: 'someUserID', cost: 120, date: dateInMonth(0, 1) },
]

const userMachineRelationships = [
  {
    machineId: 1,
    userId: 'someUserID',
    assignedBy: 'someUserID',
  },
  {
    machineId: 2,
    userId: 'someUserID',
    assignedBy: 'someUserID',
  },
  {
    machineId: 1,
    userId: 'someOtherUserID',
    assignedBy: 'invite',
  },
]

module.exports = {
  machines,
  actions,
  users,
  userMachineRelationships,
}
