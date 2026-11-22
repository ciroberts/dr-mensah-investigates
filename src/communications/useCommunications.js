import { useEffect, useMemo, useRef, useState } from "react";
import { scandburyCommunications } from "../cases/001-Scandbury/communications/scandburyCommunications.js";
import { characterProfiles } from "./characterProfiles.js";

const clock = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const pickDelay = (value, fallback) => {
  const source = value ?? fallback;
  if (Array.isArray(source)) {
    const [min, max] = source;
    return Math.round(min + Math.random() * Math.max(0, max - min));
  }
  return source;
};
const pick = (items = []) => items.length ? items[Math.floor(Math.random() * items.length)] : null;

const initialThreads = {
  amara: [
    { id: "amara-setup-1", from: "amara", receivedAt: "6:47 PM", unread: true, text: ["You're set up.", "I've sent the location of Scandbury Mansion to your map.", "Mensah wants you to begin there.", "Message me if you need me to look into anything."] },
  ],
  mensah: [],
};

export function useCommunications({ knownFacts = [], locationId, messagesVisible = false } = {}) {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedContactId, setSelectedContactId] = useState("amara");
  const [contactPressure, setContactPressure] = useState({ amara: 0, mensah: 0 });
  const [recentResponseIds, setRecentResponseIds] = useState([]);
  const [recentIntents, setRecentIntents] = useState({ amara: [], mensah: [] });
  const [unreadNotes, setUnreadNotes] = useState(1);
  const [typing, setTyping] = useState({ amara: false, mensah: false });
  const [dndUntil, setDndUntil] = useState({ amara: 0, mensah: 0 });
  const [recentlyBadgered, setRecentlyBadgered] = useState({ amara: false, mensah: false });
  const [notice, setNotice] = useState("");
  const timers = useRef([]);
  const pending = useRef(new Set());
  const [pendingContacts, setPendingContacts] = useState([]);
  const messagesVisibleRef = useRef(messagesVisible);
  messagesVisibleRef.current = messagesVisible;
  const finishResponse = (contactId) => { pending.current.delete(contactId); setPendingContacts([...pending.current]); };
  const selectedContactRef = useRef(selectedContactId);

  useEffect(() => { selectedContactRef.current = selectedContactId; }, [selectedContactId]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, delay) => {
    const timer = setTimeout(() => { timers.current = timers.current.filter((id) => id !== timer); fn(); }, delay);
    timers.current.push(timer);
    return timer;
  };

  const isDnd = (contactId) => (dndUntil[contactId] ?? 0) > Date.now();
  const contacts = useMemo(() => Object.fromEntries(Object.entries(characterProfiles).map(([id, profile]) => {
    const dnd = isDnd(id);
    return [id, { ...profile, status: dnd ? "Do Not Disturb" : profile.defaultStatus, tone: dnd ? "dnd" : profile.tone, dnd }];
  })), [dndUntil]);

  const unreadByContact = useMemo(() => Object.fromEntries(
    Object.entries(threads).map(([id, messages]) => [id, messages.filter((message) => message.unread && message.from !== "player").length])
  ), [threads]);
  const unreadMessages = Object.values(unreadByContact).reduce((sum, count) => sum + count, 0);
  const totalUnread = unreadMessages + unreadNotes;

  const markThreadRead = (contactId) => setThreads((current) => ({
    ...current,
    [contactId]: current[contactId].map((message) => ({ ...message, unread: false })),
  }));
  const markNotesRead = () => setUnreadNotes(0);
  const selectContact = (contactId) => {
    if (!characterProfiles[contactId]) return;
    selectedContactRef.current = contactId;
    setSelectedContactId(contactId);
    if (messagesVisibleRef.current) markThreadRead(contactId);
    setNotice("");
  };
  useEffect(() => {
    if (messagesVisible) markThreadRead(selectedContactId);
  }, [messagesVisible, selectedContactId]);

  const suggestions = scandburyCommunications.suggestions.filter((suggestion) => {
    if (suggestion.contact !== selectedContactId) return false;
    if (suggestion.locationId && suggestion.locationId !== locationId) return false;
    if (suggestion.requiresFacts?.some((fact) => !knownFacts.includes(fact))) return false;
    return true;
  });

  const addIncoming = (contactId, response, extraText = []) => {
    const receivedAt = clock();
    const text = [...extraText, ...(response.text ?? [])];
    if (!text.length) return;
    setThreads((current) => ({
      ...current,
      [contactId]: [...current[contactId], { id: `${response.id}-${Date.now()}`, from: contactId, receivedAt, unread: !messagesVisibleRef.current || selectedContactRef.current !== contactId, text }],
    }));
  };

  const performTypingSequence = (contactId, response, done) => {
    const sequence = response.typingSequence ?? [{ typing: pickDelay(response.typingDelay, 3200) }];
    let elapsed = 0;
    sequence.forEach((step) => {
      if (step.typing) {
        later(() => setTyping((current) => ({ ...current, [contactId]: true })), elapsed);
        elapsed += step.typing;
        later(() => setTyping((current) => ({ ...current, [contactId]: false })), elapsed);
      }
      if (step.pause) elapsed += step.pause;
    });
    later(done, elapsed + 150);
  };

  const enterPressureDnd = (contactId) => {
    const duration = characterProfiles[contactId]?.pressureDndMs ?? 300000;
    setDndUntil((current) => ({ ...current, [contactId]: Date.now() + duration }));
    setRecentlyBadgered((current) => ({ ...current, [contactId]: true }));
    setTyping((current) => ({ ...current, [contactId]: false }));
    later(() => setDndUntil((current) => ({ ...current, [contactId]: 0 })), duration + 50);
  };

  const sendSuggestion = (suggestion) => {
    const contactId = selectedContactId;
    if (!suggestions.some((item) => item.id === suggestion?.id)) return;
    if (pending.current.has(contactId)) { setNotice("Wait for the current reply before sending another message."); return; }
    if (isDnd(contactId)) {
      setNotice(`${characterProfiles[contactId].handle} is in Do Not Disturb mode. Message not transmitted.`);
      return;
    }
    setNotice("");
    const intentHistory = recentIntents[contactId] ?? [];
    const duplicateCount = intentHistory.slice(-3).filter((intent) => intent === suggestion.intent).length;
    const pressureIncrement = (suggestion.pressure ?? 1) + (duplicateCount >= 1 ? 1 : 0) + (duplicateCount >= 2 ? 1 : 0);
    const pressure = contactPressure[contactId] ?? 0;
    const nextPressure = Math.min(10, pressure + pressureIncrement);
    const eligible = scandburyCommunications.responses.filter((response) => {
      if (response.contact !== contactId || response.intent !== suggestion.intent) return false;
      if (response.locationId && response.locationId !== locationId) return false;
      if (response.requiresFacts?.some((fact) => !knownFacts.includes(fact))) return false;
      if ((response.minPressure ?? 0) > nextPressure) return false;
      if (response.maxPressure != null && nextPressure > response.maxPressure) return false;
      return true;
    });
    const fresh = eligible.filter((response) => !recentResponseIds.includes(response.id));
    const response = pick(fresh.length ? fresh : eligible);
    if (!response) { setNotice("No response is available for that topic right now."); return; }
    pending.current.add(contactId);
    setPendingContacts([...pending.current]);
    const messageId = `player-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setThreads((current) => ({ ...current, [contactId]: [...current[contactId], { id: messageId, from: "player", sentAt: clock(), readAt: null, unread: false, text: [suggestion.text] }] }));
    setContactPressure((current) => ({ ...current, [contactId]: nextPressure }));
    setRecentIntents((current) => ({ ...current, [contactId]: [...(current[contactId] ?? []).slice(-4), suggestion.intent] }));
    if (!response) return;
    setRecentResponseIds((current) => [...current.slice(-5), response.id]);

    const profile = characterProfiles[contactId];
    const readDelay = pickDelay(response.readDelay, profile.readDelay);
    later(() => {
      setThreads((current) => ({ ...current, [contactId]: current[contactId].map((message) => message.id === messageId ? { ...message, readAt: clock() } : message) }));
      if (response.readOnly) {
        finishResponse(contactId);
        if (nextPressure >= (response.dndAtPressure ?? 7)) later(() => enterPressureDnd(contactId), response.dndDelay ?? 1800);
        return;
      }
      const thinkDelay = pickDelay(response.preTypingDelay, profile.preTypingDelay);
      later(() => performTypingSequence(contactId, response, () => {
        const recoveryLine = recentlyBadgered[contactId] ? pick(profile.phrasePools.afterBadgering) : null;
        addIncoming(contactId, response, recoveryLine ? [recoveryLine] : []);
        finishResponse(contactId);
        if (recoveryLine) setRecentlyBadgered((current) => ({ ...current, [contactId]: false }));
        if (response.enterDnd || nextPressure >= 8) later(() => enterPressureDnd(contactId), response.dndDelay ?? 700);
      }), thinkDelay);
    }, readDelay);
  };

  // Authored critical events may break a pressure-based DND. Wire case events to this API as they come online.
  const reactToCriticalEvent = (contactId, response) => {
    setDndUntil((current) => ({ ...current, [contactId]: 0 }));
    setTyping((current) => ({ ...current, [contactId]: false }));
    const delay = pickDelay(response.delay, [500, 1600]);
    later(() => performTypingSequence(contactId, response, () => addIncoming(contactId, response)), delay);
  };

  return {
    contacts, threads, selectedContactId, selectContact, suggestions, sendSuggestion,
    unreadByContact, unreadMessages, unreadNotes, totalUnread, markNotesRead,
    contactPressure, typing, notice, reactToCriticalEvent, pendingContacts,
  };
}
