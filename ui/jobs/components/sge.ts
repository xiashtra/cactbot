import EffectId from '../../../resources/effect_id';
import TimerBox from '../../../resources/timerbox';
import { JobDetail } from '../../../types/event';
import { ResourceBox } from '../bars';
import { kAbility } from '../constants';
import { PartialFieldMatches } from '../event_emitter';

import { BaseComponent, ComponentInterface } from './base';

export class SGEComponent extends BaseComponent {
  stacksContainer: HTMLDivElement;
  addersgallStacks: HTMLDivElement[];
  adderstingStacks: HTMLDivElement[];
  adderTimerBox: ResourceBox;
  eukrasianDosis: TimerBox;
  phlegma: TimerBox;
  psyche: TimerBox;
  lucidDream: TimerBox;

  constructor(o: ComponentInterface) {
    super(o);

    // addersgall and addersting stacks
    this.stacksContainer = document.createElement('div');
    this.stacksContainer.id = 'sge-stacks';
    this.stacksContainer.classList.add('stacks');
    this.bars.addJobBarContainer().appendChild(this.stacksContainer);

    const addersgallStacksConstainer = document.createElement('div');
    addersgallStacksConstainer.id = 'sge-stacks-addersgall';
    this.stacksContainer.appendChild(addersgallStacksConstainer);

    const adderstingStacksConstainer = document.createElement('div');
    adderstingStacksConstainer.id = 'sge-stacks-addersting';
    this.stacksContainer.appendChild(adderstingStacksConstainer);

    this.addersgallStacks = [];
    this.adderstingStacks = [];

    for (let i = 0; i < 3; i++) {
      const addersgallStack = document.createElement('div');
      const adderstingStack = document.createElement('div');
      addersgallStacksConstainer.appendChild(addersgallStack);
      adderstingStacksConstainer.appendChild(adderstingStack);
      this.addersgallStacks.push(addersgallStack);
      this.adderstingStacks.push(adderstingStack);
    }

    this.eukrasianDosis = this.bars.addProcBox({
      id: 'sge-proc-dosis',
      fgColor: 'sge-color-dosis',
      notifyWhenExpired: true,
    });

    this.phlegma = this.bars.addProcBox({
      id: 'sge-proc-phlegma',
      fgColor: 'sge-color-phlegma',
    });

    this.psyche = this.bars.addProcBox({
      id: 'sge-proc-psyche',
      fgColor: 'sge-color-psyche',
    });

    this.lucidDream = this.bars.addProcBox({
      id: 'sge-proc-lucid',
      fgColor: 'sge-color-lucid',
    });

    this.adderTimerBox = this.bars.addResourceBox({
      classList: ['sge-color-adder'],
    });
    this.reset();
  }

  private _addActiveOnStacks(elements: HTMLDivElement[], stacks: number) {
    for (let i = 0; i < elements.length; i++)
      elements[i]?.classList.toggle('active', i < stacks);
  }

  override onUseAbility(id: string, matches: PartialFieldMatches<'Ability'>): void {
    switch (id) {
      case kAbility.Phlegma:
      case kAbility.Phlegma2:
      case kAbility.Phlegma3:
        if (matches.targetIndex === '0') { // Avoid multiple call in AOE
          this.phlegma.duration = 40 + this.phlegma.value;
        }
        break;
      case kAbility.Psyche:
        this.psyche.duration = 60;
        break;
      case kAbility.LucidDreaming:
        this.lucidDream.duration = 60;
        break;
    }
  }

  override onMobGainsEffectFromYou(id: string, matches: PartialFieldMatches<'GainsEffect'>): void {
    switch (id) {
      case EffectId.EukrasianDosis:
      case EffectId.EukrasianDosisIi:
      case EffectId.EukrasianDosisIii_A38:
      case EffectId.EukrasianDyskrasia:
        this.eukrasianDosis.duration = parseInt(matches.duration ?? '0', 10) - 0.5;
        break;
    }
  }

  override onJobDetailUpdate(jobDetail: JobDetail['SGE']): void {
    this._addActiveOnStacks(this.addersgallStacks, jobDetail.addersgall);
    this._addActiveOnStacks(this.adderstingStacks, jobDetail.addersting);

    const adderCountdown = Math.ceil((20000 - jobDetail.addersgallMilliseconds) / 1000);
    this.adderTimerBox.innerText = jobDetail.addersgall === 3 ? '' : adderCountdown.toString();
    this.adderTimerBox.parentNode.classList.toggle(
      'exceed',
      jobDetail.addersgall === 2 && adderCountdown < 6 || jobDetail.addersgall === 3,
    );
  }

  override onStatChange({ gcdSpell }: { gcdSpell: number }): void {
    this.eukrasianDosis.threshold = gcdSpell + 1;
    this.phlegma.threshold = gcdSpell + 1;
    this.psyche.threshold = gcdSpell + 1;
    this.lucidDream.threshold = gcdSpell + 1;
    // Due to unknown reason, if you sync to below lv45,
    // addersgall is not availble but memory still says you have 3 addersgall.
    // To avoid confusing, hide stacksContainer below lv45.
    // FIXME: return lv0 when loaded without status change, default show.
    this.stacksContainer.classList.toggle('hide', this.player.level < 45 && this.player.level > 0);
  }

  override reset(): void {
    this.eukrasianDosis.duration = 0;
    this.phlegma.duration = 0;
    this.psyche.duration = 0;
    this.lucidDream.duration = 0;
  }
}
