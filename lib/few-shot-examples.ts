export const fewShotExamples = [
  {
    id: 1,
    category: "Cultural–Linguistic Reasoning",
    subcategory: "Pragmatics & Social Norms",
    input: 'Why does the question "Sudah menikah?" sound polite in Indonesian but intrusive in English-speaking cultures?',
    output: `**Literal Meaning:**
The phrase asks about a person's marital status.

**Linguistic Perspective:**
In Indonesian pragmatics, personal questions are often used as a form of social bonding rather than information-seeking.

**Cultural Assumption:**
- Indonesian culture assumes communal identity, where life milestones (marriage, family, age) are shared social concerns.
- Western cultures prioritize individual privacy and personal boundaries.

**Social Norm:**
- Asking about marriage signals care and inclusion in Indonesian society.
- In English-speaking cultures, the same question can imply judgment or unwanted evaluation.

**Cross-Cultural Comparison:**
- Similar questions are common in many collectivist societies (Indonesia, India, parts of the Middle East).
- In individualist societies, acceptable small talk avoids personal life unless initiated by the person.

**Teaching Note:**
Language learners should focus not only on grammar, but also on *when* and *to whom* a question is socially appropriate.`
  },
  {
    id: 2,
    category: "Linguistic–Semantic Reasoning",
    subcategory: "Meaning Beyond Words",
    input: 'Explain the meaning of "It\'s up to you" and why it can cause confusion for non-native speakers.',
    output: `**Literal Meaning:**
The decision is yours.

**Semantic Layer:**
The phrase is intentionally vague and transfers responsibility without explicit guidance.

**Pragmatic Usage:**
In English-speaking cultures, this expression often implies politeness, flexibility, or avoidance of imposing authority.

**Cultural Implication:**
- Listeners are expected to infer context, tone, and power relations.
- In high-context cultures, such ambiguity may be perceived as lack of care or hidden intention.

**Potential Misunderstanding:**
Non-native speakers may expect explicit instructions and feel abandoned or uncertain.

**Comparable Expressions:**
- Indonesian: "terserah" (can sound dismissive depending on tone)
- Japanese: "お任せします" (more respectful, hierarchical nuance)

**Teaching Note:**
Understanding indirectness is essential to pragmatic fluency, not just vocabulary knowledge.`
  },
  {
    id: 3,
    category: "Cultural Reasoning in Literature",
    subcategory: "Implicit Worldview in Texts",
    input: "Why do many Western novels emphasize individual struggle, while traditional Asian literature often emphasizes social harmony?",
    output: `**Literary Observation:**
- Western narratives frequently focus on individual protagonists overcoming personal conflict.
- Asian literary traditions often foreground collective harmony and social roles.

**Cultural Reasoning:**
- Western literature is shaped by Enlightenment ideas of individual autonomy and self-determination.
- Asian literature is influenced by Confucian, Buddhist, or communal philosophies emphasizing relational identity.

**Narrative Structure:**
- Conflict in Western literature often arises from internal desire versus society.
- In Asian literature, conflict often arises from imbalance within social or moral order.

**Interpretative Risk:**
Reading Asian literature through Western individualist lenses may lead to misinterpretation of character motivations.

**Teaching Note:**
Literature reflects cultural epistemology — how societies understand self, duty, and meaning.`
  },
  {
    id: 4,
    category: "Linguistic Error Analysis",
    subcategory: "Learner-Oriented",
    input: 'A learner says: "I very agree with you." Why is this incorrect, and why does the mistake make sense?',
    output: `**Grammatical Explanation:**
"Agree" is a verb and cannot be modified directly by "very."
Correct forms include "I strongly agree" or "I completely agree."

**Linguistic Transfer:**
The error arises from direct translation from languages where intensifiers modify verbs similarly.

**Cognitive Reasoning:**
Learners map familiar structures from their native language onto English syntax.

**Cultural Dimension:**
Some languages emphasize emotional intensity, while English prefers adverbial precision.

**Teaching Note:**
Errors often indicate logical reasoning rather than lack of intelligence.
They should be treated as learning signals, not failures.`
  },
  {
    id: 5,
    category: "Defining Cultural Reasoning",
    subcategory: "Meta-Level",
    input: "What does it mean to say that language carries cultural reasoning?",
    output: `**Conceptual Definition:**
Cultural reasoning refers to the implicit logic, values, and assumptions embedded in language use.

**Beyond Vocabulary:**
Words do not only convey meaning; they encode social expectations, power relations, and norms.

**Example:**
- Honorifics in Korean encode hierarchy.
- Tense usage in English encodes time-orientation and planning.

**Reasoning Layer:**
When speakers choose certain expressions, they activate culturally shared interpretations.

**Teaching Implication:**
Learning a language requires understanding how speakers reason about the world, not only how they name objects.`
  }
];

export type FewShotExample = typeof fewShotExamples[number];
