import {BaseService} from "./BaseService";

class ChainAssetService extends BaseService{
    path = () => 'chain-assets';
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ChainAssetService();  // Singleton
