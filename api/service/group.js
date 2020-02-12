import config from "../config";
import { requestAsync } from "../../utils/request.js";

const groupUrl=`${config.host}/pages/group`;

export function getGroupInfo() {
  return requestAsync({
    url: `${groupUrl}/created`,
    method: 'GET',
    data,
  });
}




