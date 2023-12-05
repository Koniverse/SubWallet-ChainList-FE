import {BaseService} from "./BaseService";

class ChainService extends BaseService{
    path = () => 'chains';
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ChainService();  // Singleton
