
export enum AssetStatType {
    Medical,
    Military,
    Personal,
    Science,
    Social
}

export const allAssetStatTypes = (): AssetStatType[] => {
    return Object.keys(AssetStatType).filter((item) => {
        return !isNaN(Number(item));
    }).map(item => Number(item));
}