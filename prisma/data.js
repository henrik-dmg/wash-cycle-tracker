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

const actions = [
  {
    actionType: "Wash",
    machine_id: 1,
  },
  {
    actionType: "Wash",
    machine_id: 1,
  },
  {
    actionType: "Wash",
    machine_id: 1,
  },
  {
    actionType: "Wash",
    machine_id: 2,
  },
  {
    actionType: "Clean",
    machine_id: 1,
  },
]

module.exports = {
  machines, actions
}
