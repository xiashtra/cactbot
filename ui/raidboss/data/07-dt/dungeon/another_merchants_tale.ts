import { UnreachableCode } from '../../../../../resources/not_reached';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

const mapEffectData = {
  // Offsets: 238775,246847
  '00': {
    'location': '00',
    // Offsets: 238775,246847
    'flags0': '00020001',
    // Offsets: 246847,253643
    'clear1': '00080004',
    // Offsets: 246847,253643
    'flags2': '00200010',
  },

  // Offsets: 238775
  '01': {
    'location': '01',
    // Offsets: 238775,246847
    'flags0': '00020004',
  },

  // Offsets: 246847,253643
  '02': {
    'location': '02',
    // Offsets: 238775,246847
    'flags0': '00020001',
    // Offsets: 246847,253643
    'clear1': '00080004',
  },

  // Offsets: 246847
  '03': {
    'location': '03',
    // Offsets: 238775,246847
    'flags0': '00020004',
  },

  // Offsets: 238775,246847
  '04': {
    'location': '04',
    // Offsets: 238775,246847
    'flags0': '00020001',
    // Offsets: 246847,253643
    'clear1': '00080004',
  },

  // Offsets: 238775,246847
  '05': {
    'location': '05',
    // Offsets: 238775,246847
    'flags0': '00020004',
  },

  // Offsets: 238775,246847,253643
  '06': {
    'location': '06',
    // Offsets: 238775,246847
    'flags0': '00020001',
    // Offsets: 246847,253643
    'clear1': '00080004',
    // Offsets: 246847,253643
    'flags2': '00200010',
  },

  // Offsets: 238775,246847
  '07': {
    'location': '07',
    // Offsets: 238775,246847
    'flags0': '00020004',
  },

  // Offsets: 238775,246847
  '08': {
    'location': '08',
    // Offsets: 238775,246847
    'flags0': '00020001',
    // Offsets: 246847,253643
    'clear1': '00080004',
  },

  // Offsets: 238775,246847
  '09': {
    'location': '09',
    // Offsets: 238775,246847
    'flags0': '00020004',
  },

  // Offsets: 238775,246847,253643
  '0A': {
    'location': '0A',
    // Offsets: 238775,246847
    'flags0': '00020001',
    // Offsets: 246847,253643
    'clear1': '00080004',
    // Offsets: 246847,253643
    'flags2': '00200010',
  },

  // Offsets: 238775,246847
  '0B': {
    'location': '0B',
    // Offsets: 238775,246847
    'flags0': '00020004',
  },

  // Offsets: 238775,246847
  '0C': {
    'location': '0C',
    // Offsets: 238775,246847
    'flags0': '00020001',
    // Offsets: 246847,253643
    'clear1': '00080004',
  },

  // Offsets: 238775,246847
  '0D': {
    'location': '0D',
    // Offsets: 238775,246847
    'flags0': '00020004',
  },

  // Offsets: 238775,246847,253643
  '0E': {
    'location': '0E',
    // Offsets: 238775,246847
    'flags0': '00020001',
    // Offsets: 246847,253643
    'clear1': '00080004',
    // Offsets: 246847,253643
    'flags2': '00200010',
  },

  // Offsets: 238775,246847
  '0F': {
    'location': '0F',
    // Offsets: 238775,246847
    'flags0': '00020004',
  },
} as const;
console.assert(mapEffectData);

const npcYellData = {
  // Offsets: 234563
  '2CA3': {
    'yellId': '2CA3',
    'text': 'A nap sounds heavenly...',
    'npcIds': ['37C2'],
  },
  // Offsets: 256281
  '2CA6': {
    'yellId': '2CA6',
    'text': 'This ordeal is still going?',
    'npcIds': ['37C2'],
  },
} as const;
console.assert(npcYellData);

