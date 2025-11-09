import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Pilgrim's Traverse The Final Verse Quantum
// TODO: Q15-39
// TODO: Scourging Blaze (exaflares) safe spot
// TODO: Bounds of Sin north/south or east/west dodge direction + in/out
// TODO: light/dark partner stacks
// TODO: Manifold Lashings laser left/right direction
// TODO: Abyssal Sun get Light Vengeance for towers warning

// === Map Effect info: ===
//
// --- Bounds of Sin puddles ---
//
// locations (inward-facing, center not safe):
//
//       00
//    0B    01
//  0A        02
// 09          03
//  08        04
//    07    05
//       06
//
// locations (outward-facing, center safe):
//
//       0C
//    17    0D
//  16        0E
// 15          0F
//  14        10
//    13    11
//       12
//
// flags:
//
// 00020001 - walls appearing
// 00080004 - walls disappearing
//
// --- Abyssal Sun towers ---
//
// locations:
//
// 1B | 1C
// ---+---
// 1D | 1E
//
// flags:
//
// 00020001 - towers appearing
// 00200010 - standing in a tower
// 00080004 - towers disappearing
// 00800040 - tower exploding from failure to soak?
//
// --- Spinelash glass walls ---
//
// locations:
//
// 18 | 19 | 1A
//
// flags:
//
// 00020001 - glass breaking first time
// 00200010 - glass breaking second time

// const center = {
//   'x': -600,
//   'y': -300,
// } as const;

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

const chainsOfCondemnationOutputStrings = {
  chains: {
    en: 'AoE + Stop Moving!',
    ja: '全体攻撃 + 止まれ!',
    cn: 'AOE + 停止移动!',
    ko: '전체 공격 + 이동 멈추기!',
  },
} as const;

export interface Data extends RaidbossData {
  myVengeanceExpiration?: number;
  sidesMiddle?: 'sides' | 'middle';
  ballChains?: 'ball' | 'chains';
  sinBearer: boolean;
}

