import {BaseService} from "./BaseService";

class ChainService extends BaseService{
    path = () => 'chains';
}

export default new ChainService();  // Singleton
