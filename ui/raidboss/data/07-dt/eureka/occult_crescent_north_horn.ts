import Conditions from '../../../../../resources/conditions';
// import PhantomJobUtils from '../../../../../resources/occult_crescent_common';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// @TODO:
// - FATEs: all
// - CEs: all
// - Forked Tower: Magic: all
// - Forked Tower: Magic (Extreme)
//   - Two-headed Aevis
//     - timeline
//     - Crossblaze/Blazeloop
//     - Two Terrors
//     - Breathy Duet
//     - Arcane Revelation 2
//     - Hissing Resonance + Crossblaze/Blazeloop
//   - Sword Dancer
//     - timeline
//     - Cycloswords Unsheathed 1
//     - Sword Dance start/dodge direction
//     - Leaping Lift
//     - Cycloswords Unsheathed 2
//     - Cycloswords Unsheathed 3
//   - Storm Generators
//     - fatal onslaught dodge direction/warning
//     - Tower Slime: The First Song (pBRD interrupt for center platform only)
//     - Storm Generator: Calamitous Thunderclap (kill at same time enrage warning?)
//   - Necrophobia
//     - timeline
//     - Death Shroud 1
//     - Dark Current
//     - Death Shroud 2
//     - Death Shroud 3
//   - Clockwards: puzzle
//   - Index
//     - timeline
//     - Quadrilogy of Implements
//     - Omni-elements 1
//     - Predict orb/donut locations
//     - adds + exaflares
//     - Omni-elements 2

export interface Data extends RaidbossData {
  ce?: string;
  phantomJob?: string;
  phantomJobLevel?: number;
  forkedBossTracker?:
    | 'twoHeadedAevis'
    | 'swordDancer'
    | 'stormGenerators'
    | 'necrophobia'
    | 'clockwards'
    | 'index';
  archaeofuryTargets?: string[];
  entrapCast?: boolean;
}

// List of events:
// https://github.com/xivapi/ffxiv-datamining/blob/master/csv/en/DynamicEvent.csv
//
// These ids are (unfortunately) gathered by hand and don't seem to correlate
// to any particular bits of data.  However, there's a game log message when you
// register for a CE and an 0x21 message with this id when you accept and
// teleport in.  This avoids having to translate all of these names and also
// guarantees that the player is actually in the CE for the purpose of
// filtering triggers.
const ceIds: { [ce: string]: string } = {
  manyMouthsToFeed: '39B',
  doubledTrouble: '398',
  quarriedAway: '397',
  forbiddenFolios: '39A',
  cursedResurgence: '3B9',
  imbalancedDiet: '3BF',
  webOfTerror: '3CA',
  aBeastUnleashed: '3C0',
  darkArtistry: '3A8',
  familiarTactics: '390',
  appallingBehavior: '3BA',
  tinyTerror: '3CC',
  lostOnTheWind: '3A9',
  aheadOfTheCompetition: '3BC',
  acceptNoImitators: '3CB',
  // Forked Tower: Magic and Forked Tower: Magic (Extreme) share CE IDs.
  twoHeadedAevis: '389',
  lowerVestibule: '38D',
  swordDancer: '38A',
  centralMezzanine: '38E',
  necrophobia: '38B',
  upperVeil: '38F',
  theIndex: '38C',
};

/*
const headMarkerData = {
} as const;
*/

// Used to filter the GainsEffect for Phantom Job Tracker
const phantomJobEffectIds = [
  '1092', // Freelancer
  '1106', // Knight
  '1107', // Berserker
  '1108', // Monk
  '1109', // Ranger
  '1110', // Oracle
  '1111', // Thief
  '110A', // Samurai
  '110B', // Bard
  '110C', // Geomancer
  '110D', // Time Mage
  '110E', // Cannonneer
  '110F', // Chemist
  '12C3', // Mystic Knight
  '12C4', // Gladiator
  '12C5', // Dancer
  '14D0', // Ninja
  '14D1', // White Mage
  '14D2', // Black Mage
  '14D3', // Dragoon
  '14D4', // Summoner
  '14D5', // Blue Mage
  '14D6', // Red Mage
  '14D7', // Necromancer
];

