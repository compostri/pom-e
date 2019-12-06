import { AbilityBuilder, Ability as CaslAbility } from '@casl/ability'

function subjectName(subject) {
  return !subject || typeof subject === 'string' ? subject : subject.$type
}

const MODIFY = 'modify'
const READ = 'read'
const DELETE = 'delete'
const CREATE = 'create'

CaslAbility.addAlias(MODIFY, [DELETE, CREATE])

export const Subject = {
  COMPOSTER_PERMANENCES: 'COMPOSTER_PERMANENCES',
  COMPOSTER_LISTES_OUVREURS: 'COMPOSTER_LISTES_OUVREURS',
  COMPOSTER_PERMANENCE_MESSAGE: 'COMPOSTER_PERMANENCE_MESSAGE',
  COMPOSTER_OUVREUR: 'COMPOSTER_OUVREUR',
  COMPOSTER_NEWLETTERS: 'COMPOSTER_NEWLETTERS',
  COMPOSTER_INFORMATION: 'COMPOSTER_INFORMATION',
  COMPOSTER_STATISTIQUES: 'COMPOSTER_STATISTIQUES'
}

export const Default = AbilityBuilder.define({ subjectName }, can => {
  can(READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
})

export const Opener = AbilityBuilder.define({ subjectName }, can => {
  can(READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
  can([CREATE, DELETE], Subject.COMPOSTER_OUVREUR, { self: { $eq: true }, isPermanencePassed: { $eq: false } })
  can(MODIFY, Subject.COMPOSTER_STATISTIQUES, { self: { $eq: true } })
})

export const Referent = AbilityBuilder.define({ subjectName }, can => {
  can([READ, MODIFY], [Subject.COMPOSTER_INFORMATION, Subject.COMPOSTER_NEWLETTERS, Subject.COMPOSTER_PERMANENCE_MESSAGE])
  can(MODIFY, Subject.COMPOSTER_STATISTIQUES)
  can(READ, Subject.COMPOSTER_PERMANENCES, { permanencesRule: { $ne: null } })
  can(MODIFY, Subject.COMPOSTER_LISTES_OUVREURS, { isPermanencePassed: { $eq: false } })
  can(MODIFY, Subject.COMPOSTER_STATISTIQUES)
})

export const Action = {
  MODIFY,
  READ,
  DELETE,
  CREATE
}
export const Ability = {
  Opener,
  Referent,
  Default
}
