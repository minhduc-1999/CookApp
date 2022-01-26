import { UtilsService } from "providers/utils.service";

export default {
  scheme: UtilsService.getConfig('NEO4J_SCHEME'),
  host: UtilsService.getConfig("NEO4J_HOST"),
  port: UtilsService.getConfig("NEO4J_PORT"),
  username: UtilsService.getConfig("NEO4J_USERNAME"),
  password: UtilsService.getConfig("NEO4J_PASSWORD"),
  database: UtilsService.getConfig("NEO4J_DATABASE")
}
