import { t } from "i18next";
import { navigateTo } from "../common/navigator";
import { makeKey } from "../common/translationKey";
import { PageIdentity } from "../pages/pageIdentity";
import { MilestoneType } from "./model/milestoneType";
import { NavigateFunction, useNavigate } from "react-router";
import { ModificationType } from "./model/modificationType";

export interface IModifyBreadcrumbProperties {
  modificationType?: ModificationType;
  milestoneType?: MilestoneType;
  isComplete?: boolean;
}

const goToHome = (
  e: React.MouseEvent<HTMLAnchorElement>,
  navigate: NavigateFunction
) => {
  e.preventDefault();
  e.stopPropagation();

  navigate("/");
};

export const ModifyBreadcrumb = (props: IModifyBreadcrumbProperties) => {
  const { modificationType, milestoneType, isComplete } = props;
  const navigate = useNavigate();

  // Default is Type Selection
  let activePageTitle = "modificationTypeSelection";

  if (isComplete) activePageTitle = "modificationComplete";
  // It's a numeric enum, we can't do the regular falsy here with a 0.
  else if (milestoneType > -1) activePageTitle = MilestoneType[milestoneType];
  else {
    switch (modificationType) {
      case ModificationType.Freeform:
        activePageTitle = "modificationFreeform";
        break;
      case ModificationType.Promotion:
        activePageTitle = "promotion";
        break;
      case ModificationType.Reputation:
        activePageTitle = "reputationChange";
        break;
    }
  }

  activePageTitle = makeKey("Page.title.", activePageTitle);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => goToHome(e, navigate)}>{t("Page.title.home")}</a></li>
        { milestoneType > -1 ? (
            <li className="breadcrumb-item"><a href="/index.html" onClick={(e) => navigateTo(e, PageIdentity.ModificationTypeSelection)}>
                {t("Page.title.modificationTypeSelection")}
              </a></li>
          ) : null
        }
        <li className="breadcrumb-item active" aria-current="page">{t(activePageTitle)}</li>
      </ol>
    </nav>
  );
};
