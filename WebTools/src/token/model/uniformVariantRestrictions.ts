import { Division } from '../../common/character';
import { Rank } from '../../helpers/ranks';
import { Species } from '../../helpers/speciesEnum';
import { BodyType } from './bodyTypeEnum';
import { DivisionColors } from './divisionColors';
import { isCadetRank, isEnlistedRank, isFlagRank } from './rankHelper';
import type { TokenModel } from './tokenModel';
import { UniformEra } from './uniformEra';
import { UniformVariantType } from './uniformVariantTypeEnum';

// While it's tempting to merge this functionality into the Uniform Pack for encapsulation
// purposes, it needs to be bundled with the main bundle (with the Redux stuff)
export class UniformVariantRestrictions {
  static getAvailableVariants(
    uniformEra: UniformEra,
    bodyType: BodyType,
    species: Species,
    divisionColor: string,
    rank: Rank,
  ) {
    const result = [UniformVariantType.Base];

    if (uniformEra === UniformEra.MonsterMaroon) {
      if ('Medical' === DivisionColors.getDivision(uniformEra, divisionColor)) {
        result.push(UniformVariantType.Variant1); // medical whites
      } else if (
        'HelmEngineering' ===
          DivisionColors.getDivision(uniformEra, divisionColor) &&
        bodyType === BodyType.AverageFemale
      ) {
        result.push(UniformVariantType.Variant1); // engineeing suit
      }
      result.push(UniformVariantType.Variant2);
    } else if (uniformEra === UniformEra.OriginalSeriesKlingon) {
      if (bodyType === BodyType.AverageMale && rank === Rank.Captain) {
        result.push(UniformVariantType.Variant1); // Klingon sash
      }
    } else if (uniformEra === UniformEra.Klingon) {
      if (bodyType === BodyType.AverageMale && rank === Rank.Captain) {
        result.push(UniformVariantType.Variant1); // Klingon sash
        result.push(UniformVariantType.Variant3); // Kruge
      }
      result.push(UniformVariantType.Variant2); // Klingon vest or Key'lehr
    } else if ([UniformEra.Discovery32].includes(uniformEra)) {
      if (!isCadetRank(rank)) {
        result.push(UniformVariantType.Variant1);
      }
    } else if ([UniformEra.StarfleetAcademy].includes(uniformEra)) {
      if (!isCadetRank(rank)) {
        result.push(UniformVariantType.Variant1);
        result.push(UniformVariantType.Variant2);
      }
    } else if (uniformEra === UniformEra.Prodigy) {
      if (!isCadetRank(rank)) {
        result.push(UniformVariantType.Variant1);
      }
    } else if (uniformEra === UniformEra.StrangeNewWorlds) {
      if (DivisionColors.getDivision(uniformEra, divisionColor) === 'Medical') {
        result.push(UniformVariantType.Variant2);
      }
    } else if (uniformEra === UniformEra.StarTrekOnline) {
      if (
        DivisionColors.getDivision(uniformEra, divisionColor) ===
          Division[Division.Command] &&
        rank === Rank.Captain
      ) {
        result.push(UniformVariantType.Variant1);
      } else if (
        DivisionColors.getDivision(uniformEra, divisionColor) ===
          Division[Division.Science] &&
        !isEnlistedRank(rank) &&
        !isFlagRank(rank)
      ) {
        result.push(UniformVariantType.Variant1);
      }
    } else if (uniformEra === UniformEra.Civilian) {
      if (bodyType === BodyType.AverageNonBinary) {
      } else {
        result.push(UniformVariantType.Variant1);
        result.push(UniformVariantType.Variant2);
        result.push(UniformVariantType.Variant3);
        result.push(UniformVariantType.Variant4);
        result.push(UniformVariantType.Variant5);
        result.push(UniformVariantType.Variant6);
        result.push(UniformVariantType.Variant7);
        result.push(UniformVariantType.Variant8);
        result.push(UniformVariantType.Variant9);
        result.push(UniformVariantType.Variant10);
        result.push(UniformVariantType.Variant11);
        result.push(UniformVariantType.Variant12);
        result.push(UniformVariantType.Variant13);
        result.push(UniformVariantType.Variant14);
        if (bodyType === BodyType.AverageMale) {
          result.push(UniformVariantType.Variant15);
        }
      }
    } else if (uniformEra === UniformEra.TheMotionPicture) {
      result.push(UniformVariantType.Variant1);
    } else if (uniformEra === UniformEra.OriginalSeries) {
      if (species === Species.Edosian) {
      } else {
        if (
          bodyType !== BodyType.AverageNonBinary &&
          DivisionColors.getDivision(uniformEra, divisionColor) === 'Command' &&
          (rank === Rank.Captain || rank === Rank.Commodore)
        ) {
          result.push(UniformVariantType.Variant1);
        }
        if (bodyType === BodyType.AverageMale) {
          result.push(UniformVariantType.Variant2);
        }
      }
    }
    return result;
  }

  static isVariantOptionsAvailable(token: TokenModel) {
    return (
      this.getAvailableVariants(
        token.uniformEra,
        token.bodyType,
        token.species,
        token.divisionColor,
        token.rankIndicator,
      ).length > 1
    );
  }

