import { AbilityBuilder } from '@casl/ability'

function subjectName(subject) {
  return !subject || typeof subject === 'string' ? subject : subject.$type
}

export const Action = {
  READ: 'read',
  DELETE: 'delete',
  EDIT: 'edit',
  CREATE: 'create'
}

export const Subject = {
  COMPOSTER_PERMANENCES: 'COMPOSTER_PERMANENCES',
  COMPOSTER_LISTES_OUVREURS: 'COMPOSTER_LISTES_OUVREURS',
  COMPOSTER_OUVREUR: 'COMPOSTER_OUVREUR',
  COMPOSTER_NEWLETTERS: 'COMPOSTER_NEWLETTERS',
  COMPOSTER_INFORMATION: 'COMPOSTER_INFORMATION'
}

export const Default = AbilityBuilder.define({ subjectName }, can => {
  can(Action.READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
})

export const Opener = AbilityBuilder.define({ subjectName }, can => {
  can(Action.READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
  can([Action.CREATE, Action.DELETE], Subject.COMPOSTER_OUVREUR, { self: { $eq: true } })
})

export const Referent = AbilityBuilder.define({ subjectName }, can => {
  can([Action.READ, Action.EDIT], [Subject.COMPOSTER_INFORMATION, Subject.COMPOSTER_LISTES_OUVREURS, Subject.COMPOSTER_NEWLETTERS])
  can(Action.READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
})

export const Ability = {
  Opener,
  Referent,
  Default
}
