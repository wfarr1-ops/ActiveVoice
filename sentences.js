/**
 * ACTIVE VOICE ARENA - Legal Sentence Database
 *
 * Each sentence includes:
 * - text: The sentence to display
 * - voice: "active" or "passive"
 * - explanation: Why it's active or passive
 * - improved: (for passive) The active voice version
 * - category: Type of legal document
 * - difficulty: 1 (easy), 2 (medium), 3 (hard)
 */

const SENTENCES = [
    // ========================================
    // LEVEL 1 - Easy (Clear passive/active)
    // ========================================

    // Passive - Easy
    {
        text: "The contract was signed by both parties.",
        voice: "passive",
        explanation: "The subject (contract) receives the action. 'Was signed' is a passive construction with 'by both parties' revealing the true actor.",
        improved: "Both parties signed the contract.",
        category: "Contracts",
        difficulty: 1
    },
    {
        text: "The motion was denied by the court.",
        voice: "passive",
        explanation: "'Was denied' is passive. The court (actor) is hidden at the end with 'by.'",
        improved: "The court denied the motion.",
        category: "Litigation",
        difficulty: 1
    },
    {
        text: "The defendant was arrested by police.",
        voice: "passive",
        explanation: "'Was arrested' puts the defendant as subject receiving action. Police are the true actors.",
        improved: "Police arrested the defendant.",
        category: "Criminal",
        difficulty: 1
    },
    {
        text: "The evidence was presented by the prosecution.",
        voice: "passive",
        explanation: "'Was presented' is passive voice. The prosecution should be the subject performing the action.",
        improved: "The prosecution presented the evidence.",
        category: "Litigation",
        difficulty: 1
    },
    {
        text: "The lease was terminated by the landlord.",
        voice: "passive",
        explanation: "'Was terminated' makes the lease the subject. The landlord is the true actor.",
        improved: "The landlord terminated the lease.",
        category: "Real Estate",
        difficulty: 1
    },
    {
        text: "The witness was questioned by defense counsel.",
        voice: "passive",
        explanation: "'Was questioned' puts focus on the witness receiving action rather than counsel doing the questioning.",
        improved: "Defense counsel questioned the witness.",
        category: "Litigation",
        difficulty: 1
    },
    {
        text: "The appeal was filed by the defendant.",
        voice: "passive",
        explanation: "'Was filed' is passive. The defendant is the actor who should be the subject.",
        improved: "The defendant filed the appeal.",
        category: "Appeals",
        difficulty: 1
    },
    {
        text: "The damages were calculated by the expert.",
        voice: "passive",
        explanation: "'Were calculated' is passive voice. The expert performed the calculation.",
        improved: "The expert calculated the damages.",
        category: "Litigation",
        difficulty: 1
    },

    // Active - Easy
    {
        text: "The plaintiff filed a complaint.",
        voice: "active",
        explanation: "The subject (plaintiff) performs the action (filed). Clear and direct.",
        category: "Litigation",
        difficulty: 1
    },
    {
        text: "The judge granted the motion.",
        voice: "active",
        explanation: "The judge (subject) performs the action (granted). This is strong, direct writing.",
        category: "Litigation",
        difficulty: 1
    },
    {
        text: "The attorney objected to the evidence.",
        voice: "active",
        explanation: "The attorney (subject) performs the action (objected). Active and clear.",
        category: "Litigation",
        difficulty: 1
    },
    {
        text: "The jury returned a verdict of guilty.",
        voice: "active",
        explanation: "The jury (subject) performs the action (returned). Direct and forceful.",
        category: "Criminal",
        difficulty: 1
    },
    {
        text: "The company breached the agreement.",
        voice: "active",
        explanation: "The company (subject) performs the action (breached). Clear assignment of responsibility.",
        category: "Contracts",
        difficulty: 1
    },
    {
        text: "The court issued an injunction.",
        voice: "active",
        explanation: "The court (subject) performs the action (issued). Authoritative and direct.",
        category: "Litigation",
        difficulty: 1
    },
    {
        text: "The seller disclosed all known defects.",
        voice: "active",
        explanation: "The seller (subject) performs the action (disclosed). Clear accountability.",
        category: "Real Estate",
        difficulty: 1
    },
    {
        text: "The witness identified the defendant.",
        voice: "active",
        explanation: "The witness (subject) performs the action (identified). Direct statement.",
        category: "Criminal",
        difficulty: 1
    },

    // ========================================
    // LEVEL 2 - Medium (Slightly tricky)
    // ========================================

    // Passive - Medium
    {
        text: "It was determined that the clause was unenforceable.",
        voice: "passive",
        explanation: "'It was determined' hides who made the determination. This is both passive and uses the weak 'it' construction.",
        improved: "The court determined that the clause was unenforceable.",
        category: "Contracts",
        difficulty: 2
    },
    {
        text: "The documents were reviewed and approved.",
        voice: "passive",
        explanation: "'Were reviewed and approved' hides who performed these actions. The actor is completely omitted.",
        improved: "Counsel reviewed and approved the documents.",
        category: "Transactional",
        difficulty: 2
    },
    {
        text: "Proper notice had been given before termination.",
        voice: "passive",
        explanation: "'Had been given' is passive. Who gave the notice? The sentence avoids assigning responsibility.",
        improved: "The landlord gave proper notice before termination.",
        category: "Real Estate",
        difficulty: 2
    },
    {
        text: "The testimony is believed to be credible.",
        voice: "passive",
        explanation: "'Is believed' hides who believes the testimony. Passive voice with omitted actor.",
        improved: "The jury believes the testimony is credible.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "All reasonable steps were taken to mitigate damages.",
        voice: "passive",
        explanation: "'Were taken' is passive and hides the actor. Who took the steps?",
        improved: "The plaintiff took all reasonable steps to mitigate damages.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "The statute of limitations has been tolled.",
        voice: "passive",
        explanation: "'Has been tolled' is passive. The sentence doesn't identify what action or event caused the tolling.",
        improved: "The defendant's fraudulent concealment tolled the statute of limitations.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "Payment is to be made within thirty days.",
        voice: "passive",
        explanation: "'Is to be made' is passive. The sentence doesn't specify who must make the payment.",
        improved: "The buyer shall make payment within thirty days.",
        category: "Contracts",
        difficulty: 2
    },
    {
        text: "The property had been conveyed prior to the dispute.",
        voice: "passive",
        explanation: "'Had been conveyed' is passive. Who conveyed the property is not stated.",
        improved: "The seller conveyed the property prior to the dispute.",
        category: "Real Estate",
        difficulty: 2
    },

    // Active - Medium
    {
        text: "Counsel argues that the evidence is inadmissible.",
        voice: "active",
        explanation: "Counsel (subject) performs the action (argues). Present tense, active voice.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "The statute requires written consent.",
        voice: "active",
        explanation: "The statute (subject) performs the action (requires). Statutes can be subjects.",
        category: "Regulatory",
        difficulty: 2
    },
    {
        text: "This provision governs all disputes arising under the contract.",
        voice: "active",
        explanation: "The provision (subject) performs the action (governs). Documents and their parts can be active subjects.",
        category: "Contracts",
        difficulty: 2
    },
    {
        text: "The facts establish a prima facie case.",
        voice: "active",
        explanation: "The facts (subject) perform the action (establish). Abstract nouns can be active subjects.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "The parties agreed to arbitrate all disputes.",
        voice: "active",
        explanation: "The parties (subject) perform the action (agreed). Clear and direct.",
        category: "Contracts",
        difficulty: 2
    },
    {
        text: "Defendant's actions constitute fraud.",
        voice: "active",
        explanation: "The actions (subject) perform the action (constitute). The subject acts upon the object.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "The regulation prohibits such conduct.",
        voice: "active",
        explanation: "The regulation (subject) performs the action (prohibits). Regulations can actively prohibit.",
        category: "Regulatory",
        difficulty: 2
    },
    {
        text: "This Court lacks jurisdiction over the matter.",
        voice: "active",
        explanation: "The Court (subject) performs the action (lacks). Even lacking something is active voice.",
        category: "Litigation",
        difficulty: 2
    },

    // ========================================
    // LEVEL 3 - Hard (Tricky constructions)
    // ========================================

    // Passive - Hard
    {
        text: "It is respectfully submitted that the motion should be granted.",
        voice: "passive",
        explanation: "'It is submitted' and 'should be granted' are both passive. This common legal phrase hides the actor completely.",
        improved: "Counsel respectfully submits that the Court should grant the motion.",
        category: "Litigation",
        difficulty: 3
    },
    {
        text: "The agreement is deemed to have been breached upon non-payment.",
        voice: "passive",
        explanation: "'Is deemed' and 'to have been breached' are passive constructions stacked together.",
        improved: "Non-payment breaches the agreement.",
        category: "Contracts",
        difficulty: 3
    },
    {
        text: "It cannot be disputed that the defendant had notice.",
        voice: "passive",
        explanation: "'Cannot be disputed' is passive voice. Who cannot dispute it? The construction avoids stating.",
        improved: "No one can dispute that the defendant had notice.",
        category: "Litigation",
        difficulty: 3
    },
    {
        text: "The rights granted herein may be assigned with written consent.",
        voice: "passive",
        explanation: "'May be assigned' is passive. Who may assign the rights? The actor is hidden.",
        improved: "Either party may assign the rights granted herein with written consent.",
        category: "Contracts",
        difficulty: 3
    },
    {
        text: "It has been held that such provisions are enforceable.",
        voice: "passive",
        explanation: "'Has been held' hides who held this. Common in legal writing but still passive.",
        improved: "Courts have held that such provisions are enforceable.",
        category: "Litigation",
        difficulty: 3
    },
    {
        text: "The matter is currently being investigated by authorities.",
        voice: "passive",
        explanation: "'Is being investigated' is passive progressive. The authorities are tucked at the end.",
        improved: "Authorities are currently investigating the matter.",
        category: "Criminal",
        difficulty: 3
    },
    {
        text: "Consideration having been given, the offer is accepted.",
        voice: "passive",
        explanation: "'Having been given' and 'is accepted' are both passive. Who gave and who accepts?",
        improved: "The offeree accepts the offer after giving consideration.",
        category: "Contracts",
        difficulty: 3
    },
    {
        text: "The standard of care expected to be met was not achieved.",
        voice: "passive",
        explanation: "'Expected to be met' and 'was not achieved' stack passive constructions. Very unclear who should meet what.",
        improved: "The defendant failed to meet the expected standard of care.",
        category: "Torts",
        difficulty: 3
    },
    {
        text: "Notice is hereby given that the premises must be vacated.",
        voice: "passive",
        explanation: "'Is hereby given' and 'must be vacated' are passive. A common legal formula but still passive voice.",
        improved: "The landlord hereby gives notice that the tenant must vacate the premises.",
        category: "Real Estate",
        difficulty: 3
    },
    {
        text: "Should any provision be found invalid, it shall be severed.",
        voice: "passive",
        explanation: "'Be found' and 'be severed' are passive. Who finds? Who severs? Both actors hidden.",
        improved: "If a court finds any provision invalid, the parties shall sever it.",
        category: "Contracts",
        difficulty: 3
    },

    // Active - Hard (Could be mistaken for passive)
    {
        text: "The evidence proves the defendant committed fraud.",
        voice: "active",
        explanation: "The evidence (subject) proves (action). Despite the nested clause, the main verb is active.",
        category: "Litigation",
        difficulty: 3
    },
    {
        text: "This Court has consistently rejected such arguments.",
        voice: "active",
        explanation: "The Court (subject) has rejected (action). Present perfect tense but still active voice.",
        category: "Litigation",
        difficulty: 3
    },
    {
        text: "The contract remains in full force and effect.",
        voice: "active",
        explanation: "The contract (subject) remains (action). Linking verbs like 'remains' are active voice.",
        category: "Contracts",
        difficulty: 3
    },
    {
        text: "Plaintiff's claim fails as a matter of law.",
        voice: "active",
        explanation: "The claim (subject) fails (action). Even failure is active when the subject performs it.",
        category: "Litigation",
        difficulty: 3
    },
    {
        text: "The doctrine of res judicata bars this action.",
        voice: "active",
        explanation: "The doctrine (subject) bars (action). Legal doctrines can be active subjects.",
        category: "Litigation",
        difficulty: 3
    },
    {
        text: "Defendant knew or should have known of the danger.",
        voice: "active",
        explanation: "Defendant (subject) knew/should have known (action). Modal constructions can still be active.",
        category: "Torts",
        difficulty: 3
    },
    {
        text: "The Supreme Court overruled its prior decision.",
        voice: "active",
        explanation: "The Court (subject) overruled (action). Clear active voice despite legal formality.",
        category: "Appeals",
        difficulty: 3
    },
    {
        text: "Each party shall bear its own attorneys' fees.",
        voice: "active",
        explanation: "Each party (subject) shall bear (action). 'Shall' with active verb is still active voice.",
        category: "Contracts",
        difficulty: 3
    },
    {
        text: "The fiduciary duty requires disclosure of conflicts.",
        voice: "active",
        explanation: "The duty (subject) requires (action). Abstract legal concepts can actively require things.",
        category: "Corporate",
        difficulty: 3
    },
    {
        text: "Neither party may terminate without cause.",
        voice: "active",
        explanation: "Neither party (subject) may terminate (action). Negative constructions can still be active.",
        category: "Contracts",
        difficulty: 3
    },

    // ========================================
    // Bonus sentences for variety
    // ========================================
    {
        text: "The memorandum was prepared by the associate.",
        voice: "passive",
        explanation: "'Was prepared' is passive. The associate is the actor but appears at the end.",
        improved: "The associate prepared the memorandum.",
        category: "General",
        difficulty: 1
    },
    {
        text: "The deposition was scheduled for next Tuesday.",
        voice: "passive",
        explanation: "'Was scheduled' is passive and doesn't say who scheduled it.",
        improved: "Counsel scheduled the deposition for next Tuesday.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "Our client maintains she never received the documents.",
        voice: "active",
        explanation: "Our client (subject) maintains (action). Active voice with embedded claim.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "The arbitrator rendered a decision in plaintiff's favor.",
        voice: "active",
        explanation: "The arbitrator (subject) rendered (action). Clear, direct, active writing.",
        category: "Arbitration",
        difficulty: 1
    },
    {
        text: "Multiple violations were found during the inspection.",
        voice: "passive",
        explanation: "'Were found' is passive. Who found the violations? The inspector is hidden.",
        improved: "The inspector found multiple violations during the inspection.",
        category: "Regulatory",
        difficulty: 2
    },
    {
        text: "The court reporter transcribed the entire proceeding.",
        voice: "active",
        explanation: "The court reporter (subject) transcribed (action). Active and clear.",
        category: "Litigation",
        difficulty: 1
    },
    {
        text: "An objection should be raised at the earliest opportunity.",
        voice: "passive",
        explanation: "'Should be raised' is passive. Who should raise the objection?",
        improved: "Counsel should raise an objection at the earliest opportunity.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "The settlement agreement resolves all pending claims.",
        voice: "active",
        explanation: "The agreement (subject) resolves (action). Documents can actively do things.",
        category: "Litigation",
        difficulty: 2
    },
    {
        text: "Liability has not been established at this time.",
        voice: "passive",
        explanation: "'Has not been established' is passive. Who has or hasn't established liability?",
        improved: "The plaintiff has not established liability at this time.",
        category: "Litigation",
        difficulty: 3
    },
    {
        text: "The client executed the power of attorney yesterday.",
        voice: "active",
        explanation: "The client (subject) executed (action). 'Execute' in legal context means to sign formally.",
        category: "Estate",
        difficulty: 1
    }
];