const headMarkerData = {
  // Offsets: 110958,225877
  // Vfx Path: bahamut_wyvn_glider_target_02tm
  '0014': '0014',
  // Offsets: 43040,49406
  // Vfx Path: lockon3_t0h
  '0016': '0016',
  // Offsets: 206963
  // Vfx Path: m0376trg_fire3_a0p
  '0061': '0061',
  // Offsets: 49406,51586,148742,151064,182199,185957,188107,192939,196385,198840,204924,278851,284390,289970,296060
  // Vfx Path: m0489trg_a0c
  '0088': '0088',
  // Offsets: 51586,148742,192939,196385,198840,204924
  // Vfx Path: m0489trg_b0c
  '0089': '0089',
  // Offsets: 209851
  // Vfx Path: m0489trg_c0c
  '008A': '008A',
  // Offsets: 260394
  // Vfx Path: com_share3t
  '00A1': '00A1',
  // Offsets: 185957
  // Vfx Path: m0561tag_a0t
  '00B9': '00B9',
  // Offsets: 21242,76282,151064
  // Vfx Path: sph_lockon2_num01_s5p
  '014C': '014C',
  // Offsets: 21242,76282,151064
  // Vfx Path: sph_lockon2_num02_s5p
  '014D': '014D',
  // Offsets: 70715
  // Vfx Path: tank_lockonae_4m_5s_01t
  '0156': '0156',
  // Offsets: 88669,143951
  // Vfx Path: loc08sp_05a_se_c2
  '01F3': '01F3',
  // Offsets: 102795,204924,206963,304207
  // Vfx Path: share_laser_5s_c0w
  '023C': '023C',
  // Offsets: 88669,92787,96828
  // Vfx Path: m0973_turning_right_3sec_c0e1
  '0270': '0270',
  // Offsets: 84741,88669,92787
  // Vfx Path: m0973_turning_left_3sec_c0e1
  '0271': '0271',
  // Offsets: 53671
  // Vfx Path: m0973_turning_right_8sec_c0e1
  '0274': '0274',
  // Offsets: 53671
  // Vfx Path: m0973_turning_left_8sec_c0e1
  '0275': '0275',
  // Offsets: 236653,238775,245739
  // Vfx Path: m6d1_rug01_8s_c0e1
  '0277': '0277',
  // Offsets: 84741,88669,92787,96828
  // Vfx Path: m0973_turning_r_right_3sec_c0e1
  '0284': '0284',
  // Offsets: 84741,88669,92787,96828
  // Vfx Path: m0973_turning_r_left_3sec_c0e1
  '0285': '0285',
  // Offsets: 51586,53671
  // Vfx Path: m0973_turning_r_right_8sec_c0e1
  '0286': '0286',
  // Offsets: 51586,53671
  // Vfx Path: m0973_turning_r_left_8sec_c0e1
  '0287': '0287',
  // Offsets: 21242,76282,151064
  // Vfx Path: lockon5_line_1p
  '028C': '028C',
  // Offsets: 236653
  // Vfx Path: d1086_f_cn_t0p
  '028D': '028D',
} as const;
console.assert(headMarkerData);

const actorControlData = {
  'AB5': 'seahorse', // Seaborn Steed
  'AB7': 'turtle', // Seaborn Steward
  'AB8': 'crab', // Seaborn Soldier
  'AB9': 'bombfish', // Seaborn Servant
  'ABA': 'chocobo', // Seaborn Shrike
} as const;

type Actor = (typeof actorControlData)[keyof typeof actorControlData] | 'unknown';

const echoedSerenadeOutputStrings = {
  seahorse: {
    en: 'Seahorse',
  },
  turtle: {
    en: 'Turtle',
  },
  crab: {
    en: 'Crab',
  },
  bombfish: {
    en: 'Bombfish',
  },
  chocobo: {
    en: 'Chocobo',
  },
} as const;