const triggerSet: TriggerSet<Data> = {
  id: 'TheOccultCrescentNorthHorn',
  zoneId: ZoneId.TheOccultCrescentNorthHorn,
  comments: {
    en: 'Occult Crescent North Horn FATEs/CEs/Forked Tower: Magic (N & EX) triggers/timelines.',
  },
  timelineFile: 'occult_crescent_north_horn.txt',
  initData: () => ({}),
  resetWhenOutOfCombat: false,
  timelineTriggers: [],
  triggers: [
    // ================================= Setup =================================
    {
      id: 'North Horn Critical Encounter',
      type: 'ActorControl',
      netRegex: { command: '80000014', capture: true },
      run: (data, matches) => {
        // This fires when you win, lose, or teleport out.
        if (matches.data0 === '00') {
          if (data.ce !== undefined && data.options.Debug)
            console.log(`Stop CE: ${data.ce}`);
          // Stop any active timelines.
          data.StopCombat();
          // Prevent further triggers for any active CEs from firing.
          delete data.ce;
          return;
        }

        delete data.ce;
        const ceId = matches.data0.toUpperCase();
        for (const key in ceIds) {
          if (ceIds[key] === ceId) {
            if (data.options.Debug)
              console.log(`Start CE: ${key} (${ceId})`);
            data.ce = key;
            return;
          }
        }

        if (data.options.Debug)
          console.log(`Start CE: ??? (${ceId})`);
      },
    },
    {
      id: 'North Horn Phantom Job Tracker',
      // count also contains a Phantom Job id and level, it's supposed to be two bytes but has weird padding in logs
      // Expecting first two characters to be part of Phantom Job id, and the later two to be the level
      // First digit (South Horn jobs) and first two (North Horn jobs) are the job:
      // Introduced in North Horn:
      // Necromancer = 17
      // Red Mage = 16
      // Blue Mage = 15
      // Summoner = 14
      // Dragoon = 13
      // Black Mage = 12
      // White Mage = 11
      // Ninja = 10
      // Introduced in South Horn:
      // Dancer = F
      // Gladiator = E
      // Mystic Knight = D
      // Thief = C
      // Oracle = B
      // Chemist = A
      // Cannoneer = 9
      // Time Mage = 8
      // Geomancer = 7
      // Bard = 6
      // Samurai = 5
      // Ranger = 4
      // Monk = 3
      // Berserker = 2
      // Knight = 1
      // Freelancer = null
      // Freelancer level is accumulation of maxed jobs +1, can also be inferred from stacks of Phantom Mastery (1082)
      type: 'GainsEffect',
      netRegex: { effectId: [...phantomJobEffectIds], capture: true },
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.phantomJob = matches.effectId;
        const jobData = matches.count?.padStart(4, '0');

        // Assuming this isn't possible given the filter on statuses
        if (jobData === undefined)
          return;

        data.phantomJobLevel = parseInt(jobData.slice(2), 16);
      },
    },
    {
      id: 'North Horn FTM/FTMex Clear Data',
      type: 'SystemLogMessage',
      // "is no longer sealed"
      netRegex: { id: '7DE', capture: false },
      run: (data) => {
        delete data.forkedBossTracker;
        delete data.archaeofuryTargets;
        delete data.entrapCast;
      },
    },
    // ================================= FATEs =================================
    // ================================== CEs ==================================
    // -------------------------- Many Mouths to Feed --------------------------
    // ---------------------------- Doubled Trouble ----------------------------
    // ----------------------------- Quarried Away -----------------------------
    // --------------------------- Forbidden Folios ----------------------------
    // --------------------------- Cursed Resurgence ---------------------------
    // ---------------------------- Imbalanced Diet ----------------------------
    // ----------------------------- Web of Terror -----------------------------
    // --------------------------- A Beast Unleashed ---------------------------
    // ----------------------------- Dark Artistry -----------------------------
    // --------------------------- Familiar Tactics ----------------------------
    // -------------------------- Appalling Behavior ---------------------------
    // ------------------------------ Tiny Terror ------------------------------
    // --------------------------- Lost on the Wind ----------------------------
    // ----------------------- Ahead of the Competition ------------------------
    // -------------------------- Accept No Imitators --------------------------
    // ========================== Forked Tower: Magic ==========================
    // --------------------------- Two-headed Aevis ----------------------------
    // ------------------------------ hallways 1 -------------------------------
    // ----------------------------- Sword Dancer ------------------------------
    // ------------------------------ hallways 2 -------------------------------
    // ------------------------------ Necrophobia ------------------------------
    // ------------------------------ hallways 3 -------------------------------
    // --------------------------------- Index ---------------------------------
    // ===================== Forked Tower: Magic (Extreme) =====================
    {
      id: 'North Horn FTMex Boss Tracker',
      type: 'SystemLogMessage',
      // "will be sealed off"
      netRegex: {
        id: '7DC',
        param1: ['1573', '1574', '1575', '1576', '1577', '1578'],
        capture: true,
      },
      run: (data, matches) => {
        switch (matches.param1) {
          case '1573':
            data.forkedBossTracker = 'twoHeadedAevis';
            break;
          case '1574':
            data.forkedBossTracker = 'swordDancer';
            break;
          case '1575':
            data.forkedBossTracker = 'necrophobia';
            break;
          case '1576':
            data.forkedBossTracker = 'index';
            break;
          case '1577':
            data.forkedBossTracker = 'stormGenerators';
            break;
          case '1578':
            data.forkedBossTracker = 'clockwards';
            break;
        }
      },
    },
    // -------------------------- Two-headed Aevis EX --------------------------
    {
      id: 'North Horn FTMex Two-headed Aevis Tethered Boss',
      type: 'GainsEffect',
      // 1060 = Epic Hero
      // 1062 = Fated Hero
      netRegex: { effectId: ['1060', '1062'], capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        const target = matches.effectId === '1060' ? 'green' : 'blue';
        return output.text!({ target: output[target]!() });
      },
      outputStrings: {
        text: {
          en: 'Attack ${target}',
        },
        green: {
          en: 'Green Head',
        },
        blue: {
          en: 'Blue Head',
        },
      },
    },
    {
      id: 'North Horn FTMex Two-headed Aevis Poison Breath',
      type: 'StartsUsing',
      netRegex: { source: 'Blue Head', id: 'BA17', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'North Horn FTMex Two-headed Aevis Storm\'s Breath',
      type: 'StartsUsing',
      netRegex: { source: 'Green Head', id: 'BA16', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback + Away from boss',
        },
      },
    },
    {
      id: 'North Horn FTMex Two-headed Aevis Thunderfrost Tempest',
      type: 'StartsUsing',
      netRegex: { source: ['Green Head', 'Blue Head'], id: 'BA7B', capture: false },
      suppressSeconds: 1,
      response: Responses.bigAoe('alarm'),
    },
    {
      id: 'North Horn FTMex Two-headed Aevis Archaeofury',
      type: 'HeadMarker',
      // 0158 tank_lockonae_6m_5s_01t Archaeofury tankbuster target (shared with Index)
      netRegex: { id: '0158', capture: true },
      condition: (data) => data.forkedBossTracker === 'twoHeadedAevis',
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tankCleavesOnPlayers: {
            en: 'Tank Cleaves on ${target1}, ${target2}',
          },
          tankCleaveOnYou: Outputs.tankCleaveOnYou,
        };

        (data.archaeofuryTargets ??= []).push(matches.target);
        if (data.archaeofuryTargets.length < 2)
          return;

        const target1 = data.archaeofuryTargets[0];
        const target2 = data.archaeofuryTargets[1];
        delete data.archaeofuryTargets;

        if (data.me === target1 || data.me === target2)
          return { alertText: output.tankCleaveOnYou!() };

        return {
          infoText: output.tankCleavesOnPlayers!({
            target1: data.party.member(target1),
            target2: data.party.member(target2),
          }),
        };
      },
    },
    // ----------------------------- hallways 1 EX -----------------------------
    {
      id: 'North Horn FTMex Tower Crusader Spawn',
      // needs to be restricted to left/right hallways
      type: 'AddedCombatant',
      // 14803 = Tower Crusader
      netRegex: { npcNameId: '14803', capture: true },
      infoText: (_data, matches, output) => output.spawn!({ name: matches.name }),
      outputStrings: {
        spawn: {
          en: '${name} spawned!',
        },
      },
    },
    // ---------------------------- Sword Dancer EX ----------------------------
    {
      id: 'North Horn FTMex Sword Dancer Sword Storm',
      type: 'StartsUsing',
      netRegex: { source: 'Sword Dancer', id: 'C20B', capture: false },
      response: Responses.bigAoe('alarm'),
    },
    {
      id: 'North Horn FTMex Sword Dancer Martial Mystique Front Cleave',
      type: 'StartsUsing',
      netRegex: { source: 'Sword Dancer', id: 'C1E9', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'North Horn FTMex Sword Dancer Martial Mystique Back Cleave',
      type: 'StartsUsing',
      netRegex: { source: 'Sword Dancer', id: 'C1EA', capture: false },
      response: Responses.goFront(),
    },
    {
      id: 'North Horn FTMex Sword Dancer Martial Mystique Right Cleave',
      type: 'StartsUsing',
      netRegex: { source: 'Sword Dancer', id: 'C1EB', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'North Horn FTMex Sword Dancer Martial Mystique Left Cleave',
      type: 'StartsUsing',
      netRegex: { source: 'Sword Dancer', id: 'C1EC', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'North Horn FTMex Sword Dancer Sword Dance',
      type: 'StartsUsing',
      netRegex: { source: 'Sword Dancer', id: 'C203', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'AoE x4',
        },
      },
    },
    // ----------------------------- hallways 2 EX -----------------------------
    {
      id: 'North Horn FTMex Lockward Entrap',
      type: 'StartsUsing',
      netRegex: { source: 'Lockward', id: 'BECC', capture: true },
      condition: (data) => !data.entrapCast,
      response: Responses.interruptIfPossible(),
      run: (data) => data.entrapCast = true,
    },
    // -------------------------- Storm Generators EX --------------------------
    {
      id: 'North Horn FTMex Storm Generator Thunderclap Concerto',
      type: 'StartsUsing',
      netRegex: { source: 'Storm Generator', id: 'BECF', capture: true },
      suppressSeconds: 1,
      response: Responses.interruptIfPossible(),
    },
    // ---------------------------- Necrophobia EX -----------------------------
    {
      id: 'North Horn FTMex Necrophobia Hail of Hellflares',
      type: 'StartsUsing',
      netRegex: { source: 'Necrophobia', id: 'B97A', capture: false },
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Big AoE x5',
        },
      },
    },
    {
      id: 'North Horn FTMex Necrophobia Vacuum Wave',
      type: 'StartsUsing',
      netRegex: { source: 'Necrophobia', id: 'B98E', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'North Horn FTMex Necrophobia Corpse Mangler',
      type: 'StartsUsing',
      netRegex: { source: 'Necrophobia', id: 'B991', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'North Horn FTMex Necrophobia Fertile Ground AoE',
      type: 'StartsUsing',
      netRegex: { source: 'Necrophobia', id: 'B99A', capture: false },
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'North Horn FTMex Necrophobia Fertile Ground First Soak',
      type: 'GainsEffect',
      // 1410 = Growing Dread
      // 1411 = Growing Panic
      netRegex: { effectId: ['1410', '1411'], capture: true },
      condition: Conditions.targetIsYou(),
      suppressSeconds: 9999,
      infoText: (_data, matches, output) => {
        const soak = matches.effectId === '1410' ? 'purple' : 'blue';
        return output.text!({ color: output[soak]!() });
      },
      outputStrings: {
        text: {
          en: 'Soak ${color} first',
        },
        purple: {
          en: 'Purple',
        },
        blue: {
          en: 'Blue',
        },
      },
    },
    {
      id: 'North Horn FTMex Necrophobia Ancient Fire III',
      type: 'StartsUsing',
      netRegex: { source: 'Necrophobia', id: 'B9A1', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'North Horn FTMex Necrophobia Ancient Blizzard III',
      type: 'StartsUsing',
      netRegex: { source: 'Necrophobia', id: 'B9A2', capture: false },
      response: Responses.getIntercards(),
    },
    {
      id: 'North Horn FTMex Necrophobia Ancient Thunder III',
      type: 'StartsUsing',
      netRegex: { source: 'Necrophobia', id: 'B9A3', capture: false },
      response: Responses.getCardinals(),
    },
    // ----------------------------- Clockwards EX -----------------------------
    {
      id: 'North Horn FTMex Lockward Bolting Hammer',
      type: 'StartsUsing',
      netRegex: { source: 'Lockward', id: 'BED4', capture: false },
      response: Responses.aoe('alert'),
    },
    // ------------------------------- Index EX --------------------------------
    {
      id: 'North Horn FTMex Index Flare',
      type: 'StartsUsing',
      // this is always Dualcast in FTMex
      netRegex: { source: 'Index', id: 'BD1F', capture: false },
      response: Responses.bigAoe('alert'),
    },
    {
      id: 'North Horn FTMex Index Shockwave',
      type: 'StartsUsing',
      netRegex: { source: 'Index', id: 'BD3F', capture: false },
      suppressSeconds: 1,
      response: Responses.knockback(),
    },
    {
      id: 'North Horn FTMex Index All-knowing Flames',
      type: 'StartsUsing',
      netRegex: { source: 'Index', id: 'C528', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait AoEs on home platform',
        },
      },
    },
    {
      id: 'North Horn FTMex Index All-mighty Flames',
      type: 'HeadMarker',
      // 0158 tank_lockonae_6m_5s_01t All-knowing Flames tankbuster target (shared with Two-headed Aevis)
      netRegex: { id: '0158', capture: true },
      condition: (data, matches) => {
        return (data.forkedBossTracker === 'index' && data.me === matches.target);
      },
      response: Responses.tankCleave(),
    },
    {
      id: 'North Horn FTMex Index All-consuming Flames',
      type: 'HeadMarker',
      // 01D2 loc06sp_05ak1 All-knowing Flames non-tankbuster target
      netRegex: { id: '01D2', capture: true },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'North Horn FTMex Index Omni-elements AoE',
      type: 'StartsUsing',
      netRegex: { source: 'Index', id: 'BD0A', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'North Horn FTMex Index Predict Player Markers',
      type: 'HeadMarker',
      // 029E m0947_ring_fi_c0p fire/ice
      // 029F m0947_ring_it_c0p lightning/ice
      // 02A0 m0947_ring_tf_c0p lightning/fire
      netRegex: { id: ['029E', '029F', '02A0'], capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, matches, output) => {
        switch (matches.id) {
          case '029E':
            return output.text!({ element: output['lightning']!() });
          case '029F':
            return output.text!({ element: output['fire']!() });
          case '02A0':
            return output.text!({ element: output['ice']!() });
        }
      },
      outputStrings: {
        text: {
          en: 'Stand on ${element}',
        },
        lightning: {
          en: 'Lightning',
        },
        fire: {
          en: 'Fire',
        },
        ice: {
          en: 'Ice',
        },
      },
    },
    {
      id: 'North Horn FTMex Index Romeo\'s Ballad',
      type: 'StartsUsing',
      netRegex: { source: 'Index', id: 'BD26', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'North Horn FTMex Index Aim',
      type: 'StartsUsing',
      netRegex: { source: 'Index', id: 'BD27', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'North Horn FTMex Index Elementary Absorption First Soak',
      type: 'Ability',
      // instant cast
      netRegex: { source: 'Index', id: 'BD33', capture: false },
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Prepare for first soak',
        },
      },
    },
    {
      id: 'North Horn FTMex Index Elementary Absorption Rotate',
      type: 'GainsEffect',
      // 1421 = Elementary Deficiency
      netRegex: { effectId: '1421', capture: true },
      condition: (data, matches) => {
        return (data.me === matches.target && parseInt(matches.count) < 3);
      },
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Rotate',
        },
      },
    },
    {
      id: 'North Horn FTMex Index Elementary Chemistry AoE',
      type: 'StartsUsing',
      netRegex: { source: 'Index', id: 'BD32', capture: true },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 6,
      response: Responses.bigAoe('alarm'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Poison Breath/Storm\'s Breath': 'Poison/Storm\'s Breath',
        'Fulgurous Fugue/Freezing Fugue': 'Fulgurous/Freezing Fugue',
      },
    },
  ],
};

export default triggerSet;
