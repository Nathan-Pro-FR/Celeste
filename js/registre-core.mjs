export const CELESTIAL_LEVELS = [
  { niveau: 1, titre: 'Étincelle', symbole: '⭐', description: 'Une présence sympathique.' },
  { niveau: 2, titre: 'Étoile naissante', symbole: '⭐⭐', description: 'Une personne agréable à retrouver.' },
  { niveau: 3, titre: 'Étoile brillante', symbole: '⭐⭐⭐', description: 'Une bonne entente.' },
  { niveau: 4, titre: 'Petite constellation', symbole: '⭐⭐⭐⭐', description: 'Une complicité qui se développe.' },
  { niveau: 5, titre: 'Constellation', symbole: '⭐⭐⭐⭐⭐', description: 'Une amie que vous appréciez beaucoup.' },
  { niveau: 6, titre: 'Gardienne lunaire', symbole: '🌙', description: 'Une relation de confiance.' },
  { niveau: 7, titre: 'Nébuleuse précieuse', symbole: '🌌', description: 'Une amie très importante.' },
  { niveau: 8, titre: 'Joyau céleste', symbole: '💎', description: 'Une complicité exceptionnelle.' },
  { niveau: 9, titre: 'Astre légendaire', symbole: '🌟', description: 'Une place extrêmement particulière.' },
  { niveau: 10, titre: 'Étoile éternelle', symbole: '👑🌟✨', description: 'Une personne exceptionnelle dans votre univers.' }
];

export const DISTINCTIONS = [
  { id: 'confiance', nom: 'Lune de confiance', symbole: '🌙', sens: 'Personne avec qui vous pouvez parler librement.' },
  { id: 'complicite', nom: 'Étoile complice', symbole: '💫', sens: 'Bonne entente et moments amusants.' },
  { id: 'joyau', nom: 'Joyau précieux', symbole: '💎', sens: 'Personne particulièrement importante.' },
  { id: 'protection', nom: 'Aile protectrice', symbole: '🪽', sens: 'Personne présente dans les moments difficiles.' },
  { id: 'connexion', nom: 'Connexion mystique', symbole: '🔮', sens: 'Complicité particulière.' },
  { id: 'couronne', nom: 'Couronne royale', symbole: '👑', sens: 'Personne occupant une place très spéciale.' }
];

export function normalizeLevel(level) {
  const numericLevel = Number(level);
  if (!Number.isInteger(numericLevel)) {
    return 1;
  }
  return Math.min(10, Math.max(1, numericLevel));
}

export function normalizeDistinctions(distinctions = []) {
  const values = Array.isArray(distinctions) ? distinctions : [];
  return [...new Set(values.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean))];
}

export function normalizeFriendProfile(input = {}) {
  const pseudo = String(input.pseudo ?? '').trim();
  const normalized = {
    id: input.id ?? crypto?.randomUUID?.() ?? `friend-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    pseudo,
    discordId: input.discordId ? String(input.discordId).trim() || null : null,
    avatar: input.avatar ? String(input.avatar).trim() || null : null,
    level: normalizeLevel(input.level ?? 1),
    distinctions: normalizeDistinctions(input.distinctions),
    comment: typeof input.comment === 'string' ? input.comment : '',
    createdAt: input.createdAt ?? new Date().toISOString(),
    updatedAt: input.updatedAt ?? new Date().toISOString(),
    archived: Boolean(input.archived)
  };

  return normalized;
}

export function validateFriendForm(data = {}) {
  const errors = {};
  const pseudo = String(data.pseudo ?? '').trim();
  if (!pseudo) {
    errors.pseudo = 'Le pseudo est obligatoire.';
  }
  const level = normalizeLevel(data.level ?? 1);
  if (!Number.isInteger(Number(data.level)) || level < 1 || level > 10) {
    errors.level = 'Le niveau doit être compris entre 1 et 10.';
  }
  return { valid: Object.keys(errors).length === 0, errors, friend: normalizeFriendProfile({ ...data, pseudo, level }) };
}

export function buildHistoryEvent(friendId, type, options = {}) {
  const { oldValue = null, newValue = null, reason = null } = options;
  return {
    id: crypto?.randomUUID?.() ?? `event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    friendId,
    type,
    createdAt: new Date().toISOString(),
    oldValue,
    newValue,
    reason
  };
}

export function updateFriendProfile(friend, updates = {}) {
  const original = normalizeFriendProfile(friend);
  const proposed = normalizeFriendProfile({
    ...original,
    ...updates,
    distinctions: updates.distinctions ?? original.distinctions,
    level: updates.level ?? original.level,
    comment: updates.comment ?? original.comment,
    pseudo: updates.pseudo ?? original.pseudo,
    discordId: updates.discordId ?? original.discordId,
    avatar: updates.avatar ?? original.avatar,
    archived: updates.archived ?? original.archived
  });

  const events = [];

  if (proposed.pseudo !== original.pseudo) {
    events.push(buildHistoryEvent(original.id, 'profile_renamed', { oldValue: original.pseudo, newValue: proposed.pseudo, reason: 'Mise à jour du pseudo' }));
  }

  if (proposed.level !== original.level) {
    events.push(buildHistoryEvent(original.id, 'level_changed', { oldValue: original.level, newValue: proposed.level, reason: 'Changement manuel du niveau' }));
  }

  if (JSON.stringify(proposed.distinctions) !== JSON.stringify(original.distinctions)) {
    const additions = proposed.distinctions.filter((id) => !original.distinctions.includes(id));
    const removals = original.distinctions.filter((id) => !proposed.distinctions.includes(id));
    additions.forEach((id) => events.push(buildHistoryEvent(original.id, 'distinction_added', { oldValue: null, newValue: id, reason: 'Ajout d’une distinction' })));
    removals.forEach((id) => events.push(buildHistoryEvent(original.id, 'distinction_removed', { oldValue: id, newValue: null, reason: 'Retrait d’une distinction' })));
  }

  if (proposed.comment !== original.comment) {
    events.push(buildHistoryEvent(original.id, 'comment_changed', { oldValue: original.comment, newValue: proposed.comment, reason: 'Commentaire modifié' }));
  }

  if (proposed.archived !== original.archived) {
    events.push(buildHistoryEvent(original.id, proposed.archived ? 'archived' : 'restored', { oldValue: original.archived, newValue: proposed.archived, reason: proposed.archived ? 'Archivage de la fiche' : 'Restauration de la fiche' }));
  }

  proposed.updatedAt = new Date().toISOString();
  return {
    friend: proposed,
    events
  };
}

export function createFriendRecord(input = {}) {
  const validation = validateFriendForm(input);
  if (!validation.valid) {
    throw new Error(Object.values(validation.errors).join(' '));
  }

  const friend = normalizeFriendProfile(validation.friend);
  return {
    friend,
    event: buildHistoryEvent(friend.id, 'created', { oldValue: null, newValue: { pseudo: friend.pseudo, level: friend.level }, reason: 'Création de la fiche' })
  };
}

if (typeof window !== 'undefined') {
  window.RegistreCelesteCore = {
    CELESTIAL_LEVELS,
    DISTINCTIONS,
    normalizeLevel,
    normalizeDistinctions,
    normalizeFriendProfile,
    validateFriendForm,
    buildHistoryEvent,
    updateFriendProfile,
    createFriendRecord
  };
}