const triggerSet: TriggerSet<Data> = {
  id: 'TheFinalVerseQuantum',
  zoneId: ZoneId.TheFinalVerseQuantum,
  timelineFile: 'the_final_verse_quantum.txt',
  comments: {
    en: 'Q40',
  },
  initData: () => ({
    sinBearer: false,
  }),
  timelineTriggers: [
    {
      id: 'Final Verse Quantum Abyssal Sun',
      // instant cast
      regex: /Abyssal Sun/,
      beforeSeconds: 4,
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
      id: 'Final Verse Quantum HP Difference Warning',
      // 9F6 = Damage Up
      // 105F = Rehabilitation
      type: 'GainsEffect',
      netRegex: { effectId: ['9F6', '105F'], capture: false },
      suppressSeconds: 1,
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Check Boss HP Difference',
        },
      },
    },
    {
      id: 'Final Verse Quantum Petrification/Hysteria',
      // 01 = Petrification (failure from Light Vengeance expiring)
      // 128 = Hysteria (failure from Dark Vengeance expiring)
      type: 'GainsEffect',
      netRegex: { effectId: ['01', '128'], capture: true },
      infoText: (_data, matches, output) => {
        const effect = matches.effect;
        const target = matches.target;
        return output.text!({ effect: effect, target: target });
      },
      outputStrings: {
        text: {
          en: '${effect} on ${target}',
        },
      },
    },
    {
      id: 'Final Verse Quantum Light/Dark Vengeance Refresh Warning',
      // 11CF = Dark Vengeance
      // 11D0 = Light Vengeance
      type: 'GainsEffect',
      netRegex: { effectId: ['11CF', '11D0'], capture: true },
      condition: Conditions.targetIsYou(),
      preRun: (data, matches) => {
        const timestamp = Date.parse(matches.timestamp);
        const duration = parseFloat(matches.duration);
        data.myVengeanceExpiration = timestamp + duration * 1000;
      },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 10,
      infoText: (data, matches, output) => {
        const timestamp = Date.parse(matches.timestamp);
        const duration = parseFloat(matches.duration);
        const thisExpiration = timestamp + duration * 1000;
        const myExpiration = data.myVengeanceExpiration;
        if (myExpiration === undefined || myExpiration > thisExpiration)
          return;
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Refresh Vengeance',
        },
      },
    },
    {
      id: 'Final Verse Quantum Scourging Blaze Safe Spot',
      type: 'Ability',
      netRegex: { id: ['AEFD', 'AEFE'], source: 'Eminent Grief', capture: true },
      durationSeconds: 10,
      infoText: (_data, matches, output) => {
        const id = matches.id;
        if (id === 'AEFD')
          return output.text!({ safe: output.front!() });
        return output.text!({ safe: output.back!() });
      },
      outputStrings: {
        text: {
          en: '${safe}, for later',
          ja: '${safe}、あとで',
          cn: '稍后 ${safe}',
          ko: '${safe}, 나중 대비',
        },
        front: {
          en: 'Front safe',
          ja: '前方が安置',
          cn: '前方安全',
          ko: '앞쪽 안전',
        },
        back: {
          en: 'Back safe',
          ja: '後方が安置',
          cn: '后方安全',
          ko: '뒤쪽 안전',
        },
      },
    },
    {
      id: 'Final Verse Quantum Scourging Blaze',
      type: 'StartsUsing',
      netRegex: { id: 'AC56', source: 'Eminent Grief', capture: false },
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Exaflares',
          ja: 'エクサフレアを避ける',
          cn: '躲避地火',
          ko: '엑사플레어 피하기',
        },
      },
    },
    {
      id: 'Final Verse Quantum Blade of First Light',
      type: 'StartsUsing',
      netRegex: { id: ['AC46', 'AC47', 'AC4C', 'AC4D'], source: 'Devoured Eater', capture: true },
      preRun: (data, matches) => {
        const id = matches.id;
        if (id === 'AC46' || id === 'AC4C') {
          data.sidesMiddle = 'sides';
        } else {
          data.sidesMiddle = 'middle';
        }
      },
      durationSeconds: 8,
      alertText: (data, matches, output) => {
        const id = matches.id;
        const ballChains = data.ballChains;
        const sidesMiddle = data.sidesMiddle;
        if (ballChains === undefined || sidesMiddle === undefined)
          return;

        if (id === 'AC46' || id === 'AC47')
          return output.text!({ mech1: output[sidesMiddle]!(), mech2: output[ballChains]!() });
        return output.text!({ mech1: output[ballChains]!(), mech2: output[sidesMiddle]!() });
      },
      outputStrings: {
        text: {
          en: '${mech1} => ${mech2}',
        },
        sides: Outputs.sides,
        middle: Outputs.goIntoMiddle,
        ball: Outputs.baitPuddles,
        ...chainsOfCondemnationOutputStrings,
      },
    },
    {
      id: 'Final Verse Quantum Ball of Fire',
      type: 'StartsUsing',
      netRegex: { id: ['AC41', 'AC49'], source: 'Eminent Grief', capture: true },
      preRun: (data, _matches) => data.ballChains = 'ball',
      durationSeconds: 8,
      alertText: (data, matches, output) => {
        const id = matches.id;
        const ballChains = data.ballChains;
        const sidesMiddle = data.sidesMiddle;
        if (ballChains === undefined || sidesMiddle === undefined)
          return;

        if (id === 'AC41')
          return output.text!({ mech1: output[ballChains]!(), mech2: output[sidesMiddle]!() });
        return output.text!({ mech1: output[sidesMiddle]!(), mech2: output[ballChains]!() });
      },
      outputStrings: {
        text: {
          en: '${mech1} => ${mech2}',
        },
        sides: Outputs.sides,
        middle: Outputs.goIntoMiddle,
        ball: Outputs.baitPuddles,
        ...chainsOfCondemnationOutputStrings,
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
      preRun: (data, _matches) => data.ballChains = 'chains',
      durationSeconds: 8,
      alertText: (data, matches, output) => {
        const id = matches.id;
        const ballChains = data.ballChains;
        const sidesMiddle = data.sidesMiddle;
        if (ballChains === undefined || sidesMiddle === undefined)
          return;

        if (id === 'AC44')
          return output.text!({ mech1: output[ballChains]!(), mech2: output[sidesMiddle]!() });
        return output.text!({ mech1: output[sidesMiddle]!(), mech2: output[ballChains]!() });
      },
      outputStrings: {
        text: {
          en: '${mech1} => ${mech2}',
        },
        sides: Outputs.sides,
        middle: Outputs.goIntoMiddle,
        ball: Outputs.baitPuddles,
        ...chainsOfCondemnationOutputStrings,
      },
    },
    {
      id: 'Final Verse Quantum Blade/Ball/Chains Cleanup',
      type: 'Ability',
      netRegex: {
        id: ['AC4E', 'AC49', 'AC4B'],
        source: ['Eminent Grief', 'Devoured Eater'],
        capture: false,
      },
      suppressSeconds: 1,
      run: (data, _matches) => {
        delete data.ballChains;
        delete data.sidesMiddle;
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
      id: 'Final Verse Quantum Arcane Font Spawn',
      // 14042 = Arcane Font
      type: 'AddedCombatant',
      netRegex: { npcNameId: '14042', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds(),
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
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid laser',
          ja: 'レーザーを避ける',
          cn: '避开激光',
          ko: '레이저 피하기',
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
      infoText: (data, matches, output) => {
        const target = matches.target;
        if (target === undefined)
          return output.sinBearer!();
        if (target === data.me)
          return output.sinBearerOnYou!();
        return output.sinBearerOnTarget!({ player: data.party.member(target) });
      },
      outputStrings: {
        sinBearerOnYou: {
          en: 'Sin Bearer on YOU',
        },
        sinBearerOnTarget: {
          en: 'Sin Bearer on ${player}',
        },
        sinBearer: {
          en: 'Sin Bearer',
        },
      },
    },
    {
      id: 'Final Verse Quantum Sin Bearer Pass Warning',
      // 11D7 = Sin Bearer
      type: 'GainsEffect',
      netRegex: { effectId: '11D7', capture: true },
      condition: (data, matches) => {
        const stackCount = parseInt(matches.count, 16);
        const target = matches.target;
        return target === data.me && stackCount === 14;
      },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pass Sin Bearer',
        },
      },
    },
    {
      id: 'Final Verse Quantum Sin Bearer Gain',
      // 11D7 = Sin Bearer
      type: 'GainsEffect',
      netRegex: { effectId: '11D7', capture: true },
      condition: Conditions.targetIsYou(),
      run: (data, _matches) => data.sinBearer = true,
    },
    {
      id: 'Final Verse Quantum Sin Bearer Lose',
      // 11D7 = Sin Bearer
      type: 'LosesEffect',
      netRegex: { effectId: '11D7', capture: true },
      condition: Conditions.targetIsYou(),
      run: (data, _matches) => data.sinBearer = false,
    },
    {
      id: 'Final Verse Quantum Doom',
      // 11F2 = Doom
      type: 'GainsEffect',
      netRegex: { effectId: '11F2', capture: true },
      condition: (data) => data.CanCleanse(),
      alertText: (data, matches, output) => {
        return output.text!({ player: data.party.member(matches.target) });
      },
      outputStrings: {
        text: {
          en: 'Cleanse ${player}',
          de: 'Reinige ${player}',
          fr: 'Guérissez ${player}',
          cn: '康复 ${player}',
          ko: '${player} 디버프 해제',
        },
      },
    },
    {
      id: 'Final Verse Quantum Eminent Grief Drain Aether',
      // AC61 = short cast
      // AC62 = long cast
      type: 'StartsUsing',
      netRegex: { id: ['AC61', 'AC62'], source: 'Eminent Grief', capture: true },
      condition: (data) => !data.sinBearer,
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
      // 14041 = Flameborn
      type: 'AddedCombatant',
      netRegex: { npcNameId: '14041', capture: false },
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
      response: Responses.aoe('alert'),
    },
    // {
    //   id: 'Final Verse Quantum StartsUsing Debug',
    //   type: 'StartsUsing',
    //   netRegex: { id: ['AC5B', 'AC5C'], capture: true },
    //   infoText: (_data, matches, output) => {
    //     const id = matches.id;
    //     const ability = matches.ability;
    //     return output.text!({ id: id, ability: ability });
    //   },
    //   outputStrings: {
    //     text: {
    //       en: 'StartsUsing - ${id}: ${ability}',
    //     },
    //   },
    // },
    // {
    //   id: 'Final Verse Quantum Ability Debug',
    //   type: 'Ability',
    //   netRegex: { id: ['AC5B', 'AC5C'], capture: true },
    //   infoText: (_data, matches, output) => {
    //     const id = matches.id;
    //     const ability = matches.ability;
    //     return output.text!({ id: id, ability: ability });
    //   },
    //   outputStrings: {
    //     text: {
    //       en: 'Ability - ${id}: ${ability}',
    //     },
    //   },
    // },
    // {
    //   id: 'Final Verse Quantum MapEffect Debug',
    //   type: 'MapEffect',
    //   netRegex: { location: ['0[0-F]', '1[0-7]'], capture: true },
    //   durationSeconds: 10,
    //   suppressSeconds: 5,
    //   infoText: (_data, matches, output) => {
    //     const flags = matches.flags;
    //     const location = matches.location;
    //     return output.text!({ flags: flags, location: location });
    //   },
    //   outputStrings: {
    //     text: {
    //       en: 'Map Effect - ${flags}: ${location}',
    //     },
    //   },
    // },
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
