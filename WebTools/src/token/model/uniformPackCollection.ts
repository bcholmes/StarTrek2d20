import { DominionWarUniformPack } from './dominionWarUniformPack';
import { UniformEra } from './uniformEra';
import type { IUniformPack } from './uniformPack';
import { NoneUniformPack } from './noneUniformPack';
import toast from 'react-hot-toast';

export class UniformPackCollection {
  uniformPacks: { [era: number]: IUniformPack } = {};

  private static singleton: UniformPackCollection;

  public static get instance() {
    if (UniformPackCollection.singleton == null) {
      UniformPackCollection.singleton = new UniformPackCollection();
    }
    UniformPackCollection.singleton.uniformPacks[UniformEra.DominionWar] =
      new DominionWarUniformPack();
    UniformPackCollection.singleton.uniformPacks[UniformEra.None] =
      new NoneUniformPack();
    return UniformPackCollection.singleton;
  }

  getUniformPack(uniformEra: UniformEra) {
    if (this.isLoaded(uniformEra)) {
      return this.uniformPacks[uniformEra];
    } else {
      return this.uniformPacks[UniformEra.DominionWar];
    }
  }

  async loadUniformPack(era: UniformEra, completion: () => void = () => {}) {
    if (this.isLoaded(era)) {
      completion();
    } else {
      try {
        if (era === UniformEra.Bynar) {
          const { BynarUniformPack } = await import(
            /* webpackChunkName: 'bynarUniform' */ './bynarUniformPack'
          );
          this.uniformPacks[era] = new BynarUniformPack();
          completion();
        } else if (era === UniformEra.Cardassian) {
          const { CardassianUniformPack } = await import(
            /* webpackChunkName: 'bynarUniform' */ './cardassianUniformPack'
          );
          this.uniformPacks[era] = new CardassianUniformPack();
          completion();
        } else if (era === UniformEra.Civilian) {
          const { CivilianOutfitUniformPack } = await import(
            /* webpackChunkName: 'civilianUniform' */ './civilianOutfitUniformPack'
          );
          this.uniformPacks[era] = new CivilianOutfitUniformPack();
          completion();
        } else if (era === UniformEra.Ferengi) {
          const { FerengiUniformPack } = await import(
            /* webpackChunkName: 'ferengiUniform' */ './ferengiUniformPack'
          );
          this.uniformPacks[era] = new FerengiUniformPack();
          completion();
        } else if (era === UniformEra.Klingon) {
          const { KlingonArmorUniformPack } = await import(
            /* webpackChunkName: 'klingonUniform' */ './klingonArmorUniformPack'
          );
          this.uniformPacks[era] = new KlingonArmorUniformPack();
          completion();
        } else if (era === UniformEra.OriginalSeriesKlingon) {
          const { TosKlingonUniformPack } = await import(
            /* webpackChunkName: 'klingonUniform' */ './tosKlingonUniformPack'
          );
          this.uniformPacks[era] = new TosKlingonUniformPack();
          completion();
        } else if (era === UniformEra.Enterprise) {
          const { EnterpriseUniformPack } = await import(
            /* webpackChunkName: 'enterpriseUniform' */ './enterpriseUniformPack'
          );
          this.uniformPacks[era] = new EnterpriseUniformPack();
          completion();
        } else if (era === UniformEra.MonsterMaroon) {
          const { MonsterMaroonUniformPack } = await import(
            /* webpackChunkName: 'monsterMaroonUniform' */ './monsterMaroonUniformPack'
          );
          this.uniformPacks[era] = new MonsterMaroonUniformPack();
          completion();
        } else if (era === UniformEra.OriginalSeries) {
          const { TosUniformPack } = await import(
            /* webpackChunkName: 'tosUniform' */ './tosUniformPack'
          );
          this.uniformPacks[era] = new TosUniformPack();
          completion();
        } else if (era === UniformEra.VoyagerDS9) {
          const { VoyagerUniformPack } = await import(
            /* webpackChunkName: 'voyagerDs9Uniform' */ './voyagerUniformPack'
          );
          this.uniformPacks[era] = new VoyagerUniformPack();
          completion();
        } else if (era === UniformEra.LowerDecks) {
          const { LowerDecksUniformPack } = await import(
            /* webpackChunkName: 'lowerDecksUniform' */ './lowerDecksUniformPack'
          );
          this.uniformPacks[era] = new LowerDecksUniformPack();
          completion();
        } else if (era === UniformEra.JemHadar) {
          const { JemHadarUniformPack } = await import(
            /* webpackChunkName: 'jemHadar' */ './jemHadarUniformPack'
          );
          this.uniformPacks[era] = new JemHadarUniformPack();
          completion();
        } else if (era === UniformEra.Maco) {
          const { MacoUniformPack } = await import(
            /* webpackChunkName: 'maco' */ './macoUniformPack'
          );
          this.uniformPacks[era] = new MacoUniformPack();
          completion();
        } else if (era === UniformEra.NextGeneration) {
          const { TngUniformPack } = await import(
            /* webpackChunkName: 'tng' */ './tngUniformPack'
          );
          this.uniformPacks[era] = new TngUniformPack();
          completion();
        } else if (era === UniformEra.StarTrekOnline) {
          const { StoUniformPack } = await import(
            /* webpackChunkName: 'sto' */ './stoUniformPack'
          );
          this.uniformPacks[era] = new StoUniformPack();
          completion();
        } else if (era === UniformEra.Romulan) {
          const { RomulanUniformPack } = await import(
            /* webpackChunkName: 'romulan' */ './romulanUniformPack'
          );
          this.uniformPacks[era] = new RomulanUniformPack();
          completion();
        } else if (era === UniformEra.RomulanNemesis) {
          const { RomulanNemesisUniformPack } = await import(
            /* webpackChunkName: 'romulan' */ './romulanNemesisUniformPack'
          );
          this.uniformPacks[era] = new RomulanNemesisUniformPack();
          completion();
        } else if (era === UniformEra.StrangeNewWorlds) {
          const { StrangeNewWorldsUniformPack } = await import(
            /* webpackChunkName: 'strangeNewWorlds' */ './strangeNewWorldsUniformPack'
          );
          this.uniformPacks[era] = new StrangeNewWorldsUniformPack();
          completion();
        } else if (era === UniformEra.Suliban) {
          const { SulibanUniformPack } = await import(
            /* webpackChunkName: 'suliban' */ './sulibanUniformPack'
          );
          this.uniformPacks[era] = new SulibanUniformPack();
          completion();
        } else if (era === UniformEra.Tzenkethi) {
          const { TzenkethiArmourUniformPack } = await import(
            /* webpackChunkName: 'tzenkethi' */ './tzenkethiArmourUniformPack'
          );
          this.uniformPacks[era] = new TzenkethiArmourUniformPack();
          completion();
        } else if (era === UniformEra.Picard25) {
          const { Picard25thCenturyUniformPack } = await import(
            /* webpackChunkName: 'picard' */ './picard25thCenturyUniformPack'
          );
          this.uniformPacks[era] = new Picard25thCenturyUniformPack();
          completion();
        } else if (era === UniformEra.PicardRomulanEvacuation) {
          const { PicardRomulanEvacuationUniformPack } = await import(
            /* webpackChunkName: 'picard' */ './picardRomulanEvacuationUniformPack'
          );
          this.uniformPacks[era] = new PicardRomulanEvacuationUniformPack();
          completion();
        } else if (era === UniformEra.Discovery23) {
          const { Discovery23UniformPack } = await import(
            /* webpackChunkName: 'discovery' */ './discovery23UniformPack'
          );
          this.uniformPacks[era] = new Discovery23UniformPack();
          completion();
        } else if (era === UniformEra.TheMotionPicture) {
          const { TmpUniformPack } = await import(
            /* webpackChunkName: 'motionPicture' */ './tmpUniformPack'
          );
          this.uniformPacks[era] = new TmpUniformPack();
          completion();
        } else if (era === UniformEra.Discovery32) {
          const { Discovery32UniformPack } = await import(
            /* webpackChunkName: 'discovery' */ './discovery32UniformPack'
          );
          this.uniformPacks[era] = new Discovery32UniformPack();
          completion();
        } else if (era === UniformEra.StarfleetAcademy) {
          const { StarfleetAcademyUniformPack } = await import(
            /* webpackChunkName: 'starfleetAcademy' */ './starfleetAcademyUniformPack'
          );
          this.uniformPacks[era] = new StarfleetAcademyUniformPack();
          completion();
        } else if (era === UniformEra.Prodigy) {
          const { ProdigyUniformPack } = await import(
            /* webpackChunkName: 'prodigy' */ './prodigyUniformPack'
          );
          this.uniformPacks[era] = new ProdigyUniformPack();
          completion();
        } else {
          this.createUniformPack(era);
          completion();
        }
      } catch (e) {
        toast('Ooops. Something bad happened', { className: 'bg-danger' });
      }
    }
  }

  private createUniformPack(era: UniformEra) {
    return new DominionWarUniformPack();
  }

  isLoaded(uniformEra: UniformEra) {
    return this.uniformPacks[uniformEra] != null;
  }
}
