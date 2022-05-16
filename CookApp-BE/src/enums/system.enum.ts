export type RoleType = "sys-admin" | "user" | "nutritionist";

export type PostPermissionType =
  | "create_moment_post"
  | "create_share_food_post"
  | "create_recommendation_post"
  | "edit_post"
  | "delete_post"
  | "read_post"
  | "manage_post";

export type AlbumPermissionType =
  | "create_album"
  | "edit_album"
  | "delete_album"
  | "read_album"
  | "manage_album";

export type StoragePermissionType = "get_signed_url";

export type UserPermissionType =
  | "create_user"
  | "edit_user"
  | "delete_user"
  | "read_user"
  | "manage_user";

export type TopicPermisstionType =
  | "create_topic"
  | "read_topic"
  | "update_topic"
  | "delete_topic"
  | "manage_topic";

export type FoodPermisstionType =
  | "create_food"
  | "edit_food"
  | "delete_food"
  | "read_food"
  | "manage_food";

export type IngredientPermissionType =
  | "create_ingredient"
  | "edit_ingredient"
  | "delete_ingredient"
  | "read_ingredient"
  | "manage_ingredient";

export type UnitPermissionType =
  | "create_unit"
  | "edit_unit"
  | "delete_unit"
  | "read_unit"
  | "manage_unit";

export type RolePermissionType = "manage_role"

export type PermisstionType =
  | PostPermissionType
  | AlbumPermissionType
  | StoragePermissionType
  | UserPermissionType
  | TopicPermisstionType
  | FoodPermisstionType
  | IngredientPermissionType
  | UnitPermissionType
  | RolePermissionType
