// import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Pilgrim's Traverse The Final Verse Quantum
// TODO: Q15-39

const headMarkerData = {
  // lockon5_t0h
  spinelashTarget: '0017',
  // m0344trg_a0h
  lightPartnerStack: '004D',
  // m0344trg_b0h
  darkPartnerStack: '004E',
  // m0376trg_fire3_a0p
  searingChains: '0061',
  // share_laser_3sec_0t
  lineStackMarker: '020F', // on boss
} as const;
console.assert(headMarkerData);

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'TheFinalVerseQuantum',
  zoneId: ZoneId.TheFinalVerseQuantum,
  timelineFile: 'the_final_verse_quantum.txt',
  comments: {
    en: 'Q40 only',
  },

  triggers: [
    {
      id: 'Final Verse Quantum Blade of First Light',
      type: 'StartsUsing',
      netRegex: { id: ['AC46', 'AC47', 'AC4C', 'AC4D'], source: 'Devoured Eater', capture: true },
      alertText: (_data, matches, output) => {
        const id = matches.id;
        if (id === 'AC46' || id === 'AC4C')
          return output.sides!();
        return output.middle!();
      },
      outputStrings: {
        sides: Outputs.sides,
        middle: Outputs.goIntoMiddle,
      },
    },
    {
      id: 'Final Verse Quantum Ball of Fire',
      type: 'Ability',
      netRegex: { id: ['AC41', 'AC49'], source: 'Eminent Grief', capture: false },
      response: Responses.moveAway('alert'),
    },
    {
      id: 'Final Verse Quantum Chains of Condemnation',
      // raidwide + applies 11D2 Chains of Condemnation for 2s; heavy damage if moving
      type: 'StartsUsing',
      netRegex: { id: ['AC44', 'AC4B'], source: 'Eminent Grief', capture: true },
      countdownSeconds: (_data, matches) => parseFloat(matches.castTime),
      durationSeconds: (_data, matches) => parseFloat(matches.castTime) + 2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'AoE + Stop Moving!',
          ko: '전체 공격 + 이동 멈추기!',
        },
      },
    },
    {
      id: 'Final Verse Quantum Spinelash',
      // wildcharge
      type: 'HeadMarker',
      netRegex: { id: headMarkerData.spinelashTarget, capture: true },
      alertText: (data, matches, output) => {
        const target = matches.target;
        if (target === undefined)
          return output.stackMarker!();
        if (target === data.me)
          return output.stackOnYou!();
        return output.stackOnTarget!({ player: data.party.member(target) });
      },
      outputStrings: {
        stackOnYou: {
          en: 'Stack on YOU, Tank in Front',
        },
        stackOnTarget: {
          en: 'Stack on ${player}, Tank in Front',
        },
        stackMarker: {
          en: 'Stack, Tank in Front',
        },
      },
    },
    {
      id: 'Final Verse Quantum Vodoriga Minion Spawn',
      // 14039 = Vodoriga Minion
      type: 'AddedCombatant',
      netRegex: { npcNameId: '14039', capture: false },
      response: Responses.killAdds(),
    },
  ],
};

export default triggerSet;
