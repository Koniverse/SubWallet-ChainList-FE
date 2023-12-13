import {BaseService} from "./BaseService";

class BuyTokenConfigService extends BaseService{
    path = () => 'buy-token-configs';
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new BuyTokenConfigService();  // Singleton
