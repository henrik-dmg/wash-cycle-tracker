# Wash Cycle Tracker

A self-hosted app for one person. It records when each of that person's washing machines runs a wash cycle or a cleaning cycle.

## Language

**Machine**:
A washing machine that the user tracks. One deployment can track one or more machines.
_Avoid_: Device, appliance, washer

**Entry**:
One logged event on a machine, with a date and time. An entry is a wash or a cleaning. The user can delete an entry but cannot edit it.
_Avoid_: Action, log, record

**Wash**:
An entry for one normal wash cycle.
_Avoid_: Cycle, load, run

**Cleaning**:
An entry for one maintenance cycle that cleans or descales the machine.
_Avoid_: Clean cycle, maintenance, reset

**Washes since cleaning**:
The number of washes on a machine after its latest cleaning. If the machine has no cleaning, the count includes all washes.
_Avoid_: Counter, cycles since reset

**Cleaning interval**:
An optional number of washes that a machine can run before it needs a cleaning. A machine is **due for cleaning** when its washes since cleaning reach its cleaning interval.
_Avoid_: Threshold, reminder, limit

## Deployment

**Deployment mode**:
The role of one running copy of the app: `deployment` or `marketing`.
_Avoid_: Environment, app mode

**Deployment**:
A copy of the app that a user runs for their own machines, with a real database.
_Avoid_: Instance, self-hosted version, install

**Marketing site**:
The public copy of the app that presents the project. It has the landing page, the demo and the Compose form, and no real database.
_Avoid_: Landing page (for the whole site), website

**Demo**:
The tracker screens on the marketing site with sample data. A visitor's changes stay in their browser only.
_Avoid_: Preview, sandbox