  static isRankSupported(rankIndicator: Rank, uniformEra: UniformEra) {
    switch (uniformEra) {
      case UniformEra.DominionWar:
        return [
          Rank.None,
          Rank.Ensign,
          Rank.LieutenantJG,
          Rank.Lieutenant,
          Rank.LtCommander,
          Rank.Commander,
          Rank.Captain,
          Rank.CadetFirstClass,
          Rank.CadetSecondClass,
          Rank.CadetThirdClass,
          Rank.CadetFourthClass,
          Rank.Crewman3rdClass,
          Rank.Crewman2ndClass,
          Rank.Crewman1stClass,
          Rank.PettyOfficer3rdClass,
          Rank.PettyOfficer2ndClass,
          Rank.PettyOfficer1stClass,
          Rank.ChiefPettyOfficer,
          Rank.SeniorChiefPettyOfficer,
          Rank.MasterChiefPettyOfficer,
          Rank.RearAdmiral,
          Rank.ViceAdmiral,
          Rank.Admiral,
        ].includes(rankIndicator);
      case UniformEra.NextGeneration:
      case UniformEra.VoyagerDS9:
        return [
          Rank.None,
          Rank.Ensign,
          Rank.LieutenantJG,
          Rank.Lieutenant,
          Rank.LtCommander,
          Rank.Commander,
          Rank.Captain,
          Rank.Crewman3rdClass,
          Rank.Crewman2ndClass,
          Rank.Crewman1stClass,
          Rank.PettyOfficer3rdClass,
          Rank.PettyOfficer2ndClass,
          Rank.PettyOfficer1stClass,
          Rank.ChiefPettyOfficer,
          Rank.SeniorChiefPettyOfficer,
          Rank.MasterChiefPettyOfficer,
          Rank.RearAdmiral,
          Rank.ViceAdmiral,
          Rank.Admiral,
        ].includes(rankIndicator);

      case UniformEra.StarTrekOnline:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
            Rank.Crewman3rdClass,
            Rank.Crewman2ndClass,
            Rank.Crewman1stClass,
            Rank.Admiral,
            Rank.ViceAdmiral,
            Rank.RearAdmiral,
          ].indexOf(rankIndicator) >= 0
        );

      case UniformEra.Prodigy:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
            Rank.CadetFirstClass,
            Rank.CadetSecondClass,
            Rank.CadetThirdClass,
            Rank.CadetFourthClass,
          ].indexOf(rankIndicator) >= 0
        );

      case UniformEra.Picard25:
      case UniformEra.LowerDecks:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
            Rank.Crewman3rdClass,
            Rank.Crewman2ndClass,
            Rank.Crewman1stClass,
            Rank.PettyOfficer3rdClass,
            Rank.PettyOfficer2ndClass,
            Rank.PettyOfficer1stClass,
            Rank.ChiefPettyOfficer,
            Rank.SeniorChiefPettyOfficer,
            Rank.MasterChiefPettyOfficer,
          ].indexOf(rankIndicator) >= 0
        );

      case UniformEra.MonsterMaroon:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
            Rank.Crewman3rdClass,
            Rank.Crewman2ndClass,
            Rank.Crewman1stClass,
            Rank.PettyOfficer2ndClass,
            Rank.PettyOfficer1stClass,
            Rank.ChiefPettyOfficer,
            Rank.SeniorChiefPettyOfficer,
          ].indexOf(rankIndicator) >= 0
        );

      case UniformEra.Enterprise:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
            Rank.Crewman3rdClass,
            Rank.Crewman2ndClass,
            Rank.Crewman1stClass,
          ].indexOf(rankIndicator) >= 0
        );

      case UniformEra.Maco:
        return (
          [
            Rank.None,
            Rank.Colonel,
            Rank.LieutenantColonel,
            Rank.Major,
            Rank.Captain,
            Rank.FirstLieutenant,
            Rank.SecondLieutenant,
            Rank.Sergeant,
            Rank.Corporal,
            Rank.Private,
          ].indexOf(rankIndicator) >= 0
        );

      case UniformEra.Bynar:
      case UniformEra.Civilian:
      case UniformEra.Ferengi:
      case UniformEra.Cardassian:
      case UniformEra.Suliban:
      case UniformEra.Romulan:
      case UniformEra.None:
      case UniformEra.Tzenkethi:
        return [Rank.None].indexOf(rankIndicator) >= 0;

      case UniformEra.Discovery23:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
          ].indexOf(rankIndicator) >= 0
        );
      case UniformEra.StrangeNewWorlds:
      case UniformEra.OriginalSeries:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
            Rank.Commodore,
          ].indexOf(rankIndicator) >= 0
        );

      case UniformEra.StarfleetAcademy:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
            Rank.CadetFirstClass,
            Rank.CadetSecondClass,
            Rank.CadetThirdClass,
            Rank.CadetFourthClass,
          ].indexOf(rankIndicator) >= 0
        );
      default:
        return (
          [
            Rank.None,
            Rank.Ensign,
            Rank.LieutenantJG,
            Rank.Lieutenant,
            Rank.LtCommander,
            Rank.Commander,
            Rank.Captain,
          ].indexOf(rankIndicator) >= 0
        );
    }
  }

  static getSupportedBodyTypes(uniformEra: UniformEra) {
    if (
      uniformEra === UniformEra.Civilian ||
      uniformEra === UniformEra.DominionWar ||
      uniformEra === UniformEra.Picard25 ||
      uniformEra === UniformEra.OriginalSeries
    ) {
      return [
        BodyType.AverageMale,
        BodyType.AverageFemale,
        BodyType.AverageNonBinary,
      ];
    } else {
      return [BodyType.AverageMale, BodyType.AverageFemale];
    }
  }
}
