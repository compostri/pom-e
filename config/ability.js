import { AbilityBuilder } from '@casl/ability'

function subjectName(subject) {
  return !subject || typeof subject === 'string' ? subject : subject.$type
}

export const Action = {
  READ: 'read',
  DELETE: 'delete',
  UPDATE: 'update',
  CREATE: 'create'
}
export const Subject = {
  COMPOSTER_PERMANENCES: 'COMPOSTER_PERMANENCES',
  COMPOSTER_LISTES_OUVREURS: 'COMPOSTER_LISTES_OUVREURS',
  COMPOSTER_NEWLETTERS: 'COMPOSTER_NEWLETTERS'
}

export const Default = AbilityBuilder.define({ subjectName }, can => {
  can(Action.READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
})

export const Opener = AbilityBuilder.define({ subjectName }, can => {
  can(Action.READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
})

export const Referent = AbilityBuilder.define({ subjectName }, can => {
  can(Action.READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
  can(Action.READ, [Subject.COMPOSTER_LISTES_OUVREURS, Subject.COMPOSTER_NEWLETTERS])
})

export default {
  Opener,
  Referent,
  Default
}
