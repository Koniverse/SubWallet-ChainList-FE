import {BaseService} from "./BaseService";

class CrowdloanService extends BaseService{
    path = () => 'crowdloan-funds';
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CrowdloanService();  // Singleton