export interface Data extends RaidbossData {
  echoedSerenade?: Actor[];
  fireflightStackSpread?: 'stack' | 'spread';
  fourLongNightsBaits?: ('close' | 'far')[];
  fourLongNightsRotations?: ('cw' | 'ccw')[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'AnotherMerchantsTale',
  zoneId: ZoneId.AnotherMerchantsTale,
  // timelineFile: 'another_merchants_tale.txt',

  // initData: () => ({
  // }),

  triggers: [
    // ---------------- Darya the Sea-maid ----------------
    {
      id: 'AMT Piercing Plunge',
      // B330 is enrage
      type: 'StartsUsing',
      netRegex: { id: 'B32E', source: 'Darya the Sea-maid', capture: false },
      response: Responses.aoe('alert'),
    },
    {
      id: 'AMT Echoed Serenade',
      type: 'ActorControlExtra',
      netRegex: { category: '00B8', param1: Object.keys(actorControlData), capture: true },
      preRun: (data, matches) => {
        const actor = actorControlData[matches.param1 as keyof typeof actorControlData] ??
          'unknown';
        (data.echoedSerenade ??= []).push(actor);
      },
      durationSeconds: 20,
      infoText: (data, _matches, output) => {
        const echoedSerenade = data.echoedSerenade;
        if (!echoedSerenade || echoedSerenade.length < 4)
          return;

        return output.text!({
          first: output[echoedSerenade[0] ?? 'unknown']!(),
          second: output[echoedSerenade[1] ?? 'unknown']!(),
          third: output[echoedSerenade[2] ?? 'unknown']!(),
          fourth: output[echoedSerenade[3] ?? 'unknown']!(),
        });
      },
      outputStrings: {
        text: {
          en: '${first} => ${second} => ${third} => ${fourth}',
        },
        unknown: Outputs.unknown,
        ...echoedSerenadeOutputStrings,
      },
    },
    {
      id: 'AMT Surging Current',
      type: 'StartsUsing',
      netRegex: { id: 'B329', source: 'Darya the Sea-maid', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid cleaves',
        },
      },
    },
    {
      id: 'AMT Alluring Order',
      type: 'StartsUsing',
      netRegex: { id: 'B325', source: 'Darya the Sea-maid', capture: false },
      response: Responses.aoe('alert'),
    },
    {
      id: 'AMT Echoed Serenade Cleanup',
      // using Swimming in the Air cast to trigger
      type: 'StartsUsing',
      netRegex: { id: 'B315', source: 'Darya the Sea-maid', capture: false },
      run: (data) => delete data.echoedSerenade,
    },
    {
      id: 'AMT Ceaseless Current',
      type: 'StartsUsing',
      netRegex: { id: 'B326', source: 'Darya the Sea-maid', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid exalines + cleaves',
        },
      },
    },
    {
      id: 'AMT Echoed Reprise',
      type: 'StartsUsing',
      netRegex: { id: 'B314', source: 'Darya the Sea-maid', capture: false },
      durationSeconds: 10,
      infoText: (data, _matches, output) => {
        const echoedSerenade = data.echoedSerenade;
        if (!echoedSerenade || echoedSerenade.length < 4)
          return;

        return output.text!({
          first: output[echoedSerenade[0] ?? 'unknown']!(),
          second: output[echoedSerenade[1] ?? 'unknown']!(),
          third: output[echoedSerenade[2] ?? 'unknown']!(),
          fourth: output[echoedSerenade[3] ?? 'unknown']!(),
        });
      },
      outputStrings: {
        text: {
          en: '${first} => ${second} => ${third} => ${fourth}',
        },
        unknown: Outputs.unknown,
        ...echoedSerenadeOutputStrings,
      },
    },
    {
      id: 'AMT Aqua Ball',
      type: 'StartsUsing',
      netRegex: { id: 'B32B', source: 'Darya the Sea-maid', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop 3x AoEs => Spread',
        },
      },
    },
    // ---------------- Lone Swordmaster ----------------
    {
      id: 'AMT Steelsbreath Release',
      type: 'StartsUsing',
      netRegex: { id: ['B65E', 'B680'], source: 'Lone Swordmaster', capture: false },
      response: Responses.aoe('alert'),
    },
    {
      id: 'AMT Near to Heaven',
      type: 'StartsUsing',
      netRegex: { id: ['B9CE', 'B9D0'], source: 'Lone Swordmaster', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '2 marker middle, 1 marker far',
        },
      },
    },
    {
      id: 'AMT Far from Heaven',
      type: 'StartsUsing',
      netRegex: { id: ['B9CF', 'B9D1'], source: 'Lone Swordmaster', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: '1 marker middle, 2 marker far',
        },
      },
    },
    {
      id: 'AMT Echoing Eight',
      type: 'StartsUsing',
      netRegex: { id: 'B673', source: 'Lone Swordmaster', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait starburst => Move',
        },
      },
    },
    {
      id: 'AMT Echoing Orbit',
      type: 'StartsUsing',
      netRegex: { id: 'B670', source: 'Lone Swordmaster', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait puddles => Out => In',
        },
      },
    },
    {
      id: 'AMT Silent Eight',
      type: 'StartsUsing',
      netRegex: { id: 'B677', source: 'Lone Swordmaster', capture: false },
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Bait starburst => Get middle',
        },
      },
    },
    {
      id: 'AMT Maw of the Wolf',
      type: 'StartsUsing',
      netRegex: { id: 'B67B', source: 'Lone Swordmaster', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'AMT Fangs of the Underworld',
      type: 'StartsUsing',
      netRegex: { id: 'B67D', source: 'Lone Swordmaster', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack 3x',
        },
      },
    },
    // ---------------- Pari of Plenty ----------------
    {
      id: 'AMT Heat Burst',
      type: 'StartsUsing',
      netRegex: { id: 'B1CD', source: 'Pari of Plenty', capture: false },
      response: Responses.aoe('alert'),
    },
    {
      id: 'AMT Fireflight by Pyrelight',
      type: 'StartsUsing',
      netRegex: { id: ['B17C', 'B17D'], source: 'Pari of Plenty', capture: false },
      preRun: (data) => data.fireflightStackSpread = 'stack',
      durationSeconds: 18,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack, for later',
        },
      },
    },
    {
      id: 'AMT Fireflight by Emberlight',
      type: 'StartsUsing',
      netRegex: { id: ['B17A', 'B17B'], source: 'Pari of Plenty', capture: false },
      preRun: (data) => data.fireflightStackSpread = 'spread',
      durationSeconds: 18,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread, for later',
        },
      },
    },
    {
      id: 'AMT Sun Circlet',
      type: 'StartsUsing',
      netRegex: { id: 'B188', source: 'Pari of Plenty', capture: false },
      alertText: (data, _matches, output) =>
        output.text!({ stackSpread: data.fireflightStackSpread ?? 'unknown' }),
      run: (data) => delete data.fireflightStackSpread,
      outputStrings: {
        text: {
          en: 'Get Under => ${stackSpread}',
        },
        stack: Outputs.getTogether,
        spread: Outputs.spread,
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AMT Scattered Kindling',
      type: 'StartsUsing',
      netRegex: { id: 'B1E0', source: 'Pari of Plenty', capture: false },
      suppressSeconds: 5,
      response: Responses.spread('alert'),
    },
    {
      id: 'AMT Kindled Flame',
      type: 'StartsUsing',
      netRegex: { id: 'B1E2', source: 'Pari of Plenty', capture: false },
      response: Responses.stackPartner('alert'),
    },
    {
      id: 'AMT Fire of Victory',
      type: 'StartsUsing',
      netRegex: { id: 'B1CF', source: 'Pari of Plenty', capture: true },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMT Fireflight: Four Long Nights Close/Far Baits',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: ['3F4', '3F5'], capture: true },
      preRun: (data, matches) => {
        const bait = matches.count === '3F4' ? 'close' : 'far';
        (data.fourLongNightsBaits ??= []).push(bait);
      },
      durationSeconds: 15,
      infoText: (data, _matches, output) => {
        const baits = data.fourLongNightsBaits;
        if (!baits || baits.length < 4)
          return;

        return output.text!({
          first: output[baits[0] ?? 'unknown']!(),
          second: output[baits[1] ?? 'unknown']!(),
          third: output[baits[2] ?? 'unknown']!(),
          fourth: output[baits[3] ?? 'unknown']!(),
        });
      },
      outputStrings: {
        text: {
          en: 'Baits: ${first} => ${second} => ${third} => ${fourth}',
        },
        close: {
          en: 'Close',
        },
        far: {
          en: 'Far',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AMT Fireflight: Four Long Nights Rotations',
      type: 'HeadMarker',
      netRegex: { id: ['0270', '0271', '0284', '0285'], target: 'Pari of Plenty', capture: true },
      preRun: (data, matches) => {
        let rotation: 'cw' | 'ccw';
        switch (matches.id) {
          case '0270':
            rotation = 'cw';
            break;
          case '0271':
            rotation = 'ccw';
            break;
          case '0284':
            rotation = 'cw';
            break;
          case '0285':
            rotation = 'ccw';
            break;
          default:
            throw new UnreachableCode();
        }
        (data.fourLongNightsRotations ??= []).push(rotation);
      },
      durationSeconds: 15,
      alertText: (data, _matches, output) => {
        const rotations = data.fourLongNightsRotations;
        if (!rotations || rotations.length < 4)
          return;

        const staySwap: ('stay' | 'swap')[] = [];
        for (let i = 0; i < 3; i++) {
          const move = rotations[i] === rotations[i + 1] ? 'stay' : 'swap';
          staySwap.push(move);
        }

        return output.text!({
          first: output[staySwap[0] ?? 'unknown']!(),
          second: output[staySwap[1] ?? 'unknown']!(),
          third: output[staySwap[2] ?? 'unknown']!(),
        });
      },
      outputStrings: {
        text: {
          en: 'Rotations: ${first} => ${second} => ${third}',
        },
        stay: {
          en: 'Stay',
        },
        swap: {
          en: 'Swap',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AMT Pari\'s Curse',
      type: 'StartsUsing',
      netRegex: { id: 'B1EF', source: 'Pari of Plenty', capture: false },
      response: Responses.aoe('alert'),
      run: (data) => {
        delete data.fourLongNightsBaits;
        delete data.fourLongNightsRotations;
      },
    },
    {
      id: 'AMT Spurning Flames',
      type: 'StartsUsing',
      netRegex: { id: 'B1AA', source: 'Pari of Plenty', capture: false },
      response: Responses.aoe('alert'),
    },
    {
      id: 'AMT Scouring Scorn',
      type: 'StartsUsing',
      netRegex: { id: 'B1B3', source: 'Pari of Plenty', capture: false },
      response: Responses.aoe('alert'),
    },
  ],
};

export default triggerSet;
