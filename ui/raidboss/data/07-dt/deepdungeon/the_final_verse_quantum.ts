import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Pilgrim's Traverse The Final Verse Quantum
// TODO: Q15-39
// TODO: Light/Dark Vengeance refresh warning
// TODO: Scourging Blaze (exaflares) safe spot
// TODO: Bounds of Sin north/south or east/west dodge direction + in/out
// TODO: Manifold Lashings laser left/right direction

const headMarkerData = {
  // vfx/lockon/eff/lockon5_t0h
  spinelashTarget: '0017',
  // vfx/lockon/eff/m0344trg_a0h
  lightPartnerStack: '004D',
  // vfx/lockon/eff/m0344trg_b0h
  darkPartnerStack: '004E',
  // vfx/lockon/eff/m0376trg_fire3_a0p
  searingChains: '0061',
  // vfx/lockon/eff/share_laser_3sec_0t
  lineStackMarker: '020F', // on boss
} as const;

const tetherData = {
  // chn_fire001f
  hellishEarth: '0005',
  // chn_hfchain1f
  searingChains: '0009',
} as const;

const mapEffectFlags = [
  '00020001', // activation?
  '00080004', // clear flag?
  '00200010', // stand in Abyssal Sun tower?
] as const;
console.assert(mapEffectFlags);

const mapEffectLocations = [
  // Abyssal Sun towers?
  '1B',
  '1C',
  '1E',
  '1D',
  // Bounds of Sin puddles (in pairs)?
  '16',
  '10',
  '17',
  '11',
  '0C',
  '12',
  '13',
  '0D',
  '0E',
  '14',
  '0F',
  '15',
  // Spinelash back-left glass wall?
  '18',
] as const;
console.assert(mapEffectLocations);

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'TheFinalVerseQuantum',
  zoneId: ZoneId.TheFinalVerseQuantum,
  timelineFile: 'the_final_verse_quantum.txt',
  comments: {
    en: 'Q40',
  },
  timelineTriggers: [
    {
      id: 'Final Verse Quantum Abyssal Sun',
      // instant cast
      regex: /Abyssal Sun/,
      beforeSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Towers => AoE + Bleed',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Final Verse Quantum Scourging Blaze',
      type: 'StartsUsing',
      netRegex: { id: 'AC56', source: 'Eminent Grief', capture: false },
      suppressSeconds: 1,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Exaflares',
          ja: 'エクサフレアを避ける',
          ko: '엑사플레어 피하기',
        },
      },
    },
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
      id: 'Final Verse Quantum Ball of Fire Bait',
      type: 'StartsUsing',
      netRegex: { id: ['AC41', 'AC49'], source: 'Eminent Grief', capture: false },
      infoText: (_data, _matches, output) => output.baitPuddles!(),
      outputStrings: {
        baitPuddles: Outputs.baitPuddles,
      },
    },
    {
      id: 'Final Verse Quantum Ball of Fire Move',
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
      id: 'Final Verse Quantum Searing Chains Stack',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData.searingChains, capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack Middle for Chains',
        },
      },
    },
    {
      id: 'Final Verse Quantum Searing Chains Break',
      // 11D3 = Searing Chains
      type: 'GainsEffect',
      netRegex: { effectId: '11D3', capture: true },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Break Chains => AoE + Bleed',
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
    {
      id: 'Final Verse Quantum Shackles of Greater Sanctity',
      type: 'StartsUsing',
      netRegex: { id: 'AF01', source: 'Devoured Eater', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Shackles',
        },
      },
    },
    {
      id: 'Final Verse Quantum Hellish Earth',
      type: 'StartsUsing',
      netRegex: { id: 'AC78', source: 'Eminent Grief', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'AoE + Draw-in',
        },
      },
    },
    {
      id: 'Final Verse Quantum Hellish Earth Tether',
      type: 'Tether',
      netRegex: { id: tetherData.hellishEarth, source: 'Eminent Grief', capture: true },
      infoText: (data, matches, output) => {
        const target = matches.target;
        if (data.me === target)
          return output.tetherOnYou!();
        if (data.role === 'tank')
          return output.tetherOn!({ player: data.party.member(target) });
      },
      outputStrings: {
        tetherOnYou: {
          en: 'Tether on YOU',
        },
        tetherOn: {
          en: 'Tether on ${player}',
        },
      },
    },
    {
      id: 'Final Verse Quantum Manifold Lashings',
      type: 'StartsUsing',
      netRegex: { id: 'AC7F', source: 'Eminent Grief', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '3x Tankbuster + Bleed',
        },
      },
    },
    {
      id: 'Final Verse Quantum Manifold Lashings Laser',
      type: 'StartsUsing',
      netRegex: { id: 'AC81', source: 'Eminent Grief', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Laser',
        },
      },
    },
    {
      id: 'Final Verse Quantum Unholy Darkness',
      type: 'StartsUsing',
      netRegex: { id: ['AC84', 'AC90'], source: 'Devoured Eater', capture: false },
      response: Responses.bleedAoe('alert'),
    },
    {
      id: 'Final Verse Quantum Crime and Punishment',
      type: 'StartsUsing',
      netRegex: { id: 'AC85', source: 'Devoured Eater', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Dark Vengeance',
        },
      },
    },
    {
      id: 'Final Verse Quantum First Sin Bearer',
      type: 'Ability',
      netRegex: { id: 'AC86', source: 'Devoured Eater', capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Sin Bearer on YOU',
        },
      },
    },
    {
      id: 'Final Verse Quantum Sin Bearer Pass Warning',
      // 11D7 = Sin Bearer
      type: 'GainsEffect',
      netRegex: { effectId: '11D7', capture: true },
      condition: (data, matches) => {
        const stackCount = parseInt(matches.count);
        return data.me === matches.target && stackCount === 15;
      },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pass Sin Bearer',
        },
      },
    },
    {
      id: 'Final Verse Quantum Eminent Grief Drain Aether',
      // AC61 = short cast
      // AC62 = long cast
      type: 'StartsUsing',
      netRegex: { id: ['AC61', 'AC62'], source: 'Eminent Grief', capture: true },
      delaySeconds: (_data, matches) =>
        matches.id === 'AC61' ? 0 : parseFloat(matches.castTime) - 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Light Vengeance',
        },
      },
    },
    {
      id: 'Final Verse Quantum Devoured Eater Drain Aether',
      // AC63 = short cast
      // AC65 = long cast
      type: 'StartsUsing',
      netRegex: { id: ['AC63', 'AC65'], source: 'Devoured Eater', capture: true },
      delaySeconds: (_data, matches) =>
        matches.id === 'AC63' ? 0 : parseFloat(matches.castTime) - 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Dark Vengeance',
        },
      },
    },
    {
      id: 'Final Verse Quantum Flameborn Spawn',
      // xxxx = Flameborn
      type: 'AddedCombatant',
      netRegex: { npcNameId: 'xxxx', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait Flameborn',
        },
      },
    },
    {
      id: 'Final Verse Quantum Flameborn Self-Destruct',
      type: 'StartsUsing',
      netRegex: { id: 'AC8B', source: 'Flameborn', capture: false },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Ball of Fire/Chains of Condemnation': 'Ball/Chains',
      },
    },
  ],
};

export default triggerSet;