// Level tips shown between levels
const LEVEL_TIPS = [
    "TIP: Active voice = Subject + Verb + Object. The subject DOES the action!",
    "TIP: Look for 'by' phrases - they often reveal hidden actors in passive sentences.",
    "TIP: 'Was,' 'were,' 'been,' 'being' + past participle usually signals passive voice.",
    "TIP: In legal writing, active voice assigns responsibility clearly.",
    "TIP: Passive voice isn't always wrong, but active voice is usually stronger.",
    "TIP: Ask 'Who is doing what?' If it's unclear, it might be passive.",
    "TIP: 'It was determined' or 'It is believed' are weak passive constructions.",
    "TIP: Judges prefer active voice - it's clearer and more persuasive!",
    "TIP: Even abstract subjects (The statute, The doctrine) can use active voice.",
    "TIP: Watch out for 'shall be' - it's often passive. 'Party shall pay' is active; 'Payment shall be made' is passive."
];

// Ranks based on accuracy
const RANKS = [
    { threshold: 95, title: "SUPREME COURT JUSTICE", color: "#FFD700" },
    { threshold: 85, title: "SENIOR PARTNER", color: "#C0C0C0" },
    { threshold: 75, title: "ASSOCIATE", color: "#CD7F32" },
    { threshold: 60, title: "LAW CLERK", color: "#00d4ff" },
    { threshold: 40, title: "1L STUDENT", color: "#39ff14" },
    { threshold: 0, title: "PRE-LAW", color: "#ff1493" }
];

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SENTENCES, LEVEL_TIPS, RANKS };
}
