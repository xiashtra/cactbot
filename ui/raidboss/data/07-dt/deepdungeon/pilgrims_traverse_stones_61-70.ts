import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import { Directions } from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Pilgrim's Traverse Stones 61-70

type DirectionOutputCardinalRelative =
  | 'front'
  | 'right'
  | 'back'
  | 'left'
  | 'unknown';

const outputCardinalRelativeDir: DirectionOutputCardinalRelative[] = [
  'front',
  'right',
  'back',
  'left',
];

const outputRelativeFrom4DirNum = (dirNum: number): DirectionOutputCardinalRelative => {
  return outputCardinalRelativeDir[dirNum] ?? 'unknown';
};

export interface Data extends RaidbossData {
  octupleSwipes?: number[];
  calledOctupleSwipes?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  id: 'PilgrimsTraverseStones61_70',
  zoneId: ZoneId.PilgrimsTraverseStones61_70,

  triggers: [
    // ---------------- Stone 61-69 Mobs ----------------
    {
      id: 'PT 61-70 Forgiven Doubt Body Press',
      type: 'StartsUsing',
      netRegex: { id: 'AECC', source: 'Forgiven Doubt', capture: false },
      response: Responses.outOfMelee(),
    },
    {
      id: 'PT 61-70 Traverse Cliffmole Head Butt',
      type: 'StartsUsing',
      netRegex: { id: 'AEC4', source: 'Traverse Cliffmole', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'PT 61-70 Forgiven Riot Right-sided Shockwave',
      type: 'StartsUsing',
      netRegex: { id: 'A4E6', source: 'Forgiven Riot', capture: false },
      response: Responses.goLeftThenRight(),
    },
    {
      id: 'PT 61-70 Forgiven Riot Left-sided Shockwave',
      type: 'StartsUsing',
      netRegex: { id: 'A4E8', source: 'Forgiven Riot', capture: false },
      response: Responses.goRightThenLeft(),
    },
    {
      id: 'PT 61-70 Traverse Gnome Plain Pound',
      type: 'StartsUsing',
      netRegex: { id: 'AED1', source: 'Traverse Gnome', capture: false },
      response: Responses.outOfMelee(),
    },
    {
      id: 'PT 61-70 Forgiven Grudge Crystalline Stingers',
      type: 'StartsUsing',
      netRegex: { id: 'A610', source: 'Forgiven Grudge', capture: true },
      response: Responses.stunIfPossible(),
    },
    {
      id: 'PT 61-70 Forgiven Grudge Hailfire',
      type: 'StartsUsing',
      netRegex: { id: 'A613', source: 'Forgiven Grudge', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'PT 61-70 Traverse Talos Accelerate',
      // follows-up with A615 Subduction PBAoE, then A616 Settling Stone donut (both instant cast)
      type: 'StartsUsing',
      netRegex: { id: 'A614', source: 'Traverse Talos', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from jump => Get Under or Out',
        },
      },
    },
    {
      id: 'PT 61-70 Forgiven Attachment Sewer Water Front',
      type: 'StartsUsing',
      netRegex: { id: 'AECE', source: 'Forgiven Attachment', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'PT 61-70 Forgiven Attachment Sewer Water Back',
      type: 'StartsUsing',
      netRegex: { id: 'AECF', source: 'Forgiven Attachment', capture: false },
      response: Responses.goFront('alert'),
    },
    {
      id: 'PT 61-70 Forgiven Contention Several Thousand Needles',
      type: 'StartsUsing',
      netRegex: { id: 'A4EC', source: 'Forgiven Contention', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'PT 61-70 Forgiven Imparity Rockslide',
      type: 'StartsUsing',
      netRegex: { id: 'AEC7', source: 'Forgiven Imparity', capture: false },
      response: Responses.getIntercards(),
    },
    {
      id: 'PT 61-70 Traverse Queen Unfinal Sting',
      type: 'StartsUsing',
      netRegex: { id: 'A60E', source: 'Traverse Queen', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'PT 61-70 Traverse Queen Final Sting',
      // enrage on targeted player
      type: 'StartsUsing',
      netRegex: { id: 'A60F', source: 'Traverse Queen', capture: true },
      alertText: (data, matches, output) => {
        const target = matches.target;
        if (target === undefined)
          return output.sting!();
        if (target === data.me)
          return output.stingOnYou!();
        return output.stingOnPlayer!({ player: data.party.member(target) });
      },
      outputStrings: {
        sting: {
          en: 'Final Sting',
        },
        stingOnYou: {
          en: 'Final Sting on YOU',
        },
        stingOnPlayer: {
          en: 'Final Sting on ${player}',
        },
      },
    },
    {
      id: 'PT 61-70 Traverse Ngozi Landslip',
      type: 'StartsUsing',
      netRegex: { id: 'AED3', source: 'Traverse Ngozi', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'PT 61-70 Forgiven Voracity Stone Gaze',
      type: 'StartsUsing',
      netRegex: { id: 'AECA', source: 'Forgiven Voracity', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'PT 61-70 Forgiven Voracity Body Slam',
      type: 'StartsUsing',
      netRegex: { id: 'AECB', source: 'Forgiven Voracity', capture: false },
      response: Responses.outOfMelee(),
    },
    // ---------------- Stone 70 Boss: Forgiven Zeal ----------------
    // A993 = Zealous Glower dummy self-cast, back-to-front line
    // A98E = Zealous Glower dummy self-cast, front-to-back line
    // A99A = Ardorous Eye dummy self-cast, clockwise ring
    // A99F = Ardorous Eye dummy self-cast, counterclockwise ring
    // A9A5 = 2000-mina Swing damage cast
    // A9A7 = Disorienting Groan damage cast
    // --- Octuple Swipe ---
    // A9A8 = dummy self-cast for castbar
    // A9A9 = instant, final damage cast
    // A9AA = instant, damage cast
    // A9AB = instant, damage cast
    // A9AC = instant, damage cast
    // A9AD = dummy cast showing telegraph
    {
      id: 'PT 61-70 Forgiven Zeal Zealous Glower',
      type: 'StartsUsing',
      netRegex: { id: ['A993', 'A98E'], source: 'Forgiven Zeal', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'PT 61-70 Forgiven Zeal Zealous Glower Dodge Direction',
      type: 'Ability',
      netRegex: { id: ['A993', 'A98E'], source: 'Forgiven Zeal', capture: true },
      durationSeconds: 15,
      infoText: (_data, matches, output) => {
        const dir = matches.id === 'A993' ? output.backFront!() : output.frontBack!();
        return output.text!({ dir: dir });
      },
      outputStrings: {
        text: {
          en: 'Dodge ${dir}',
        },
        backFront: {
          en: 'Back-to-front',
        },
        frontBack: {
          en: 'Front-to-back',
        },
      },
    },
    {
      id: 'PT 61-70 Forgiven Zeal Ardorous Eye',
      type: 'StartsUsing',
      netRegex: { id: ['A99A', 'A99F'], source: 'Forgiven Zeal', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'PT 61-70 Forgiven Zeal Ardorous Eye Dodge Direction',
      type: 'Ability',
      netRegex: { id: ['A99A', 'A99F'], source: 'Forgiven Zeal', capture: true },
      durationSeconds: 20,
      infoText: (_data, matches, output) => {
        const dir = matches.id === 'A99A' ? output.clockwise!() : output.counterclockwise!();
        return output.text!({ dir: dir });
      },
      outputStrings: {
        text: {
          en: 'Dodge ${dir}',
        },
        clockwise: Outputs.clockwise,
        counterclockwise: Outputs.counterclockwise,
      },
    },
    {
      id: 'PT 61-70 Forgiven Zeal Disorienting Groan',
      type: 'StartsUsing',
      netRegex: { id: 'A9A7', source: 'Forgiven Zeal', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'PT 61-70 Forgiven Zeal 2000-mina Swing',
      type: 'StartsUsing',
      netRegex: { id: 'A9A5', source: 'Forgiven Zeal', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'PT 61-70 Forgiven Zeal Octuple Swipe Cleanup',
      type: 'Ability',
      netRegex: { id: 'A9A9', source: 'Forgiven Zeal', capture: false },
      run: (data) => {
        delete data.octupleSwipes;
        delete data.calledOctupleSwipes;
      },
    },
    {
      id: 'PT 61-70 Forgiven Zeal Octuple Swipe',
      type: 'StartsUsingExtra',
      netRegex: { id: 'A9AD', capture: true },
      condition: (data) => !data.calledOctupleSwipes,
      durationSeconds: 18,
      alertText: (data, matches, output) => {
        const heading = Directions.hdgTo4DirNum(parseFloat(matches.heading));
        data.octupleSwipes ??= [];
        data.octupleSwipes.push(heading);

        if (data.octupleSwipes.length < 8)
          return;

        data.calledOctupleSwipes = true;
        const [swipe1, swipe4, swipe5, swipe8] = [
          data.octupleSwipes[0],
          data.octupleSwipes[3],
          data.octupleSwipes[4],
          data.octupleSwipes[7],
        ];

        if (
          swipe1 === undefined ||
          swipe4 === undefined ||
          swipe5 === undefined ||
          swipe8 === undefined
        )
          return output.avoid!();

        const dir1 = outputRelativeFrom4DirNum(swipe1);
        const dir4 = outputRelativeFrom4DirNum(swipe4);
        const dir5 = outputRelativeFrom4DirNum(swipe5);
        const dir8 = outputRelativeFrom4DirNum(swipe8);

        if (swipe1 === swipe8)
          // swipe order is 1 > 2 > 3 > 4 > 5 > 6 > 7 > 1
          // dodge order is 4 > 1 > 1 > 1 > 1 > 1 > 1 > 4
          return output.rewind!({ dir4: output[dir4]!(), dir1: output[dir1]!() });

        // swipe order is 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8
        // dodge order is 4 > 1 > 1 > 1 > 8 > 5 > 5 > 5
        return output.repeat!({
          dir1: output[dir1]!(),
          dir4: output[dir4]!(),
          dir5: output[dir5]!(),
          dir8: output[dir8]!(),
        });
      },
      outputStrings: {
        repeat: {
          en: '${dir4} => ${dir1} x3 => ${dir8} => ${dir5} x3',
        },
        rewind: {
          en: '${dir4} => ${dir1} x6 => ${dir4}',
        },
        avoid: {
          en: 'Avoid swipes x8',
        },
        left: Outputs.left,
        right: Outputs.right,
        front: Outputs.front,
        back: Outputs.back,
      },
    },
  ],
};

export default triggerSet;
